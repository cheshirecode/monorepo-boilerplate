/* eslint-disable import/export */
import { cleanup, render } from '@testing-library/react';
import { SWRConfig } from 'swr';
import { afterEach } from 'vitest';

import ErrorBoundary from '@/components/ErrorBoundary';

afterEach(() => {
  cleanup();
});

const customRender = (ui: React.ReactElement, options = {}) =>
  render(ui, {
    // wrap provider(s) here if needed
    wrapper: ({ children }) => children,
    ...options
  });

// override render export
export { customRender as render };

export const NoCacheWrapper: BaseFC = ({ children }) => (
  <ErrorBoundary>
    <SWRConfig value={{ dedupingInterval: 0, provider: () => new Map() }}>{children}</SWRConfig>
  </ErrorBoundary>
);
