import type { DebouncedFunc } from 'lodash-es';
import type { HTMLAttributes, MouseEvent, ReactNode, RefObject } from 'react';

export type ItemsType = {
  id: string;
  name: ReactNode;
  className?: string;
  content: ReactNode | (() => ReactNode);
  onClick?: (e: MouseEvent<HTMLElement>) => void;
}[];

export interface SectionHookParams {
  items?: ItemsType;
  activeIndex?: number;
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

export interface SectionHookResults {
  readonly ref: RefObject<HTMLElement>;
  readonly preRef: RefObject<HTMLElement>;
  readonly preRefWide: RefObject<HTMLElement>;
  readonly contentRef: RefObject<HTMLDivElement>;
  readonly checkOnScroll: DebouncedFunc<() => void>;
}

export interface SectionsProps extends BaseProps, HTMLAttributes<HTMLElement>, SectionHookParams {
  /**
   * default - false. set to make the nav menu sticky on large screens > xl breakpoint ~1280px
   */
  stickyNav?: boolean;
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
   * default - false. set to allow items to take as much width as needed for content
   */
  itemFitContent?: boolean;
  /**
   * render something BEFORE nav + content
   */
  Pre?: ReactNode;
  preContentClassName?: string;
  /**
   * style props to make content flex container
   */
  flexContent?: boolean;
  /**
   * style props to add standarding padding to content
   */
  contentPadding?: false | 'compact' | 'normal';
}
