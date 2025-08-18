import {
  PASSWORD_MIN_LENGTH,
  PASSWORD_UPPER_REGEX,
  PASSWORD_LOWER_REGEX,
  PASSWORD_DIGIT_REGEX,
  PASSWORD_SPECIAL_REGEX,
} from '../validation/validationConstants';

/**
 * Result returned by evaluatePasswordStrength.
 * Score scale (0–4) loosely corresponds to how many requirement buckets pass:
 * 0-1 buckets => 0, 2 => 1, 3 => 2, 4 => 3, all 5 => 4.
 */
export interface PasswordStrengthResult {
  score: 0 | 1 | 2 | 3 | 4;
  requirements: {
    length: boolean;
    upper: boolean;
    lower: boolean;
    digit: boolean;
    special: boolean;
  };
}

/**
 * Evaluate password strength against minimal criteria (length + character classes).
 * The function purposefully keeps logic simple while still encouraging variety.
 */
export function evaluatePasswordStrength(pw: string): PasswordStrengthResult {
  const requirements = {
    length: pw.length >= PASSWORD_MIN_LENGTH,
    upper: PASSWORD_UPPER_REGEX.test(pw),
    lower: PASSWORD_LOWER_REGEX.test(pw),
    digit: PASSWORD_DIGIT_REGEX.test(pw),
    special: PASSWORD_SPECIAL_REGEX.test(pw),
  };
  const passed = Object.values(requirements).filter(Boolean).length;
  // Basic mapping: 0-1 => 0, 2 =>1, 3=>2, 4=>3, 5=>4
  let score: PasswordStrengthResult['score'] = 0;
  if (passed >= 5) {
    score = 4;
  } else if (passed === 4) {
    score = 3;
  } else if (passed === 3) {
    score = 2;
  } else if (passed === 2) {
    score = 1;
  } else {
    score = 0;
  }
  return { score, requirements };
}
