import React from 'react';
import {MDXProvider} from '@mdx-js/react';
import {ObsidianCallout} from 'obsidian-callouts-markdown';

const MdxComponents: React.ComponentProps<typeof MDXProvider>['components'] = {
  h1: props => (
    <h1
      className="font-bold text-3xl text-gray-900 my-2 hover:after:content-['#'] after:mx-1 after:text-neutral-200"
      {...props}>
      {props.children}
    </h1>
  ),
  h2: props => (
    <h2
      className="font-bold text-2xl text-gray-900 my-2 hover:after:content-['#'] after:mx-1 after:text-neutral-200"
      {...props}>
      {props.children}
    </h2>
  ),
  h3: props => (
    <h3
      className="font-bold text-xl text-gray-900 my-1 hover:after:content-['#'] after:mx-1 after:text-neutral-200"
      {...props}>
      {props.children}
    </h3>
  ),
  h4: props => (
    <h4
      className="font-bold text-lg text-gray-900 my-0.5 hover:after:content-['#'] after:mx-1 after:text-neutral-200"
      {...props}>
      {props.children}
    </h4>
  ),
  h5: props => (
    <h5
      className="font-semibold text-base text-gray-700 mb-0.5 hover:after:content-['#'] after:mx-1 after:text-neutral-200"
      {...props}>
      {props.children}
    </h5>
  ),
  h6: props => (
    <h6
      className="font-semibold text-base text-gray-600 mb-0.5 hover:after:content-['#'] after:mx-1 after:text-neutral-200"
      {...props}>
      {props.children}
    </h6>
  ),
  p: props => (
    <p className="my-2 text-base text-gray-800 leading-7" {...props}>
      {props.children}
    </p>
  ),
  span: props => (
    <span className="text-base text-gray-800 leading-7" {...props}>
      {props.children}
    </span>
  ),
  strong: props => (
    <strong className="font-bold text-violet-900 leading-relaxed" {...props}>
      {props.children}
    </strong>
  ),
  a: props => (
    <a className="text-base text-blue-600 leading-relaxed" {...props}>
      {props.children}
    </a>
  ),
  pre: props => (
    <pre className="p-3 rounded-lg" {...props}>
      {props.children}
    </pre>
  ),
  code: props => (
    <code
      className="text-sm font-medium leading-relaxed px-1.5 py-1 mx-0.5 rounded"
      {...props}>
      {props.children}
    </code>
  ),
  ul: props => (
    <ul className="leading-relaxed list-disc ms-4" {...props}>
      {props.children}
    </ul>
  ),
  ol: props => (
    <ol className="leading-relaxed list-decimal ms-5" {...props}>
      {props.children}
    </ol>
  ),
  table: props => (
    <table className="text-gray-700 border-collapse table-auto my-4" {...props}>
      {props.children}
    </table>
  ),
  thead: props => (
    <thead
      className="text-gray-900 rounded-lg bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50"
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
          <div className="border-l-4 border-l-indigo-200 ps-2">
            {props.children}
          </div>
        ),
      }}
      {...props}
    />
  ),
};

export default MdxComponents;
