// Score 0-4 based on length & char variety.
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

const UPPER = /[A-Z]/;
const LOWER = /[a-z]/;
const DIGIT = /\d/;
const SPECIAL = /[^A-Za-z0-9]/;

export function evaluatePasswordStrength(pw: string): PasswordStrengthResult {
  const requirements = {
    length: pw.length >= 8,
    upper: UPPER.test(pw),
    lower: LOWER.test(pw),
    digit: DIGIT.test(pw),
    special: SPECIAL.test(pw),
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
