# React Forms Implementation Plan (Phased)

This plan aligns each phase with the official task requirements and 100‑point scoring criteria. Each phase should be one focused commit (or a very small set). All tests are deferred to the dedicated Testing Phase (Phase 11) per your request. Use conventional concise commit messages (examples included).

---

## Legend

- ✔ = Done (mark during progress)
- ☐ = Pending
- ⭐ = Optional / Enhancement (not required for points)
- (Score x) = Direct mapping to official scoring items

---

## High-Level Mapping to Scoring (100 Points)

| Scoring Item (Official)                                                                                    | Points | Phase     |
| ---------------------------------------------------------------------------------------------------------- | ------ | --------- |
| Universal modal via React Portal (both forms)                                                              | 15     | 2         |
| State management (Redux) storing data from both forms + correct modal behavior (ESC, outside click, focus) | 15     | 2 + 6 + 9 |
| Validation for BOTH forms with Zod (block submit, errors) (10 pts if only one)                             | 15     | 5         |
| Core fields (name, age, email, gender, T&C) in BOTH forms                                                  | 15     | 3 + 4     |
| Image input (base64, display after submit) for BOTH forms                                                  | 15     | 7         |
| Passwords + strength meter for BOTH forms                                                                  | 15     | 5         |
| Autocomplete (countries) for BOTH forms                                                                    | 10     | 8         |
| TOTAL                                                                                                      | 100    |           |

Penalties avoided via: TypeScript strict usage, no `any`, no UI libs, Zod chosen (not both Zod+Yup), coverage target ≥ 80%, clean commits & PR description.

---

## Phase 0: Readiness & Constraints (Context Only)

(No commit unless adjustments needed)

- Confirm branch `forms` exists (already created).
- Decide on file placement: feature folder `src/features/forms/`.
- Confirm dependencies to add later: `react-hook-form`, `@hookform/resolvers`.
- Zod already present; choose Zod (single validation library per Technical Requirements).

---

## Phase 1: Project & Feature Scaffolding

Commit: `forms: scaffold feature structure`

- Create folder structure:
  - `src/features/forms/components/` (shared field + modal UI pieces)
  - `src/features/forms/uncontrolled/` (uncontrolled form implementation)
  - `src/features/forms/rhf/` (React Hook Form implementation)
  - `src/features/forms/state/` (Redux slice for submissions + countries)
  - `src/features/forms/utils/` (password strength, base64, validation mappers)
  - `src/features/forms/types/` (shared DTO & form value types)
- Add placeholder page/entry (e.g. `app/[locale]/forms-demo/page.tsx`) linking to main modals.
- Add dependency (later actually install) list to README note section.
- No form logic yet; just structural exports.

---

## Phase 2: Universal Accessible Modal + Portal (Score: 15 pts part 1 / + supports later state points)

Commit: `forms: universal portal modal infra` (✔)

- ✔ Implement `<RootPortal />` using `createPortal` (DOM container appended to `document.body`).
- ✔ Modal component responsibilities: focus trap, initial focus, ESC close, outside click close, aria attributes (`role="dialog"`, `aria-modal="true"`, labelled by heading id).
- ✔ Provide a single modal component rendering arbitrary children (will host each form variant).
- ✔ Local component state controls modality (Redux deferred for submission data only).
- ✔ Keyboard trap utility & focus return implemented.
- ✔ Two buttons on demo page open each variant.
- ✔ Integration smoke with placeholders.
- ✔ (Added) `aria-live="polite"` region placeholder inside modal body (for later form-level status/errors).

---

## Phase 3: Uncontrolled Form (Core Fields Subset) (Part of 15 pts Core Fields) (✔)

Commit: `forms: uncontrolled form core fields` (✔)

- Add form markup using plain refs / `onSubmit` extraction.
- Fields: name, age, email, gender (radio or select), T&C checkbox.
- Preliminary inline validation placeholders (do not finalize blocking logic yet—finalized in Phase 5). For now: simple JS checks executed on submit, set error messages in component local state.
- Central constant keys referencing i18n translation keys (e.g. `forms.name.label`).
- Submit handler builds object and (temporarily) logs to console; no Redux dispatch yet.

---

## Phase 4: React Hook Form Version (Core Fields Mirror) (✔)

Commit: `forms: rhf form core fields` (✔)

- Install dependencies: `react-hook-form`, `@hookform/resolvers` (if not installed earlier).
- Implement RHF form mirroring same fields with minimal required validation rules (still placeholder messages; final unify in Phase 5).
- Shared UI primitives reused between both forms (Label, FieldWrapper, ErrorSlot).
- Ensure consistent layout to avoid layout shift when errors appear later.

---

## Phase 5: Full Validation & Password Strength (Score: 15 Validation + 15 Passwords)

Commit: `forms: validation + password strength (both forms)`

- Introduce Zod schema `UserRegistrationSchema` with refinements:
  - name: first letter uppercase regex
  - age: number ≥ 0 (sanitize to number)
  - email: email()
  - passwords: two fields, confirm match refine
  - password strength: custom refine requiring (1 digit, 1 upper, 1 lower, 1 special; min length as required). Provide helper returning a strength score 0–4 for UI meter.
  - gender: enum or union
  - termsAccepted: literal true
- RHF: integrate via `zodResolver` for live validation.
- Uncontrolled: run Zod `safeParse` on submit; map issues to field errors; block submission until valid.
- Implement password strength meter component (visual bar + textual descriptor) for both forms (uncontrolled version updates on `onInput` using separate function; RHF version uses watch()).
- Disable submit button if (RHF: `!formState.isValid || isSubmitting`; Uncontrolled: have local flag `hasErrors`).
- Uniform error rendering position (below each field) to avoid vertical jumps (reserve space via min-height styling).

---

## Phase 6: Redux Integration & Data Tiles (Remaining part of State Management score)

Commit: `forms: redux integration and data tiles`

- Create slice `formsSubmissionsSlice`:
  - state: `{ uncontrolledSubmissions: [], rhfSubmissions: [] }` (each item typed `UserRegistrationDTO` including base64 image placeholder field optional for now).
  - actions: `addUncontrolledSubmission`, `addRHFSubmission`.
  - selectors: `selectAllUncontrolled`, `selectAllRHF`.
- Dispatch add actions on successful validated submit (Phase 5 forms updated).
- Main page (forms demo) displays two tile grids (Uncontrolled / RHF) showing recent entries (exclude passwords from display; safe subset: name, age, email, gender, avatar thumbnail, submission timestamp).
- Highlight newest submission: apply CSS class + fade after e.g. 3s (using `useEffect`).

---

## Phase 7: Image Upload (Score: 15 Image Input)

Commit: `forms: image upload base64 for both forms`

- Shared component `ImageInput` supporting click + drag/drop.
- Validate file type (`image/png`, `image/jpeg`) & size limit (e.g. ≤ 1MB configurable).
- Convert to base64 (utility `fileToBase64(file)` returning Promise<string>), store in form state:
  - RHF: controlled via `setValue`.
  - Uncontrolled: ref + hidden input with base64 value OR local temp state merged before validation.
- Display preview inside modal before submit.
- On submit, include base64 string in submission slice; show thumbnail in tiles.
- Error messaging for invalid file (type/size) integrated into existing error pattern.

---

## Phase 8: Countries Autocomplete (Score: 10 Autocomplete)

Commit: `forms: countries autocomplete both forms`

- Add countries static dataset (JSON) or fetch once; store normalized list in Redux slice `countriesSlice` (preloaded on first page load or in layout effect). Keep full English list.
- Autocomplete component:
  - Input + dropdown list filtered by substring case-insensitive.
  - Keyboard navigation (ArrowDown/Up, Enter, Escape) & highlight.
  - Click outside closes list.
  - Accept selection sets country value (RHF via register/Controller; Uncontrolled via hidden input or local state).
- Validation: ensure country is one from list (Zod refine `countriesSet.has(value)`).
- Add country field to schema (Phase 5 schema updated now—if major change, increment version comment). Ensure BOTH forms include it.

---

## Phase 9: Accessibility & UX Polish (Completes Modal Behavior + UX)

Commit: `forms: accessibility and ux polish`

- Verify modal focus loop (tab & shift+tab) with tests to follow later.
- Screen reader labels: associate `<label htmlFor>` every input.
- Aria attributes: `aria-invalid`, `aria-describedby` for errors, `role="status"` for strength meter text.
- Prevent background scroll when modal open.
- Add ESC close event listener cleanup.
- Graceful animations (fade/scale) with reduced motion respect (`@media (prefers-reduced-motion: reduce)` disable transitions).
- Ensure consistent color contrast (Tailwind tokens) for error text and focus outlines.
- Performance: memoize heavy child components (e.g. Autocomplete list) to avoid re-renders.

---

## Phase 10: Refactoring & Compliance Prep

Commit: `forms: refactor & compliance prep`

- Remove any temporary console logs.
- Deduplicate utility code (password regex, validation messages) into `utils`.
- Enforce strict TypeScript (ensure no implicit `any`).
- Add JSDoc comments for critical utilities (password strength, fileToBase64, focus trap) for reviewer clarity.
- Update root README section: brief description of forms feature & how to run.
- Prepare PR checklist (score mapping) in PR template or description draft.

---

## Phase 11: Testing Suite (All Test Implementation)

Commit: `tests: forms feature full coverage`

- Testing tools: Vitest + RTL (already present). Increase coverage target to ≥ 80% statements.
- Test Categories:
  1. Modal / Portal:
     - Renders via portal (container presence) & unmount cleans up.
     - Focus initial & ESC close & outside click close.
  2. Uncontrolled Form:
     - Renders all required fields.
     - Submit with invalid data -> shows errors (name lowercase, age negative, password mismatch, weak strength, unchecked T&C, invalid email, empty gender, missing country).
     - Valid submission dispatches slice action & modal closes.
  3. RHF Form:
     - Live validation triggers on change / blur.
     - Disabled submit when invalid.
     - Password strength updates (assert classes/text for different strength inputs).
  4. Password Strength Utility:
     - Unit tests each rule and composite strength scoring.
  5. Image Input:
     - Accept valid file (mock File), rejects oversize/invalid type.
     - Converts to base64 (mock FileReader / use stubbed function if abstracted).
  6. Autocomplete:
     - Filters list, keyboard navigation, selection sets value.
     - Validation fails for non-listed country.
  7. Redux Slices:
     - Submissions slice reducers & selectors.
     - Countries slice load action.
  8. Integration (Tiles):
     - New submission tile appears highlighted then highlight removed after timeout (use fake timers).
- Coverage report saved; ensure no passwords stored or shown (assert absence of password fields in displayed tiles).
- Add minimal accessibility snapshot (axe-lite optional ⭐ if integrated).

---

## Optional Enhancements (⭐ After Core)

- Wizard variant of the form (multi-step) reusing same schema via step subsets.
- Persist draft in localStorage with debounce.
- Drag & drop reordering for contacts (if added beyond spec) via a field array pattern.
- Country flag icon next to autocomplete results.

---

## Anti-Penalty Checklist

- No UI component libraries imported (only custom Tailwind-based components).
- No `any` / `@ts-ignore` introduced.
- Zod exclusively used (avoid mixing Yup).
- Clean commit messages & timely PR creation.
- Test coverage ≥ 80% (record exact numbers in PR description).

---

## Commit Message Reference

- `forms: scaffold feature structure`
- `forms: universal portal modal infra`
- `forms: uncontrolled form core fields`
- `forms: rhf form core fields`
- `forms: validation + password strength (both forms)`
- `forms: redux integration and data tiles`
- `forms: image upload base64 for both forms`
- `forms: countries autocomplete both forms`
- `forms: accessibility and ux polish`
- `forms: refactor & compliance prep`
- `tests: forms feature full coverage`

---

## PR Description Template (Fill Later)

- Summary
- Phases Completed: checklist referencing phases above
- Score Mapping Table (reuse from this plan)
- Coverage Report (paste %)
- Manual Testing Steps
- Accessibility Notes

---

## Next Immediate Action

Finalize Phase 5 (validation + password strength) by:

1. Verifying uncontrolled form JSX + disabled logic (now fixed) and ensuring both forms block weak / mismatched passwords and show consistent error keys.
2. Quick manual regression pass (name, age, email, gender, terms, password strength) in both forms.

Then begin Phase 6: Redux integration (create submissions slice, dispatch on successful submit, render tiles) per plan above.
