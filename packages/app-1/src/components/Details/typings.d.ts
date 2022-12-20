import type { ReactNode } from 'react';

export type DetailsProps = BaseProps & {
  data: Record<string, ReactNode | ReactNode[]> | Record<string, unknown>;
  labelClassName?: string;
  fieldClassName?: string;
  fieldCopy?: boolean;
  /**
   * metadata to customise look and feel, based on key
   * * to apply to all. resolution order - key > * > null
   */
  metadata?: Record<
    keyof typeof DetailsProps['data'],
    Record<
      'label' | 'field',
      {
        fullLinePre?: boolean;
        className?: string;
        render?: (
          v: unknown,
          keyValue: { k: string; v: string | number | ReactNode | ReactNode[] },
          props?: Record<string, unknown>
        ) => ReactNode;
      }
    >
  >;
};
