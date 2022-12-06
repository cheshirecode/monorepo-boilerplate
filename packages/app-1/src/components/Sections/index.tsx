import cx from 'classnames';
import { isFunction, isUndefined, throttle } from 'lodash-es';
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
  /**
   * default - false. set to allow items to take as much width as needed for content
   */
  itemFitContent?: boolean;
}

const Sections = ({
  items = [],
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
  itemFitContent = false,
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
          if (!isUndefined(st) && st >= 0) {
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
    if (stickyNav) {
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
        'w-full h-inherit',
        'bg-primary color-primary',
        'flex flex-wrap xxl:(flex-row) overflow-auto',
        'z-1',
        className
      )}
      ref={ref}
      {...(cbScrollTop ? { onScroll: checkOnScroll } : {})}
      {...props}
    >
      <nav
        className={cx(
          'm-0 p-0 overflow-auto',
          'flex ',
          'lt-xxl:(w-full)',
          'lt-md:(flex-wrap flex-col children:(max-w-full overflow-x-scroll))',
          'xxl:(max-w-60 w-full)',
          'xxl:(h-full flex-col)',
          !itemFitContent && 'lt-xxl:(children:(max-w-60))',
          itemFitContent && 'lt-xxl:(children:(min-w-fit))',
          itemFitContent && 'xxl:(min-w-fit)',
          stickyNav && 'md:(sticky top-0)',
          '',
          'border-primary shadow-lg',
          'lt-xxl:uno-layer-o:(border-b-1)',
          'xxl:uno-layer-o:(border-r-1)',
          'z-2',
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
              'break-words',
              'py-2 px-4',
              'leading-normal no-underline',
              'border-warningAlt',
              'anchor',
              currentIndex !== i && '@hover:(bg-secondary)',
              currentIndex === i &&
                ['lt-xxl:(border-b-2)', 'xxl:(border-r-2)', 'disabled'].join(' ')
            )}
          >
            {name}
          </a>
        ))}
      </nav>
      <div className="hidden md:block w-full xxl:w-auto h-px" style={contentOffsetStyle}></div>
      <div
        className={cx(
          'm-0 p-0',
          'bg-transparent',
          'w-full xxl:(w-auto flex-1)',
          'h-inherit xxl:(h-full)',
          contentClassName
        )}
      >
        {items[currentIndex].content}
      </div>
    </section>
  );
};

export default Sections;
