import React from 'react';
import {ObsidianCallout} from 'obsidian-callouts-markdown';
import type {MDXComponents} from 'mdx/types';
import {useMDXComponent} from 'next-contentlayer/hooks';

const components: MDXComponents = {
  h1: props => (
    <h1
      className="font-bold text-3xl text-neutral-700 my-8 hover:after:content-['#'] after:mx-1 after:text-neutral-200"
      {...props}>
      {props.children}
    </h1>
  ),
  h2: props => (
    <h2
      className="font-bold text-2xl text-neutral-700 my-7 hover:after:content-['#'] after:mx-1 after:text-neutral-200"
      {...props}>
      {props.children}
    </h2>
  ),
  h3: props => (
    <h3
      className="font-bold text-xl text-neutral-700 mt-6 mb-4 hover:after:content-['#'] after:mx-1 after:text-neutral-200"
      {...props}>
      {props.children}
    </h3>
  ),
  h4: props => (
    <h4
      className="font-bold text-lg text-neutral-700 mt-2 mb-0.5 hover:after:content-['#'] after:mx-1 after:text-neutral-200"
      {...props}>
      {props.children}
    </h4>
  ),
  h5: props => (
    <h5
      className="font-semibold text-base text-neutral-700 mt-1 mb-0.5 hover:after:content-['#'] after:mx-1 after:text-neutral-200"
      {...props}>
      {props.children}
    </h5>
  ),
  h6: props => (
    <h6
      className="font-semibold text-base text-gray-600 mt-1 mb-0.5 hover:after:content-['#'] after:mx-1 after:text-neutral-200"
      {...props}>
      {props.children}
    </h6>
  ),
  p: props => (
    <p className="my-4 text-base text-neutral-600 leading-loose" {...props}>
      {props.children}
    </p>
  ),
  span: props => (
    <span
      className="text-base text-neutral-700 leading-loose group-aria-[label=inline-code-block]:text-sm group-aria-[label=inline-code-block]:text-violet-800"
      {...props}>
      {props.children}
    </span>
  ),
  strong: props => (
    <strong className="font-bold text-indigo-800 leading-loose" {...props}>
      {props.children}
    </strong>
  ),
  a: props => (
    <a className="text-base text-blue-700 leading-loose" {...props}>
      {props.children}
    </a>
  ),
  pre: props => (
    <pre
      className="p-3 rounded-lg overflow-x-scroll bg-[#282c34] group leading-loose"
      aria-label="code-block"
      {...props}>
      {props.children}
    </pre>
  ),
  code: props => (
    <code
      className="text-sm font-medium leading-loose px-1 py-0.5 mx-0.5 rounded bg-violet-50 border border-violet-300 group group-aria-[label=code-block]:bg-transparent group-aria-[label=code-block]:border-none"
      aria-label="inline-code-block"
      {...props}>
      {props.children}
    </code>
  ),
  ul: props => (
    <ul className="leading-loose list-disc ms-4" {...props}>
      {props.children}
    </ul>
  ),
  ol: props => (
    <ol className="leading-loose list-decimal ms-5" {...props}>
      {props.children}
    </ol>
  ),
  li: props => (
    <li className="leading-loose text-base text-neutral-700" {...props}>
      {props.children}
    </li>
  ),
  table: props => (
    <table className="text-gray-700 border-collapse table-auto my-4" {...props}>
      {props.children}
    </table>
  ),
  thead: props => (
    <thead
      className="text-neutral-700 rounded-lg bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50"
      {...props}>
      {props.children}
    </thead>
  ),
  th: props => (
    <th
      scope="col"
      className="px-6 py-1.5 font-semibold first:rounded-s-lg last:rounded-e-lg"
      {...props}>
      {props.children}
    </th>
  ),
  tr: props => (
    <tr className="border-b last:border-none" {...props}>
      {props.children}
    </tr>
  ),
  td: props => (
    <td className="px-6 py-3" {...props}>
      {props.children}
    </td>
  ),
  blockquote: props => (
    <ObsidianCallout
      components={{
        normal: props => (
          <div className="border-l-4 border-l-indigo-200 ps-2 leading-loose">
            {props.children}
          </div>
        ),
      }}
      {...props}
    />
  ),
  img: props => <img {...props} className="my-4" />,
};

const MdxComponents = ({code}: {code: string}) => {
  const MDX = useMDXComponent(code);
  return <MDX components={components} />;
};

export default MdxComponents;
