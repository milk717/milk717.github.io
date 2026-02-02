'use client';

import type { MDXComponents } from 'mdx/types';
import { useMDXComponent } from 'next-contentlayer/hooks';
import type { PropsWithChildren } from 'react';
import { CalloutBody, CalloutComponent, CalloutTitle } from '@/components/callout';
import { cn } from '@/lib/utils';

const components: MDXComponents = {
  h1: (props) => (
    <h1
      className={cn(
        'text-3xl text-foreground font-bold my-8',
        'heading-indicator heading-h1',
        'hover:before:content-["H1"] hover:before:text-xs hover:before:text-muted-foreground',
        'hover:before:absolute hover:before:-left-6 hover:before:top-1/2 hover:before:-translate-y-1/2',
      )}
      {...props}
    >
      {props.children}
    </h1>
  ),
  h2: (props) => (
    <h2
      className={cn(
        'text-2xl text-foreground font-bold my-7',
        'heading-indicator heading-h2',
        'hover:before:content-["H2"] hover:before:text-xs hover:before:text-muted-foreground',
        'hover:before:absolute hover:before:-left-6 hover:before:top-1/2 hover:before:-translate-y-1/2',
      )}
      {...props}
    >
      {props.children}
    </h2>
  ),
  h3: (props) => (
    <h3
      className={cn(
        'text-xl text-foreground font-bold mt-6 mb-4',
        'heading-indicator heading-h3',
        'hover:before:content-["H3"] hover:before:text-xs hover:before:text-muted-foreground',
        'hover:before:absolute hover:before:-left-6 hover:before:top-1/2 hover:before:-translate-y-1/2',
      )}
      {...props}
    >
      {props.children}
    </h3>
  ),
  h4: (props) => (
    <h4
      className={cn(
        'text-lg text-foreground font-semibold mt-2 mb-0.5',
        'heading-indicator heading-h4',
        'hover:before:content-["H4"] hover:before:text-xs hover:before:text-muted-foreground',
        'hover:before:absolute hover:before:-left-6 hover:before:top-1/2 hover:before:-translate-y-1/2',
      )}
      {...props}
    >
      {props.children}
    </h4>
  ),
  h5: (props) => (
    <h5
      className={cn(
        'text-base text-foreground font-semibold mt-1 mb-0.5',
        'heading-indicator heading-h5',
        'hover:before:content-["H5"] hover:before:text-xs hover:before:text-muted-foreground',
        'hover:before:absolute hover:before:-left-6 hover:before:top-1/2 hover:before:-translate-y-1/2',
      )}
      {...props}
    >
      {props.children}
    </h5>
  ),
  h6: (props) => (
    <h6
      className={cn(
        'text-base text-foreground font-semibold mt-1 mb-0.5',
        'heading-indicator heading-h6',
        'hover:before:content-["H6"] hover:before:text-xs hover:before:text-muted-foreground',
        'hover:before:absolute hover:before:-left-6 hover:before:top-1/2 hover:before:-translate-y-1/2',
      )}
      {...props}
    >
      {props.children}
    </h6>
  ),
  p: (props) => (
    <p className="my-4 text-base text-foreground leading-loose" {...props}>
      {props.children}
    </p>
  ),
  span: (props) => (
    <span className="text-inherit leading-loose" {...props}>
      {props.children}
    </span>
  ),
  // ===== SEMANTIC TYPOGRAPHY =====
  strong: (props) => (
    <strong className="font-bold leading-loose" style={{ color: 'var(--text-bold)' }} {...props}>
      {props.children}
    </strong>
  ),
  em: (props) => (
    <em className="italic leading-loose" style={{ color: 'var(--text-italic)' }} {...props}>
      {props.children}
    </em>
  ),
  a: (props) => {
    const isHeadingAnchor =
      (typeof props.className === 'string' && props.className.includes('anchor')) ||
      (Array.isArray(props.className) && props.className.includes('anchor'));
    return (
      <a
        className={cn(
          'text-base leading-loose',
          !isHeadingAnchor && 'link-hover-effect',
        )}
        style={!isHeadingAnchor ? { color: 'var(--text-link)' } : undefined}
        {...props}
      >
        {props.children}
      </a>
    );
  },
  pre: (props) => (
    <pre
      className="p-3 rounded-lg overflow-x-scroll group leading-loose bg-(--code-block-bg)"
      data-block-type="code-block"
      {...props}
    >
      {props.children}
    </pre>
  ),
  code: (props) => (
    <code
      className={cn(
        'text-xs font-medium leading-loose px-1 py-0.5 mx-0.5 inline-code-block',
        'group-data-[block-type=code-block]:bg-transparent group-data-[block-type=code-block]:border-none',
        'group-data-[block-type=code-block]:text-[0.8em]',
      )}
      data-block-type="inline-code-block"
      {...props}
    >
      {props.children}
    </code>
  ),
  // ===== LISTS WITH STYLED BULLETS =====
  ul: (props) => (
    <ul className="leading-loose list-disc ms-4 list-styled" {...props}>
      {props.children}
    </ul>
  ),
  ol: (props) => (
    <ol className="leading-loose list-decimal ms-5 list-styled" {...props}>
      {props.children}
    </ol>
  ),
  li: (props) => (
    <li className="leading-loose text-base text-foreground" {...props}>
      {props.children}
    </li>
  ),
  table: (props) => (
    <table className="text-foreground border-collapse table-auto my-4" {...props}>
      {props.children}
    </table>
  ),
  thead: (props) => (
    <thead
      className="text-foreground rounded-lg bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50"
      {...props}
    >
      {props.children}
    </thead>
  ),
  th: (props) => (
    <th scope="col" className="px-6 py-1.5 font-semibold first:rounded-s-lg last:rounded-e-lg" {...props}>
      {props.children}
    </th>
  ),
  tr: (props) => (
    <tr className="border-b last:border-none" {...props}>
      {props.children}
    </tr>
  ),
  td: (props) => (
    <td className="px-6 py-3" {...props}>
      {props.children}
    </td>
  ),
  hr: (props) => (
    <hr className="my-4 border-border" {...props} />
  ),
  blockquote: (props) => (
    <div
      className="my-4 callout-default-bar bg-muted/50 rounded-lg px-4 py-2 leading-loose text-foreground"
      {...props}
    >
      {props.children}
    </div>
  ),
  callout: (
    props: PropsWithChildren<{
      type?: string;
      isFoldable?: boolean;
      defaultFolded?: boolean;
      isfoldable?: boolean;
      defaultfolded?: boolean;
    }>,
  ) => (
    <CalloutComponent
      type={props.type ?? 'note'}
      isFoldable={props.isFoldable ?? props.isfoldable ?? false}
      defaultFolded={props.defaultFolded ?? props.defaultfolded ?? false}
      {...props}
    >
      {props.children}
    </CalloutComponent>
  ),
  'callout-title': (props: PropsWithChildren<{ type?: string; isFoldable?: boolean }>) => (
    <CalloutTitle type={props.type ?? 'note'} isFoldable={props.isFoldable ?? false} {...props}>
      {props.children}
    </CalloutTitle>
  ),
  'callout-body': (props: PropsWithChildren<{ type?: string }>) => (
    <CalloutBody type={props.type} {...props}>
      {props.children}
    </CalloutBody>
  ),
  img: (props) => <img {...props} className="my-4" alt={props.alt} />,
};

const MdxComponents = ({ code }: { code: string }) => {
  const MDX = useMDXComponent(code);
  return <MDX components={components} />;
};

export default MdxComponents;
