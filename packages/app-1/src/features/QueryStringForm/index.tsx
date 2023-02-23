import cx from 'classnames';
import { isFunction, merge } from 'lodash-es';
import { useMemo } from 'react';

import Details from '@/components/Details';
import Field from '@/components/Field';

import type { QueryStringFormProps } from './typings';
import useQueryStringForm from './useQueryStringForm';

const QueryStringForm = (props: QueryStringFormProps) => {
  const {
    className,
    onQsChange,
    metadata = {},
    fieldPropsByKey,
    oneFieldPerLine,
    bigText,
    ...rest
  } = props;
  const { createSetter } = useQueryStringForm(props);

  const finalMetadata = useMemo(() => {
    const fieldRenderer = (v, { k }) => {
      const finalFieldProps = {
        saveOnBlur: true,
        noConfirmation: true,
        set: createSetter(k),
        ...(onQsChange ? {} : { readOnly: true }),
        ...(bigText ? { inputClassName: 'uno-layer-o:(h-10)', title: '' } : {}),
        ...(isFunction(fieldPropsByKey) ? fieldPropsByKey(k) : {})
      };
      return <Field name={k} value={v} {...finalFieldProps} />;
    };
    return merge(
      {},
      oneFieldPerLine
        ? {
            '*': {
              label: {
                className: 'col-span-2 xl:(col-span-3)'
              },
              field: {
                className: 'col-start-3 xl:(col-start-4) col-end--1'
              }
            }
          }
        : {},
      {
        '*': {
          field: {
            render: fieldRenderer
          }
        }
      },
      metadata
    );
  }, [bigText, createSetter, fieldPropsByKey, metadata, onQsChange, oneFieldPerLine]);

  return (
    <Details
      {...rest}
      className={cx('', bigText && 'font-gs-heading02 py-4', className)}
      labelClassName="color-secondary opacity-60"
      fieldClassName="color-primary truncate"
      metadata={finalMetadata}
      oneFieldPerLine={oneFieldPerLine}
    />
  );
};

export default QueryStringForm;
