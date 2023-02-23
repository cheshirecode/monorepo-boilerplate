import cx from 'classnames';
import { isFunction, isNull, isUndefined } from 'lodash-es';
import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';

import { timeout } from '@/utils';

type TimeContentProps = BaseProps & {
  timings: {
    time: number;
    content: ReactNode | (() => ReactNode);
  }[];
};

const TimedContent = ({ className, timings, children }: TimeContentProps) => {
  const [c, setC] = useState(children);
  useEffect(() => {
    const timers = [];
    timings?.forEach(async ({ time, content }) => {
      const comp = isUndefined(content) ? children : isFunction(content) ? content() : content;
      const t = await timeout(time, () => {
        setC(comp);
      });
      timers.push(t);
    });

    return () => {
      timers.forEach((x) => clearTimeout(x));
    };
  }, [children, timings]);

  return (
    <section className={cx('', isNull(c) && 'w-0 h-0 p-0 m-0 disabled', !isNull(c) && className)}>
      {c}
    </section>
  );
};

export default TimedContent;
