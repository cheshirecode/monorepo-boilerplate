import { isFunction, isUndefined, throttle } from 'lodash-es';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import useInitialEffect from '@/services/hooks/useInitialEffect';
import useLocationHash from '@/services/hooks/useLocationHash';
import { queryString } from '@/services/routes';

import { SectionHookParams } from './typings';

const useSections = ({
  items = [],
  activeIndex = 0,
  inferHash = false,
  inferQueryParams = false,
  cbScrollTop,
  // contentOffset = 0,
  scrollTopOnIndexChange = false
}: SectionHookParams) => {
  const [currentIndex, setCurrentIndex] = useState(activeIndex);
  const ref = useRef<HTMLElement>(null);
  //scroll
  const preRef = useRef<HTMLElement>(null);
  const preRefWide = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const bottomPaddingRef = useRef<HTMLDivElement>(null);
  const checkOnScroll = useMemo(
    () =>
      throttle(
        () => {
          if (!isFunction(cbScrollTop)) {
            return;
          }
          // TODO - take a closer look at scrolling logic later to determine dynamic heights better
          const st = ref?.current?.scrollTop;
          if (!isUndefined(st) && st >= 0) {
            cbScrollTop(st);
            if (preRef?.current) {
              const { classList } = preRef.current;
              const isScrollingPastPre = st > 0;
              const alreadyHidden = classList.contains('hidden');
              if (alreadyHidden && st === 1) {
                return;
              }
              classList[isScrollingPastPre ? 'add' : 'remove']('hidden');
              if (!alreadyHidden && isScrollingPastPre) {
                ref.current?.scrollTo({
                  // very slightly below the fold to still maintain the offset logic (if hiding heading e.g.)
                  top: 1,
                  behavior: 'smooth'
                });
              }
            }
            // const offsets = [ contentOffset || 9999].map((x) => `${x}px`);
            // setContentOffsetStyle({
            //   marginTop: `min(${offsets.join(', ')})`
            // });
          }

          if (bottomPaddingRef?.current?.style) {
            bottomPaddingRef.current.style.height =
              (contentRef?.current?.clientHeight ?? 0) + (preRef?.current?.clientHeight ?? 0) <=
              window?.innerHeight
                ? `max(${window?.innerHeight - (contentRef?.current?.clientHeight ?? 0) - 120}px, ${
                    preRef?.current?.clientHeight
                  }px)`
                : `0px`;
          }
        },
        300,
        {
          trailing: true,
          leading: true
        }
      ),
    [cbScrollTop]
  );
  const locationHash = useLocationHash();
  const updateIndexByHash = useCallback(
    (id: string) => {
      const indexFromHash = items.findIndex((x) => x.id === id);
      if (indexFromHash >= 0) {
        setCurrentIndex(indexFromHash);
      }
    },
    [items]
  );
  useInitialEffect(() => {
    if (inferQueryParams) {
      let hash = queryString.get('sectionHash') ?? '';
      hash = decodeURIComponent(hash) !== hash ? decodeURIComponent(hash) : hash;
      const indexFromHash = items.findIndex((x) => x.id === hash);
      if (indexFromHash >= 0) {
        setCurrentIndex(indexFromHash);
      }
    }
  }, []);

  useInitialEffect(() => {
    if (inferHash) {
      updateIndexByHash(locationHash?.slice(1)); // #abc > abc);
    }
  }, [locationHash]);

  useEffect(() => {
    if (scrollTopOnIndexChange && ref?.current) {
      ref.current.scrollTo({
        // very slightly below the fold to still maintain the offset logic (if hiding heading e.g.)
        top: preRef?.current?.offsetHeight || 1,
        behavior: 'smooth'
      });
    }
  }, [scrollTopOnIndexChange, currentIndex]);

  return {
    ref,
    preRef,
    preRefWide,
    contentRef,
    bottomPaddingRef,
    checkOnScroll,
    currentIndex,
    setCurrentIndex
  } as const;
};

export default useSections;
