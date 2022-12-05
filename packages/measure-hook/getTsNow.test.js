import { expect, it } from 'vitest';
import getTsNow from './getTsNow';

it('getTsNow()', async () => {
  const now = getTsNow();
  await new Promise((resolve) => {
    const wait = setTimeout(() => {
      clearTimeout(wait);
      resolve();
    }, 1000);

    return wait;
  });
  const after = getTsNow();
  expect(
    Math.floor((after - now - 1000) / 10),
    `2 timestamps after 1 second should differ by 1000ms with a margin of 0.1%`
  ).toBe(0);
});
