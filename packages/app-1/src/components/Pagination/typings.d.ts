import type { MouseEvent } from 'react';

export type PaginationInputs = {
  /**
   *  how many items in the list
   */
  count: number;
  /**
   *  index 1 for display,  first page to select, or can be used to subsequently change page
   */
  page: number;
  /**
   * provide number of items per page based on other params or can be passed in to override
   */
  pageSize: number | boolean;
  /**
   * original page size
   */
  _pageSize?: number | boolean;
  /**
   *
   * change callback(PAGINATION_PARAMS) whenever pagination happens
   */
  onChange?: (params: Partial<PaginationInputs>) => void;
  /**
   * default - true. clicking next/prev will go over the range.
   */
  isRollover?: boolean;
};

export type PaginationParams = PaginationInputs & {
  /**
   *  index 0 for array's beginning index
   */
  last: number;
  /**
   *  index 0 for array's end index. remember to do Array.slice(first, last + 1) to include the last element
   */
  first: number;
  /**
   *  max page number
   */
  maxPage: number;
  /**
   * helper array with 1..maxPage
   */
  pageNumbers: number[];
  /**
   * page size options
   */
  pageSizes: number[];
  /**
   * setter for other params
   * @param params
   * @returns
   */
};

export type PaginationHookResults = PaginationParams & {
  /**
   *
   * change callback(PAGINATION_PARAMS) whenever pagination happens
   */
  onChange?: (params: Partial<PaginationInputs>) => void;
  setParams: (params: Partial<PaginationInputs>) => void;
  /**
   * helper callback to render custom paginator
   */
  onPageNumberClick: (e: MouseEvent<HTMLElement>) => void;
  /**
   * go back
   */
  goPrevious: () => void;
  /**
   * go next
   */
  goNext: () => void;
  /**
   * go to page
   */
  goTo: (n: number) => void;
  /**
   * set how many items on a page
   */
  setPageSize: (n: number) => void;
  /**
   * flag - next page is possible
   */
  isNextPossible: boolean;
  /**
   * flag - prev page is possible
   */
  isPrevPossible: boolean;
};

export type PaginationStyleProps = {
  itemClassName?: string;
  activeItemClassName?: string;
  disabledItemClassName?: string;
};

export type PaginationProps = BaseProps &
  PaginationHookResults &
  PaginationStyleProps & {
    /**
     * flag - default - false. TRUE to show all pages, FALSE to show current / max
     */
    showAllPages?: boolean;
  };
