import cx from 'classnames';
import type { MouseEvent, ReactNode } from 'react';
import { forwardRef } from 'react';
import './blockquote.css';

export type BlockQuoteProps = BaseProps & {
  text?: string | ReactNode;
  footnote?: string;
  isNoQuote?: boolean;
  isEmpty?: boolean;
  isSubCell?: boolean;
  quoteColor?: string;
  onClick?: (e: MouseEvent<HTMLQuoteElement>) => void;
};

const BlockQuote = forwardRef<HTMLQuoteElement, BlockQuoteProps>(
  ({ className, text, footnote, isEmpty, isNoQuote, isSubCell, quoteColor, ...props }, ref) => (
    <blockquote
      className={cx('custom-block-quote pt-16', className)}
      {...props}
      ref={ref}
      style={
        {
          '--quote-color': isNoQuote ? 'transparent' : quoteColor || '#ddd'
        } as React.CSSProperties
      }
    >
      <h3
        className={cx(
          'h-full relative px-4 italic',
          'flex flex-wrap',
          'items-center',
          !isSubCell && 'min-h-40 max-h-60',
          'overflow-ellipsis'
        )}
      >
        <div className={cx('w-full', isEmpty && 'text-center')}>{text}</div>
        <div className="ml-auto">{footnote}</div>
      </h3>
    </blockquote>
  )
);

export default BlockQuote;
