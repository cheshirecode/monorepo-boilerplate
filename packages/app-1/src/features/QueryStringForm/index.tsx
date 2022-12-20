import cx from 'classnames';
import { isFunction, merge } from 'lodash-es';
import { useCallback, useMemo } from 'react';

import Details from '@/components/Details';
import Field from '@/components/Field';

import type { QueryStringFormProps } from './typings';
import useQueryStringForm from './useQueryStringForm';

const QueryStringForm = (props: QueryStringFormProps) => {
  const {
    className,
    queryString: _queryString,
    onChange: _onChange,
    persistState: _persistState,
    metadata,
    fieldPropsByKey,
    ...rest
  } = props;
  const { searchParams, createSetter } = useQueryStringForm(props);
  const fieldRenderer = useCallback(
    (v, { k }) => {
      const fieldProps = {
        saveOnBlur: true,
        noConfirmation: true,
        set: createSetter(k),
        ...(isFunction(fieldPropsByKey) ? fieldPropsByKey(k) : {})
      };
      return <Field name={k} value={v} {...fieldProps} />;
    },
    [createSetter, fieldPropsByKey]
  );
  const finalMetadata = useMemo(
    () =>
      merge(metadata, {
        '*': {
          field: {
            render: fieldRenderer
          }
        }
      }),
    [fieldRenderer, metadata]
  );

  return (
    <Details
      {...rest}
      data={searchParams}
      className={cx('grid responsive-grid-kv gap-2', className)}
      labelClassName="px-2 color-secondary opacity-60"
      fieldClassName="px-2 color-primary truncate"
      metadata={finalMetadata}
    />
  );
};

export default QueryStringForm;
