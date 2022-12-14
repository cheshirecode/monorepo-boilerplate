import cx from 'classnames';
import { isFunction, isUndefined, throttle } from 'lodash-es';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import useInitialEffect from '@/services/hooks/useInitialEffect';

import { SectionsProps } from './typings';

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
  Pre,
  preContentClassName,
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
  //scroll
  const preRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLElement>(null);
  // const [isPreHidden, setPreHidden] = useState(false);
  const checkOnScroll = useMemo(
    () =>
      throttle(
        () => {
          const st = ref?.current?.scrollTop;
          if (!isUndefined(st) && st >= 0) {
            if (isFunction(cbScrollTop)) {
              cbScrollTop(st);
            }
            let offsetTop = 0;
            // if scrolling down (offset > 0) hide the heading, show normally otherwise
            if (preRef?.current) {
              preRef.current.classList.remove(st > 0 ? 'visible' : 'invisible');
              preRef.current.classList.add(st > 0 ? 'invisible' : 'visible');
              const preHeight = preRef.current.offsetHeight;
              if (st > 0 && st < preHeight) {
                offsetTop = preHeight;
              }
            }
            const offsets = [offsetTop, contentOffset || 9999].map((x) => `${x}px`);
            setContentOffsetStyle({
              marginTop: `min(${offsets.join(', ')})`
            });
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
        top: preRef?.current?.offsetHeight ?? 1, // very slightly below the fold to still maintain the offset logic (if hiding heading e.g.)
        // left: 100,
        behavior: 'smooth'
      });
      ref.current.dispatchEvent(
        new MouseEvent('scroll', {
          view: window,
          bubbles: true,
          cancelable: true
        })
      );
    }
  }, [scrollTopOnIndexChange, currentIndex, checkOnScroll]);

  return (
    <section
      className={cx(
        'w-full h-inherit',
        'bg-primary color-primary',
        'flex flex-wrap xxl:(flex-row)',
        'overflow-auto',
        // isPreHidden ? 'overflow-hidden' : 'overflow-auto',
        'z-1',
        className
      )}
      ref={ref}
      onScroll={checkOnScroll}
      // {...(isPreHidden ? {} : { onScroll: checkOnScroll })}
      {...props}
    >
      {Pre ? (
        <section
          className={cx('w-full', 'bg-secondary', 'z-1', 'children:(px-res)', preContentClassName)}
          ref={preRef}
        >
          {Pre}
        </section>
      ) : null}
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
          'bg-secondary',
          'border-secondary xxl:shadow-lg',
          'lt-xxl:uno-layer-o:(border-b-1)',
          'xxl:uno-layer-o:(border-r-1)',
          'z-3',
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
      <div
        className={cx(
          'm-0 p-0',
          'bg-transparent',
          'w-full xxl:(w-auto flex-1)',
          'h-[-webkit-fill-available] xxl:(h-full)',
          'z-2',
          contentClassName
        )}
        ref={contentRef}
        // {...(isPreHidden ? { onScroll: checkOnScroll } : {})}
        style={contentOffsetStyle}
      >
        {items[currentIndex].content}
      </div>
    </section>
  );
};

export default Sections;
