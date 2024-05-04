// contentlayer.config.ts
import {defineDocumentType, makeSource} from 'contentlayer/source-files';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypePrettyCode from 'rehype-pretty-code';

export const Post = defineDocumentType(() => ({
  name: 'Post',
  filePathPattern: `**/*.md`,
  contentType: 'mdx',
  fields: {
    title: {
      type: 'string',
      required: true,
    },
    date: {
      type: 'date',
      required: true,
    },
    thumbnail: {
      type: 'string',
      required: true,
    },
    category: {
      type: 'string',
      required: true,
    },
    tags: {
      type: 'list',
      required: true,
      of: {type: 'string'},
    },
    excerpt: {
      type: 'string',
      required: false,
    },
    slug: {
      type: 'string',
      required: true,
    },
  },
  computedFields: {
    url: {
      type: 'string',
      resolve: doc => `${doc.slug}/`,
    },
  },
}));

const contentSource = makeSource({
  contentDirPath: '_posts',
  documentTypes: [Post],
  contentDirExclude: ['**/.obsidian/**', '**/_template/**'],
  mdx: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      rehypeSlug,
      [
        // @ts-ignore
        rehypePrettyCode,
        {
          theme: 'one-dark-pro',
          defaultLang: {
            block: 'tsx',
            inline: 'plaintext',
          },
          keepBackground: false,
        },
      ],
      [
        rehypeAutolinkHeadings,
        {
          properties: {
            className: ['anchor'],
          },
          behavior: 'wrap',
        },
      ],
    ],
  },
});

export default contentSource;
