/**
 * Shared validation-related regular expressions and constants used across
 * the registration forms (schema + password strength evaluation).
 * Centralizing them ensures a single source of truth and clearer intent.
 */

/** Name must start with a Latin or Cyrillic capital letter. */
export const NAME_CAPITAL_REGEX = /^[A-ZА-Я].*/;

/** At least one lowercase latin letter. */
export const PASSWORD_LOWER_REGEX = /[a-z]/;
/** At least one uppercase latin letter. */
export const PASSWORD_UPPER_REGEX = /[A-Z]/;
/** At least one digit. */
export const PASSWORD_DIGIT_REGEX = /\d/;
/** At least one non‑alphanumeric symbol. */
export const PASSWORD_SPECIAL_REGEX = /[^A-Za-z0-9]/;

/** Minimum password length required by the schema & strength meter. */
export const PASSWORD_MIN_LENGTH = 8;
