import type { ImgHTMLAttributes, ReactElement } from 'react';
import { memo, useEffect, useState } from 'react';

type IconProps = BaseProps &
  ImgHTMLAttributes<HTMLImageElement> & {
    name: string;
  };
const Icon = (props: IconProps) => {
  const [output, setOutput] = useState<ReactElement>(null);
  useEffect(() => {
    const { name, ...rest } = props;
    const fn = async () => {
      const src = await import(`../assets/icon-${name}.svg`);
      setOutput(<img src={src.default} alt={name} {...rest} />);
    };
    fn();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props]);
  return output;
};

export default memo(Icon);
