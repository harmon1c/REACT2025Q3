'use client';
import { createPortal } from 'react-dom';
import type React from 'react';
import { useEffect, useState } from 'react';

interface RootPortalProps {
  children: React.ReactNode;
  containerId?: string;
}

export function RootPortal({
  children,
  containerId = 'forms-modal-root',
}: RootPortalProps): React.JSX.Element | null {
  const [mounted, setMounted] = useState(false);
  const [el, setEl] = useState<HTMLElement | null>(null);

  useEffect(() => {
    let node = document.getElementById(containerId);
    if (!node) {
      node = document.createElement('div');
      node.setAttribute('id', containerId);
      document.body.appendChild(node);
    }
    setEl(node);
    setMounted(true);
  }, [containerId]);

  if (!mounted || !el) {
    return null;
  }
  return createPortal(children, el);
}
