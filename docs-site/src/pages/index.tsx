import * as React from 'react';
import Layout from '../components/layout';
import ArticleHeader from '../components/article-header';
import Prose from '../components/prose';
import { graphql, PageProps } from 'gatsby';

export default function Index({ data }: PageProps<Queries.MarkdownPageQuery>) {
  const { markdownRemark } = data;
  const { frontmatter, html } = markdownRemark!!;

  return (
    <Layout currentPath="/">
      <ArticleHeader title={frontmatter!!.title!!} />
      <Prose>
        <div dangerouslySetInnerHTML={{ __html: html!! }} />
      </Prose>
    </Layout>
  );
}

export function Head() {
  return <title>Environmental Outcomes Platform (EOP)</title>;
}

export const pageQuery = graphql`
  query MarkdownPage {
    markdownRemark(frontmatter: { key: { eq: "index" } }) {
      frontmatter {
        title
      }
      html
    }
  }
`;
