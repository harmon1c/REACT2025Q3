import React from 'react';
import { evaluatePasswordStrength } from '../utils/passwordStrength';

interface StrengthMeterProps {
  password: string;
  id?: string;
}

const COLORS = [
  'bg-red-500',
  'bg-orange-500',
  'bg-yellow-500',
  'bg-green-500',
  'bg-emerald-600',
];

export function StrengthMeter({
  password,
  id,
}: StrengthMeterProps): React.JSX.Element {
  const { score } = evaluatePasswordStrength(password);
  const bars = [0, 1, 2, 3, 4];
  return (
    <div
      className="space-y-1"
      aria-live="polite"
      aria-atomic="true"
      role="status"
      id={id}
    >
      <div className="flex gap-1" aria-hidden="true">
        {bars.map((b) => (
          <div
            key={b}
            className={`h-1 flex-1 rounded transition-colors ${score >= b ? COLORS[score] : 'bg-gray-300 dark:bg-gray-700'}`}
          />
        ))}
      </div>
      <p className="text-[11px] text-gray-600 dark:text-gray-300">
        {`forms.status.strength_${score}`}
      </p>
    </div>
  );
}
