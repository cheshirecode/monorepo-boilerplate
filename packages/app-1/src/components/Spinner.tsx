import cx from 'classnames';

const Spinner: BaseFC = ({ className, ...props }) => (
  <i
    className={cx(
      'w-10 h-10',
      'border-0 border-t-5 rounded-t-3xl',
      'border-solid border-black',
      'transform-gpu animate-spin',
      'self-center',
      'mx-auto',
      className
    )}
    {...props}
  />
);

export default Spinner;
