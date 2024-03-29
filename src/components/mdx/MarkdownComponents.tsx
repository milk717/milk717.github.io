import * as React from 'react';
import {HTMLAttributes, PropsWithChildren} from 'react';
import {theme} from '../../styles/theme';
import {MDXProvider} from '@mdx-js/react';
import {css} from '@emotion/react';
import 'prismjs/themes/prism-tomorrow.css';
import Typography from '../common/Typography/Typography';
import {ObsidianCallout} from 'obsidian-callouts-markdown';

const components = {
  h1: (props: HTMLAttributes<HTMLHeadingElement>) => (
    <Typography component="h1" variant="h1" {...props}>
      {props.children}
    </Typography>
  ),
  h2: (props: HTMLAttributes<HTMLHeadingElement>) => (
    <Typography component="h2" variant="h2" {...props}>
      {props.children}
    </Typography>
  ),
  h3: (props: HTMLAttributes<HTMLHeadingElement>) => (
    <Typography component="h3" variant="h3" {...props}>
      {props.children}
    </Typography>
  ),
  h4: (props: HTMLAttributes<HTMLHeadingElement>) => (
    <Typography component="h4" variant="h4" {...props}>
      {props.children}
    </Typography>
  ),
  h5: (props: HTMLAttributes<HTMLHeadingElement>) => (
    <Typography component="h5" variant="h5" {...props}>
      {props.children}
    </Typography>
  ),
  h6: (props: HTMLAttributes<HTMLHeadingElement>) => (
    <Typography component="h6" variant="h6" {...props}>
      {props.children}
    </Typography>
  ),
  p: (props: HTMLAttributes<HTMLParagraphElement>) => (
    <Typography component="p" variant="p" {...props}>
      {props.children}
    </Typography>
  ),
  span: (props: HTMLAttributes<HTMLSpanElement>) => (
    <span
      {...props}
      css={css`
        white-space: normal;
      `}>
      {props.children}
    </span>
  ),
  ul: (props: HTMLAttributes<HTMLUListElement>) => (
    <ul
      {...props}
      css={css`
        padding-left: 1rem;
        margin: 1rem 0;
      `}>
      {props.children}
    </ul>
  ),
  ol: (props: HTMLAttributes<HTMLUListElement>) => (
    <ol
      {...props}
      css={css`
        padding-left: 1rem;
        margin: 1rem 0;
      `}>
      {props.children}
    </ol>
  ),
  li: (props: HTMLAttributes<HTMLLIElement>) => (
    <li
      {...props}
      css={css`
        font-size: 1rem;
        line-height: 1.7;
        letter-spacing: -0.004rem;
        word-break: keep-all;
        overflow-wrap: break-word;
      `}>
      {props.children}
    </li>
  ),
  a: (props: HTMLAttributes<HTMLAnchorElement>) => (
    <Typography
      component="a"
      variant="link"
      css={css`
        display: inline;
        font-size: inherit;
        font-weight: inherit;
        margin: 0;
        &:hover {
          text-decoration: underline;
        }
      `}
      {...props}>
      {props.children}
    </Typography>
  ),
  code: (props: HTMLAttributes<HTMLElement>) => (
    <code
      {...props}
      css={css`
        padding: 0.2rem 0.4rem;
        font-size: 85%;
        border-radius: 0.1875rem;
        background-color: ${theme.colors.colorSurface00};
      `}>
      {props.children}
    </code>
  ),
  blockquote: (props: HTMLAttributes<HTMLElement>) => (
    <ObsidianCallout {...props} />
  ),
  img: (props: HTMLAttributes<HTMLImageElement>) => (
    <img
      {...props}
      css={css`
        width: 100%;
      `}
    />
  ),
};

const MarkdownComponents: React.FC<PropsWithChildren> = ({children}) => {
  return <MDXProvider components={components}>{children}</MDXProvider>;
};

export default MarkdownComponents;
