import React from 'react';

interface StickyPanelProps {
  children: React.ReactNode;
  centered?: boolean;
  paddingClassName?: string;
  className?: string;
}

/**
 * Reusable sticky side panel wrapper used for pokemon detail flyout states.
 * Extracted to avoid repetition of a long Tailwind class string.
 */
export const StickyPanel: React.FC<StickyPanelProps> = ({
  children,
  centered = false,
  paddingClassName,
  className = '',
}) => {
  const base = [
    'sticky top-0 w-80 min-w-[320px] max-w-xs h-fit max-h-[600px] overflow-y-auto',
    'rounded-lg shadow-lg bg-white border border-gray-200',
    'dark:bg-gray-900 dark:border-gray-700',
  ];
  if (centered) {
    base.push('flex items-center justify-center');
  }
  base.push(paddingClassName ? paddingClassName : centered ? 'p-6' : 'p-4');
  if (className) {
    base.push(className);
  }
  return <div className={base.join(' ')}>{children}</div>;
};

export default StickyPanel;
