import type { GatsbyConfig } from 'gatsby';

const config: GatsbyConfig = {
  siteMetadata: {
    title: `Environmental Outcomes Platform`,
    siteUrl: `https://greater-wellington-regional-council.github.io/Environmental-Outcomes-Platform/`,
  },
  pathPrefix: 'Environmental-Outcomes-Platform',
  graphqlTypegen: true,
  plugins: [
    'gatsby-plugin-postcss',
    'gatsby-plugin-sitemap',
    'gatsby-plugin-sharp',
    {
      resolve: 'gatsby-transformer-remark',
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 800,
            },
          },
        ],
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'markdown-pages',
        path: './src/markdown-pages',
      },
    },
  ],
};

export default config;
