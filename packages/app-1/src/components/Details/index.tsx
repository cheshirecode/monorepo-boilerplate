import styled from '@emotion/styled';
import cx from 'classnames';
import { isObject, isString, isUndefined, merge } from 'lodash-es';
import type { ReactNode } from 'react';
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
    ...rest
  } = props;
  return (
    <StyledArticle className={cx('', className)} {...rest}>
      {Object.keys(data).map((k) => {
        const v = data[k];
        // resolution order - key > * > null
        const { label, field } = merge({}, metadata['*'] ?? {}, metadata[k] ?? {});
        // for object or array types, requires a custom renderer
        if ((Array.isArray(v) || isObject(v)) && !field?.render) {
          return null;
        }

        const renderedKey = label?.render
          ? label?.render(k, { k, v: v as ReactNode }, props)
          : k.toLocaleUpperCase();
        const renderedValue = field?.render ? field?.render(v, { k, v: v as ReactNode }, props) : v;
        const isFieldCopy = !isUndefined(renderedValue) && renderedValue !== '' && fieldCopy;
        const displayValue = isString(renderedValue) ? renderedValue : String(v);
        const isFieldCopyPossible = isFieldCopy && !isUndefined(displayValue);
        return (
          <Fragment key={k}>
            {label?.fullLinePre && <span className="col-span-full" />}
            <span
              className={cx('', label?.className, labelClassName)}
              {...(isString(renderedKey) ? { title: renderedKey } : {})}
            >
              {renderedKey}
            </span>
            {field?.fullLinePre && <span className="col-span-full" />}
            <span
              className={cx(
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
