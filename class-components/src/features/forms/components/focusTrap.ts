export function getFocusable(container: HTMLElement): HTMLElement[] {
  const selectors = [
    'a[href]',
    'area[href]',
    'button:not([disabled])',
    'input:not([disabled]):not([type=hidden])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    'iframe',
    'audio[controls]',
    'video[controls]',
    '[contenteditable="true"]',
    '[tabindex]:not([tabindex="-1"])',
  ];
  const nodes = Array.from(
    container.querySelectorAll<HTMLElement>(selectors.join(','))
  );
  return nodes.filter(
    (n) => !n.hasAttribute('disabled') && !n.getAttribute('aria-hidden')
  );
}

export function trapTabKey(e: KeyboardEvent, container: HTMLElement): void {
  if (e.key !== 'Tab') {
    return;
  }
  const focusable = getFocusable(container);
  if (!focusable.length) {
    return;
  }
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  const ae = document.activeElement;
  const active: HTMLElement | null =
    ae && ae instanceof HTMLElement ? ae : null;
  if (e.shiftKey) {
    if (active === first) {
      last.focus();
      e.preventDefault();
    }
  } else if (active === last) {
    first.focus();
    e.preventDefault();
  }
}
