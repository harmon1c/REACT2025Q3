import type { JSX } from 'react';
import React from 'react';

interface PanelProps {
  children: React.ReactNode;
  className?: string;
  padding?: boolean;
  as?: keyof JSX.IntrinsicElements;
}

export const Panel: React.FC<PanelProps> = ({
  children,
  className = '',
  padding = true,
  as: Tag = 'div',
}) => {
  const base = [
    'rounded-2xl border border-gray-200/70 dark:border-gray-700/60 shadow-xl',
    'bg-white/95 backdrop-blur-sm dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-gray-900',
    'transition-colors duration-300',
  ];
  if (padding) {
    base.push('p-4 md:p-6');
  }
  if (className) {
    base.push(className);
  }
  return <Tag className={base.join(' ')}>{children}</Tag>;
};

export default Panel;
