/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'http://localhost:3000',
  generateRobotsTxt: true,
  changefreq: 'daily',
  exclude: ['/server-sitemap.xml'],
  robotsTxtOptions: {
    additionalSitemaps: ['https://localhost:3000/server-sitemap.xml'],
  },
};
