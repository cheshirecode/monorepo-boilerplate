import styled from '@emotion/styled';
import cx from 'classnames';
import { isNil, isPlainObject, isString, mergeWith } from 'lodash-es';
import { Fragment } from 'react';

import createOnClickCopyToClipboard from '@/services/browser/createOnClickCopyToClipboard';

import type { DetailsProps } from './typings';

const StyledArticle = styled.article``;
const Details = (props: DetailsProps) => {
  const {
    className,
    labelClassName,
    fieldClassName,
    fieldCopy,
    data = {},
    metadata = {},
    responsiveGrid = true,
    ...rest
  } = props;

  return (
    <StyledArticle
      className={cx('', responsiveGrid && 'grid responsive-grid-kv gap-2', className)}
      {...rest}
    >
      {Object.keys(data).map((k) => {
        // resolution order - key > * > null
        const { label, field } = mergeWith(
          {},
          metadata['*'] ?? {},
          metadata[k] ?? {},
          (objValue, srcValue, key) => {
            if (key === 'className') {
              return cx(objValue, srcValue);
            }
          }
        );
        const v = data[k];
        // for object or array types, requires a custom renderer
        if ((Array.isArray(v) || isPlainObject(v)) && !field?.render) {
          return null;
        }

        const renderedKey = label?.render
          ? label?.render(k, { k, v }, props)
          : k.toLocaleUpperCase();
        const renderedValue = field?.render ? field?.render(v, { k, v }, props) : v;
        const displayValue = field?.render ? '' : v?.toString();
        if ([renderedValue, renderedKey].every(isNil)) {
          return null;
        }
        const isFieldCopyPossible = fieldCopy && !isNil(displayValue);
        return (
          <Fragment key={k}>
            {label?.fullLinePre && <span className="col-span-full" />}
            <span
              className={cx(
                'text-right border border-transparent',
                'color-secondary truncate opacity-60',
                label?.className,
                labelClassName
              )}
              {...(isString(renderedKey) ? { title: renderedKey } : {})}
            >
              {renderedKey}
            </span>
            {field?.fullLinePre && <span className="col-span-full" />}
            <span
              className={cx(
                '',
                'color-primary truncate',
                field?.className,
                isFieldCopyPossible &&
                  'cursor-copy border border-transparent @hover:(border-primary)',
                fieldClassName
              )}
              {...(displayValue ? { title: displayValue } : {})}
              {...(isFieldCopyPossible
                ? {
                    onClick: createOnClickCopyToClipboard(displayValue, { preventDefault: true })
                  }
                : {})}
            >
              {renderedValue}
            </span>
          </Fragment>
        );
      })}
    </StyledArticle>
  );
};

export default Details;
