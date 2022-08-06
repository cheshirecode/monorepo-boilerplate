import cx from 'classnames';
import { FC } from 'react';

const Error: FC<BaseProps & { text?: string; errors?: unknown[] }> = ({
  className,
  text,
  children,
  errors,
  ...props
}) => (
  <div className={cx('flex bg-red-500 p-4 rounded-md flex justify-center', className)} {...props}>
    {children ? children : null}
    {text ? <h4 className="text-white text-h4">{text}</h4> : null}
    {errors ? (
      <>
        <h2 className="w-full align-middle text-center self-center text-h1 text-white">Error</h2>
        {errors.map((x) => (
          <pre>{JSON.stringify(x, null, 2)}</pre>
        ))}
      </>
    ) : null}
  </div>
);

export default Error;
