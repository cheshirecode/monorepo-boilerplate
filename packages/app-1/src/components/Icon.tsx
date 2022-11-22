import { useEffect, useState } from 'react';
import type { FC, ImgHTMLAttributes, ReactElement } from 'react';

type IconProps = BaseProps &
  ImgHTMLAttributes<HTMLImageElement> & {
    name: string;
  };
const Icon: FC<IconProps> = (props) => {
  const { name, ...rest } = props;
  const [output, setOutput] = useState<ReactElement>();
  useEffect(() => {
    const fn = async () => {
      const src = await import(`../assets/icon-${name}.svg`);
      setOutput(<img src={src.default} alt={name} {...rest} />);
    };
    fn();
  }, [name, rest]);
  return output === undefined ? null : output;
};

export default Icon;
