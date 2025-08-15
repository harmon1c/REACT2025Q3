import { createSlice } from '@reduxjs/toolkit';
import { countriesList } from '../utils/countriesList';

export interface CountriesState {
  list: string[];
}

const initialState: CountriesState = { list: countriesList };

const countriesSlice = createSlice({
  name: 'countries',
  initialState,
  reducers: {},
});

export const countriesReducer = countriesSlice.reducer;
export const selectCountries = <T extends { countries?: CountriesState }>(
  state: T
): string[] => state.countries?.list ?? [];
