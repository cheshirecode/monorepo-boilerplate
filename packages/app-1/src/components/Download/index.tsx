import cx from 'classnames';
import stringify from 'fast-json-stable-stringify';
import { isString } from 'lodash-es';

import { createOnClickClipboardCopy } from '@/utils';

const Download = ({ data, className, children }: BaseProps & { data: unknown }) => (
  <button
    className={cx('btn self-center cursor-pointer', className)}
    onClick={createOnClickClipboardCopy(isString(data) ? data : stringify(data))}
  >
    {children ? children : '📋'}
  </button>
);

export default Download;
