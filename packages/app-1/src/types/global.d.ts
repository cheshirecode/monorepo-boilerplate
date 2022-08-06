import type { FC, PropsWithChildren } from 'react';

export {};
declare global {
  interface BaseProps extends PropsWithChildren<unknown> {
    className?: string;
    ['data-testid']?: string;
  }

  type BaseFC = FC<BaseProps>;

}
