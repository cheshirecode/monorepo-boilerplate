import cx from 'classnames';

export type TagsProps = BaseProps & {
  items: string[];
};

const Tags = ({ items, className }: TagsProps) => (
  <section className={cx('flex flex-col', className)}>
    <ul
      className={cx(
        'flex flex-wrap gap-2',
        'w-full',
        'pl-0 m-0',
        'children:(inline-block bg-ultramarine-50 py-1 px-2 rounded-full mix-blend-difference)'
      )}
    >
      {items?.map((p) => (
        <li key={p} className="">
          {p}
        </li>
      ))}
    </ul>
  </section>
);

export default Tags;
