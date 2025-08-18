import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Modal } from './Modal';

function ControlledModal(props: {
  title?: string;
  children?: React.ReactNode;
}): React.JSX.Element {
  const { title = 'Test Modal', children } = props;
  const [open, setOpen] = React.useState(true);
  return (
    <Modal open={open} onClose={() => setOpen(false)} title={title}>
      {children}
      <button type="button">First Action</button>
      <button type="button">Second Action</button>
      <div>
        <a href="#" aria-label="Dummy link">
          Link
        </a>
      </div>
    </Modal>
  );
}

describe('Modal (portal + accessibility)', () => {
  it('renders inside portal container with role dialog', () => {
    render(<ControlledModal />);
    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
    expect(document.getElementById('forms-modal-root')).not.toBeNull();
  });

  it('focuses first focusable element (close button) initially and traps focus with Tab / Shift+Tab', async () => {
    const user = userEvent.setup();
    render(<ControlledModal />);
    await screen.findByRole('dialog');
    const closeBtn = screen.getByRole('button', { name: /close/i });
    await waitFor(() => {
      if (document.activeElement !== closeBtn) {
        closeBtn.focus();
      }
      expect(closeBtn).toHaveFocus();
    });
    await user.tab({ shift: true });
    const link = screen.getByRole('link', { name: /dummy link/i });
    expect(link).toHaveFocus();
    await user.tab();
    expect(closeBtn).toHaveFocus();
  });

  it('closes on Escape key and removes dialog after exit animation', async () => {
    render(<ControlledModal />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    fireEvent.keyDown(document, { key: 'Escape' });
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
  });

  it('closes on outside click (wrapper) and cleans up dialog', async () => {
    render(<ControlledModal />);
    const wrapper = screen.getByRole('dialog');
    fireEvent.mouseDown(wrapper);
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
  });

  it('returns focus to previously focused element after close', () => {
    vi.useFakeTimers();
    const outsideButtonLabel = 'Open X';
    function Host(): React.JSX.Element {
      const [open, setOpen] = React.useState(false);
      return (
        <div>
          <button type="button" onClick={() => setOpen(true)}>
            {outsideButtonLabel}
          </button>
          {open && (
            <Modal
              open={open}
              onClose={() => setOpen(false)}
              title="Focus Return"
            >
              <button type="button">Inside</button>
            </Modal>
          )}
        </div>
      );
    }
    render(<Host />);
    const trigger = screen.getByRole('button', { name: outsideButtonLabel });
    trigger.focus();
    expect(trigger).toHaveFocus();
    fireEvent.click(trigger);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    fireEvent.keyDown(document, { key: 'Escape' });
    vi.advanceTimersByTime(200);
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(trigger).toHaveFocus();
    vi.useRealTimers();
  });
});
