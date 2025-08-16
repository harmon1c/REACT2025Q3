import React from 'react';
import { Provider } from 'react-redux';
import { store, createAppStore } from '@/store';

export function renderNodeWithStore(
  node: React.ReactElement,
  customStore = store
): React.ReactElement {
  return <Provider store={customStore}>{node}</Provider>;
}

export function createTestStore(): ReturnType<typeof createAppStore> {
  return createAppStore([]);
}
