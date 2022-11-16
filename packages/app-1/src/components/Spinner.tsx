import cx from 'classnames';

const Spinner: BaseFC = ({ className, ...props }) => (
  <i
    uno-border="solid black 0 t-5"
    className={cx(
      'w-10 h-10',
      'rounded-t-3xl',
      'transform-gpu animate-spin',
      'self-center',
      'mx-auto',
      className
    )}
    {...props}
  />
);

export default Spinner;
