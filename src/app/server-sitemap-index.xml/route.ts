import {getServerSideSitemap} from 'next-sitemap';
import {allBooks, allPosts} from '@/contentlayer/generated';
import {BLOG} from '@/meta';

export async function GET() {
  const bookSitemap = allBooks.map(book => ({
    loc: `${BLOG.SITE_URL}/${book.slug}`,
    lastmod: book.updated,
    priority: 0.7,
  }));
  const postSitemap = allPosts.map(post => ({
    loc: `${BLOG.SITE_URL}/${post.slug}`,
    lastmod: post.updated,
    priority: 1,
  }));

  return getServerSideSitemap([...bookSitemap, ...postSitemap]);
}
