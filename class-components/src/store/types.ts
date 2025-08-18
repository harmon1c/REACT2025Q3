import type { FormsSubmissionsState } from '@/features/forms/state/formsSubmissionsSlice';
import type { CountriesState } from '@/features/forms/state/countriesSlice';
import type { SelectedItem } from './selectedItemsSlice';

export interface RootStateShape {
  formsSubmissions: FormsSubmissionsState;
  countries: CountriesState;
  selectedItems: { items: SelectedItem[] };
  pokemonApi: unknown;
}
