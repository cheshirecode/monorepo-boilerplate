import styled from '@emotion/styled';
import cx from 'classnames';
import type { FC, ReactNode } from 'react';

type CardProps = BaseProps & {
  ['uno-bg']?: string; // set background color
  header?: string | ReactNode | FC;
  footer?: string | ReactNode | FC;
  plain?: true;
};

const StyledArticle = styled.article``;

const Card: FC<CardProps> = ({ className, children, header, footer, plain, ...props }) => (
  <StyledArticle
    uno-bg="white"
    className={cx('w-full', !plain && 'border-1 border-gray-20', !plain && 'shadow-lg', className)}
    {...props}
  >
    <>
      {header ? typeof header === 'string' ? <header>{header}</header> : header : null}
      {children ? children : null}
      {footer ? typeof footer === 'string' ? <footer>{footer}</footer> : footer : null}
    </>
  </StyledArticle>
);

export default Card;
