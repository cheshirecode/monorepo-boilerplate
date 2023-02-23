// import { css } from '@emotion/react';
import cx from 'classnames';

import { SectionsProps } from './typings';
import useSections from './useSections';

const Sections = (props: SectionsProps) => {
  const {
    ref,
    preRef,
    contentRef,
    bottomPaddingRef,
    checkOnScroll,
    currentIndex,
    setCurrentIndex
  } = useSections(props);
  const {
    // props for hook
    activeIndex: _a,
    inferQueryParams: _i1,
    cbScrollTop: _c,
    // contentOffset = 0,
    scrollTopOnIndexChange: _s,
    // props for rendering
    stickyNav,
    inferHash,
    items = [],
    className,
    navClassName,
    contentClassName,
    itemFitContent = false,
    Pre,
    preContentClassName,
    ...rest
  } = props;
  return (
    <section
      className={cx(
        'w-full max-h-full',
        'flex flex-wrap xxl:(flex-row h-full)',
        'overflow-auto',
        'z-1',
        className
      )}
      ref={ref}
      onScroll={checkOnScroll}
      {...rest}
    >
      {Pre ? (
        <section
          className={cx('w-full', 'z-1', 'children:(px-res)', preContentClassName)}
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
          'xxl:(max-w-60)',
          'xxl:(h-full flex-col)',
          !itemFitContent && 'lt-xxl:(children:(max-w-60))',
          itemFitContent && 'lt-xxl:(children:(min-w-fit))',
          itemFitContent && 'xxl:(min-w-fit)',
          stickyNav && 'md:(sticky top-0)',
          'card-secondary xxl:shadow-lg',
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
        // style={contentOffsetStyle}
      >
        {items[currentIndex]?.content}
      </div>
      {/* pad the bottom to ensure scrolling works - see useSections for dynamic height logic*/}
      <div className={cx('xxl:pb-10 w-full')} ref={bottomPaddingRef}></div>
    </section>
  );
};

export default Sections;
