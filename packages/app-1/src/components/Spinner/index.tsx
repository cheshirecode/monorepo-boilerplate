import cx from 'classnames';
import type { FC } from 'react';

const Spinner: FC<BaseProps & { borderColor?: string }> = ({
  className,
  borderColor,
  ...props
}) => (
  <i
    uno-border="0 t-5 solid black"
    className={cx(
      'w-10 h-10',
      'rounded-t-3xl',
      'transform-gpu animate-spin',
      'inline-block',
      'self-center',
      'mx-auto',
      className
    )}
    style={{
      ...(borderColor ? { borderColor } : {})
    }}
    {...props}
  />
);

export default Spinner;
