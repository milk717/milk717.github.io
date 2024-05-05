const BlogInfo = require('./src/BlogInfo.json');

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: BlogInfo.siteUrl,
  generateRobotsTxt: true,
  changefreq: 'daily',
  exclude: ['/server-sitemap.xml'],
  robotsTxtOptions: {
    additionalSitemaps: [`${BlogInfo.siteUrl}/server-sitemap.xml`],
  },
};
