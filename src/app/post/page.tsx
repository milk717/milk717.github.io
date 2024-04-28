import {getAllPostByTag} from '@/lib/api';
import Card from '@/components/Card';
import React from 'react';

type PostProps = {
  searchParams: {
    tag: string;
  };
};

const Post: React.FC<PostProps> = ({searchParams: {tag}}) => {
  const allPosts = getAllPostByTag(tag);

  return (
    <main>
      <h2 className="mb-2.5 text-3xl font-bold text-neutral-800">
        {tag ? `# ${tag}` : 'All Posts'}
      </h2>
      <div className="flex flex-col gap-4">
        {allPosts.map(post => (
          <Card key={post._id} post={post} />
        ))}
      </div>
    </main>
  );
};

export default Post;
