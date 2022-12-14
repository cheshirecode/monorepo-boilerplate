import cx from 'classnames';
import stringify from 'fast-json-stable-stringify';
import { isString } from 'lodash-es';

import { createOnClickClipboardCopy } from '@/utils';

const Download = ({ data, className }: BaseProps & { data: unknown }) => (
  <button
    className={cx('btn btn-compact btn-primary self-center cursor-pointer h-8 w-8 lh-4', className)}
    onClick={createOnClickClipboardCopy(isString(data) ? data : stringify(data))}
  >
    📋
  </button>
);

export default Download;
