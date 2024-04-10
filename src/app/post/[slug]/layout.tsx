import React, {PropsWithChildren} from 'react';

const PostLayout: React.FC<PropsWithChildren> = ({children}) => {
  return <main className="mx-auto max-w-screen-lg">{children}</main>;
};

export default PostLayout;
