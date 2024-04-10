import React from 'react';
import {MDXProvider} from '@mdx-js/react';

const MdxComponents: React.ComponentProps<typeof MDXProvider>['components'] = {
  h1: props => (
    <h1 className="font-bold text-3xl text-gray-900 my-4" {...props}>
      {props.children}
    </h1>
  ),
  h2: props => (
    <h2 className="font-bold text-2xl text-gray-900 my-2" {...props}>
      {props.children}
    </h2>
  ),
  h3: props => (
    <h3 className="font-bold text-xl text-gray-900 my-1" {...props}>
      {props.children}
    </h3>
  ),
  h4: props => (
    <h4 className="font-bold text-lg text-gray-900 my-0.5" {...props}>
      {props.children}
    </h4>
  ),
  h5: props => (
    <h5 className="font-semibold text-base text-gray-700 mb-0.5" {...props}>
      {props.children}
    </h5>
  ),
  h6: props => (
    <h6 className="font-semibold text-base text-gray-600 mb-0.5" {...props}>
      {props.children}
    </h6>
  ),
  p: props => (
    <p className="text-base text-gray-800 leading-relaxed" {...props}>
      {props.children}
    </p>
  ),
  span: props => (
    <span className="text-base text-gray-800 leading-relaxed" {...props}>
      {props.children}
    </span>
  ),
  strong: props => (
    <strong className="font-bold text-teal-900 leading-relaxed" {...props}>
      {props.children}
    </strong>
  ),
  a: props => (
    <a className="text-base text-blue-600 leading-relaxed" {...props}>
      {props.children}
    </a>
  ),
  code: props => (
    <code
      className="text-sm font-medium leading-relaxed bg-gray-200 px-1 py-0.5 mx-0.5 rounded"
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
};

export default MdxComponents;
