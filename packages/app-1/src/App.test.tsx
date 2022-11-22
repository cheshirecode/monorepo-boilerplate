import { render } from '@testing-library/react';
import { expect, it } from 'vitest';

import App from './App';

it('can browse to the count page', async () => {
  const { getByText } = render(<App />);
  expect(getByText('@rush-monorepo-boilerplate/app-1')).toBeTruthy();
});
