import cx from 'classnames';
import { isFunction, throttle } from 'lodash-es';
import type { HTMLAttributes, ReactNode } from 'react';
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';

export type ItemsType = {
  id: string;
  name: string;
  content: ReactNode;
}[];

const useInitialEffect = useLayoutEffect || useEffect;

export interface SectionsProps extends BaseProps, HTMLAttributes<HTMLElement> {
  /**
   * list of each section items
   * {
   *   id - unique id to act as URL hash for the item
   *   name - display name
   *   content - actual content of the item
   *   }[]
   */
  items?: ItemsType;
  activeIndex?: number;
  navClassName?: string;
  contentClassName?: string;
  /**
   * default - false. set to make the nav menu sticky on large screens > xl breakpoint ~1280px
   */
  stickyNav?: boolean;
  /**
   * default - false. set to infer active index from url hash
   */
  inferHash?: boolean;
  /**
   * default - false. set to infer active index from url params
   */
  inferQueryParams?: boolean;
  /**
   * callback to act on scrollTop of component
   */
  cbScrollTop?: (scrollTop: number) => void;
  /**
   * threshold (px|em|rm)  set offset for content
   */
  contentOffset?: string;
  /**
   * default - false. set to scroll content back to top whenever index changes
   */
  scrollTopOnIndexChange?: boolean;
}

export const dummyItems: ItemsType = [
  {
    id: 'section-1',
    name: 'section 1 is very short',
    content: <div className="w-full h-10 bg-red-7"></div>
  },
  {
    id: 'section-2',
    name: 'section 2 has long name and has longform content',
    content: (
      <div className="w-full bg-red h-[60rem]">
        <div className="w-full h-1/2 bg-black"></div>
      </div>
    )
  },
  {
    id: 'section-3',
    name: 'section 3',
    content: <div className="w-full h-60 bg-yellow-100"></div>
  },
  {
    id: 'section-4',
    name: 'section 4',
    content: <div className="w-full h-60 bg-blue-700"></div>
  },
  {
    id: 'section-5',
    name: 'section 5',
    content: <div className="w-full h-60 bg-green-50"></div>
  }
];

const Sections = ({
  items = dummyItems,
  className,
  navClassName,
  contentClassName,
  activeIndex = 0,
  stickyNav = false,
  inferHash = false,
  inferQueryParams = false,
  cbScrollTop,
  contentOffset = '',
  scrollTopOnIndexChange = false,
  ...props
}: SectionsProps) => {
  const [currentIndex, setCurrentIndex] = useState(activeIndex);
  const updateIndexByHash = useCallback(() => {
    const hash = window.location.hash?.slice(1); // #abc > abc
    const indexFromHash = items.findIndex((x) => x.id === hash);
    if (indexFromHash >= 0) {
      setCurrentIndex(indexFromHash);
    }
  }, [items]);
  const [contentOffsetStyle, setContentOffsetStyle] = useState({});
  const ref = useRef<HTMLElement>(null);
  const checkOnScroll = useMemo(
    () =>
      throttle(
        () => {
          const st = ref?.current?.scrollTop;
          if (st >= 0) {
            if (isFunction(cbScrollTop)) {
              cbScrollTop(st);
            }
            if (contentOffset) {
              setContentOffsetStyle({
                marginTop: `min(${st}px, ${contentOffset})`
              });
            }
          }
        },
        300,
        {
          trailing: true,
          leading: true
        }
      ),
    [cbScrollTop, contentOffset]
  );

  useInitialEffect(() => {
    if (stickyNav && !className?.includes('h-')) {
      // eslint-disable-next-line no-console
      console.info(
        'Sections - stickyNav needs a fixed height set on either this or direct ancestor'
      );
    }
    if (!window || !window.location) {
      return;
    }
    const {
      location: { search },
      addEventListener
    } = window;
    let isListenToHashChange = false;
    if (inferHash) {
      isListenToHashChange = true;
      // Bind the event listener
      window.removeEventListener('hashchange', updateIndexByHash);
      addEventListener('hashchange', updateIndexByHash);
      updateIndexByHash();
    }
    if (inferQueryParams) {
      const queryParams = new URLSearchParams(search);
      let hash = queryParams.get('sectionHash') ?? '';
      hash = decodeURIComponent(hash) !== hash ? decodeURIComponent(hash) : hash;
      const indexFromHash = items.findIndex((x) => x.id === hash);
      if (indexFromHash >= 0) {
        setCurrentIndex(indexFromHash);
      }
    }
    return () => {
      // Unbind the event listener on clean up
      isListenToHashChange && window.removeEventListener('hashchange', updateIndexByHash);
    };
  }, []);

  useEffect(() => {
    if (scrollTopOnIndexChange && ref?.current) {
      ref.current.scrollTo({
        top: 1, // very slightly below the fold to still maintain the offset logic (if hiding heading e.g.)
        // left: 100,
        behavior: 'smooth'
      });
    }
  }, [scrollTopOnIndexChange, currentIndex]);
  return (
    <section
      className={cx(
        'w-full',
        !className?.includes('h-') && 'h-full',
        'flex flex-wrap xl:(flex-row) overflow-overlay',
        className
      )}
      ref={ref}
      {...(cbScrollTop ? { onScroll: checkOnScroll } : {})}
      {...props}
    >
      <nav
        className={cx(
          'm-0 p-0 list-none w-full overflow-hidden',
          !navClassName?.includes('bg-') && 'bg-white',
          items.length > 5 && `lt-xl:(grid gap-2 grid-cols-fill-60 overflow-x-auto)`,
          items.length <= 5 && `lt-xl:(flex flex-gap-2 flex-wrap)`,
          'xl:(w-60 h-full children:(w-full) flex flex-gap-2 flex-col overflow-y-auto)',
          !navClassName?.includes('border') &&
            'border-1 border-transparent lt-xl:border-b-gray-500 xl:border-r-gray-500 shadow-lg',
          stickyNav && 'sticky top-0',
          navClassName
        )}
      >
        {items.map(({ name, id }, i) => (
          <a
            key={id}
            href={`#${id}`}
            {...(inferHash ? {} : { onClick: () => setCurrentIndex(i) })}
            className={cx(
              'inline-block',
              'xl:(w-full) break-words',
              'py-2 px-4',
              'leading-normal no-underline',
              'border-2 border-transparent',
              currentIndex !== i && 'hover:(bg-gray-200)',
              currentIndex === i && 'lt-xl:border-b-orange-500 xl:border-r-orange-500 disabled'
            )}
          >
            {name}
          </a>
        ))}
      </nav>
      <div
        className={cx(
          !contentClassName?.includes('bg-') && 'bg-white',
          // !contentClassName?.includes('border') &&
          //   'border-1 border-transparent lt-xl:border-t-gray-400  xl:border-l-gray-400 shadow-lg',
          'w-full xl:(w-auto flex-1)',
          !contentClassName?.includes('h-') && 'h-inherit xl:(h-full)',
          contentClassName
        )}
        style={contentOffsetStyle}
      >
        {items[currentIndex].content}
      </div>
    </section>
  );
};

export default Sections;
