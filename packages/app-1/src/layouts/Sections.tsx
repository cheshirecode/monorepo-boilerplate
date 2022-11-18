import { useState, useEffect, useLayoutEffect } from 'react';
import type { FC, ReactNode, HTMLAttributes } from 'react';
import cx from 'classnames';

export type ItemsType = {
  id: string;
  name: string;
  content: ReactNode;
}[];

export interface SectionsProps extends BaseProps, HTMLAttributes<HTMLElement> {
  items?: ItemsType;
  activeIndex?: number;
  navClassName?: string;
  contentClassName?: string;
  stickyNav?: boolean; // make the nav menu sticky
  inferHash?: boolean; // infer active index from url hash
  inferQueryParams?: boolean; // infer active index from url params
}

export const dummyItems: ItemsType = [
  {
    id: 'section-1',
    name: 'section 1 is short',
    content: <div className="w-full h-10 bg-red"></div>
  },
  {
    id: 'section-2',
    name: 'section 2 has long name and height',
    content: (
      <div className="w-full h-full bg-slate-100">
        <div className="w-full h-1/2 bg-black"></div>
      </div>
    )
  },
  {
    id: 'section-3',
    name: 'section 3',
    content: <div className="w-full h-60 bg-yellow"></div>
  },
  {
    id: 'section-4',
    name: 'section 4',
    content: <div className="w-full h-60 bg-blue"></div>
  },
  {
    id: 'section-5',
    name: 'section 5',
    content: <div className="w-full h-60 bg-green"></div>
  }
];

const useInitialEffect = useLayoutEffect || useEffect;
const Sections: FC<SectionsProps> = ({
  items = dummyItems,
  className,
  style,
  navClassName,
  contentClassName,
  activeIndex = 0,
  stickyNav = false,
  inferHash = false,
  inferQueryParams = false
}) => {
  const [currentIndex, setCurrentIndex] = useState(activeIndex);
  useInitialEffect(() => {
    if (stickyNav && !className?.includes('h-')) {
      // eslint-disable-next-line no-console
      console.info('Sections - stickyNav requires a fixed height to work');
    }
    if (!window || !window.location) {
      return;
    }
    const {
      location: { search },
      addEventListener
    } = window;
    let isListenToHashChange = false;
    const updateIndexByHash = () => {
      const hash = window.location.hash?.slice(1); // #abc > abc
      const indexFromHash = items.findIndex((x) => x.id === hash);
      if (indexFromHash >= 0 && indexFromHash !== currentIndex) {
        setCurrentIndex(indexFromHash);
      }
    };
    if (inferHash) {
      isListenToHashChange = true;
      // Bind the event listener
      addEventListener('hashchange', updateIndexByHash);
      updateIndexByHash();
    }
    if (inferQueryParams) {
      const queryParams = new URLSearchParams(search);
      let hash = queryParams.get('sectionHash') ?? '';
      hash = decodeURIComponent(hash) !== hash ? decodeURIComponent(hash) : hash;
      const indexFromHash = items.findIndex((x) => x.id === hash);
      if (indexFromHash >= 0 && indexFromHash !== activeIndex) {
        setCurrentIndex(indexFromHash);
      }
    }
    return () => {
      // Unbind the event listener on clean up
      isListenToHashChange && window.removeEventListener('hashchange', updateIndexByHash);
    };
  }, []);
  return (
    <section
      className={cx(
        'w-full',
        !className?.includes('h-') && 'h-full',
        'flex flex-wrap lg:(flex-row) overflow-overlay',
        className
      )}
      {...(style ? { style } : {})}
    >
      <ul
        className={cx(
          'm-0 p-0',
          'w-full',
          'lg:(w-60 h-full)',
          'list-none',
          'flex flex-gap-2 flex-wrap items-stretch',
          'lg:(flex-col)',
          stickyNav && 'lg:(sticky top-0)',
          navClassName
        )}
      >
        {items.map(({ name, id }, i) => (
          <li key={id} className="">
            <a
              href={`#${id}`}
              onClick={() => setCurrentIndex(i)}
              className={cx(
                'inline-block',
                'w-auto lg:(w-full) break-words',
                'py-2 px-4',
                'leading-normal no-underline',
                currentIndex !== i && 'hover:(bg-gray)',
                currentIndex === i && 'lt-lg:border-b-orange lg:border-r-orange disabled'
              )}
            >
              {name}
            </a>
          </li>
        ))}
      </ul>
      <div
        className={cx(
          'bg-white',
          'border border-gray-400',
          'shadow-lg',
          'w-full lg:(w-auto flex-1 mx-4 p-2)',
          !contentClassName?.includes('h-') && 'h-inherit xl:(h-full)',
          contentClassName
        )}
      >
        {items[currentIndex].content}
      </div>
    </section>
  );
};

export default Sections;
