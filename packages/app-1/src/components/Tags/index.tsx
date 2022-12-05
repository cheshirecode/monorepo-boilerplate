import cx from 'classnames';

export type TagsProps = BaseProps & {
  items: string[];
  itemClassName?: string;
};

const Tags = ({ items, className, itemClassName }: TagsProps) => (
  <ul className={cx(!className?.includes('w-') && 'w-full', 'flex flex-wrap gap-2', className)}>
    {items?.map((p) => (
      <li key={p} className={cx('inline-block', itemClassName)}>
        {p}
      </li>
    ))}
  </ul>
);

export default Tags;
