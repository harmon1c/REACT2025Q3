import { configureStore } from '@reduxjs/toolkit';
import formsSubmissionsReducer, {
  type FormsSubmissionsState,
  type FormSubmissionSafe,
  setAllSubmissions,
} from '@/features/forms/state/formsSubmissionsSlice';
import { countriesReducer } from '@/features/forms/state/countriesSlice';
import { pokemonApi } from '../api/pokemonApiSlice';
import selectedItemsReducer, { type SelectedItem } from './selectedItemsSlice';

function initPreloadedSelectedItems(): SelectedItem[] {
  if (typeof window === 'undefined') {
    return [];
  }
  try {
    const saved = window.localStorage.getItem('selectedItems');
    if (!saved) {
      return [];
    }
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function isRecord(val: unknown): val is Record<string, unknown> {
  return typeof val === 'object' && val !== null;
}
function isFormSubmissionSafe(value: unknown): value is FormSubmissionSafe {
  if (!isRecord(value)) {
    return false;
  }
  const id = value.id;
  const formType = value.formType;
  const name = value.name;
  const age = value.age;
  const email = value.email;
  const gender = value.gender;
  const createdAt = value.createdAt;
  return (
    typeof id === 'string' &&
    (formType === 'uncontrolled' || formType === 'rhf') &&
    typeof name === 'string' &&
    (typeof age === 'number' || age === null) &&
    typeof email === 'string' &&
    typeof gender === 'string' &&
    typeof createdAt === 'number'
  );
}
function loadPersistedSubmissions(): FormsSubmissionsState | undefined {
  if (typeof window === 'undefined') {
    return undefined;
  }
  try {
    const raw = window.localStorage.getItem('formsSubmissions');
    if (!raw) {
      return undefined;
    }
    const parsed = JSON.parse(raw);
    if (!isRecord(parsed)) {
      return undefined;
    }
    const uncontrolledRaw = Array.isArray(parsed.uncontrolled)
      ? parsed.uncontrolled
      : [];
    const rhfRaw = Array.isArray(parsed.rhf) ? parsed.rhf : [];
    const sanitize = (arr: unknown[]): FormSubmissionSafe[] => {
      const out: FormSubmissionSafe[] = [];
      for (const item of arr) {
        if (isFormSubmissionSafe(item)) {
          out.push({
            id: item.id,
            formType: item.formType,
            name: item.name,
            age: item.age,
            email: item.email,
            gender: item.gender,
            country:
              typeof item.country === 'string' ? item.country : undefined,
            avatarBase64:
              typeof item.avatarBase64 === 'string'
                ? item.avatarBase64
                : undefined,
            createdAt: item.createdAt,
          });
        }
      }
      return out;
    };
    const uncontrolled = sanitize(uncontrolledRaw);
    const rhf = sanitize(rhfRaw);
    if (uncontrolled.length === 0 && rhf.length === 0) {
      return undefined;
    }
    return { uncontrolled, rhf };
  } catch {
    return undefined;
  }
}

export function createAppStore(
  preloadedItems?: SelectedItem[]
): ReturnType<typeof configureStore> {
  const items = preloadedItems ?? initPreloadedSelectedItems();
  const store = configureStore({
    reducer: {
      selectedItems: selectedItemsReducer,
      formsSubmissions: formsSubmissionsReducer,
      countries: countriesReducer,
      [pokemonApi.reducerPath]: pokemonApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(pokemonApi.middleware),
    preloadedState: {
      selectedItems: { items },
    },
  });
  if (typeof window !== 'undefined') {
    const saved = loadPersistedSubmissions();
    if (saved) {
      store.dispatch(setAllSubmissions(saved));
    }
    let lastSerialized = '';
    store.subscribe(() => {
      const slice = store.getState().formsSubmissions;
      try {
        const serialized = JSON.stringify(slice);
        if (serialized !== lastSerialized) {
          window.localStorage.setItem('formsSubmissions', serialized);
          lastSerialized = serialized;
        }
      } catch {
        /* ignore */
      }
    });
  }
  return store;
}

export const store = createAppStore();

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
