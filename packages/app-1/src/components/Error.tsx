import cx from 'classnames';
import { FC } from 'react';

const Error: FC<BaseProps & { text?: string; errors?: unknown[] }> = ({
  className,
  text,
  children,
  errors,
  ...props
}) => (
  <div
    className={cx('border-0 flex flex-col bg-red-500 p-4 rounded-md justify-center', className)}
    {...props}
  >
    {children ? children : null}
    {text ? <h4 className="text-white text-h4 text-center">{text}</h4> : null}
    {errors ? (
      <>
        <ul className="w-full text-h1 text-white list-none flex flex-wrap gap-2">
          {errors.map((x) => (
            <li className="" key={x?.toString() ?? x}>
              <pre>{JSON.stringify(x, null, 2)}</pre>
            </li>
          ))}
        </ul>
      </>
    ) : null}
  </div>
);

export default Error;
