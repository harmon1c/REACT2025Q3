import { describe, it, expect } from 'vitest';
import { evaluatePasswordStrength } from './passwordStrength';

function buildPassword(options: {
  lower?: boolean;
  upper?: boolean;
  digit?: boolean;
  special?: boolean;
  length?: boolean;
}): string {
  let pw = '';
  if (options.lower) {
    pw += 'a';
  }
  if (options.upper) {
    pw += 'A';
  }
  if (options.digit) {
    pw += '1';
  }
  if (options.special) {
    pw += '!';
  }
  if (options.length) {
    while (pw.length < 8) {
      pw += 'x';
    }
  }
  return pw || 'a';
}

describe('evaluatePasswordStrength', () => {
  it('scores 0 when <=1 requirement bucket passes', () => {
    const r = evaluatePasswordStrength(buildPassword({ lower: true }));
    expect(r.score).toBe(0);
  });

  it('scores 1 when 2 buckets pass', () => {
    const r = evaluatePasswordStrength(
      buildPassword({ lower: true, upper: true })
    );
    expect(r.score).toBe(1);
  });

  it('scores 2 when 3 buckets pass', () => {
    const r = evaluatePasswordStrength(
      buildPassword({ lower: true, upper: true, digit: true })
    );
    expect(r.score).toBe(2);
  });

  it('scores 3 when 4 buckets pass', () => {
    const r = evaluatePasswordStrength(
      buildPassword({ lower: true, upper: true, digit: true, special: true })
    );
    expect(r.score).toBe(3);
  });

  it('scores 4 when all 5 buckets pass (includes length)', () => {
    const r = evaluatePasswordStrength(
      buildPassword({
        lower: true,
        upper: true,
        digit: true,
        special: true,
        length: true,
      })
    );
    expect(r.score).toBe(4);
  });

  it('requirements flags reflect matched categories', () => {
    const r = evaluatePasswordStrength(
      buildPassword({ lower: true, digit: true })
    );
    expect(r.requirements.lower).toBe(true);
    expect(r.requirements.digit).toBe(true);
    expect(r.requirements.upper).toBe(false);
    expect(r.requirements.special).toBe(false);
    expect(r.requirements.length).toBe(false);
  });
});
