import React, {PropsWithChildren} from 'react';

const PostLayout: React.FC<PropsWithChildren> = ({children}) => {
  return (
    <main className="mx-auto max-w-screen-lg bg-white py-8 px-8 rounded-2xl border">
      {children}
    </main>
  );
};

export default PostLayout;
