import { createSlice } from '@reduxjs/toolkit';
import type { RootStateShape } from '@/store/types';
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
export const selectCountries = (state: RootStateShape): string[] =>
  state.countries.list;
