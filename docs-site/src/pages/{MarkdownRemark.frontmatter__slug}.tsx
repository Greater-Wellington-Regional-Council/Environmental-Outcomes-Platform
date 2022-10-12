import React from 'react';
import { graphql, PageProps } from 'gatsby';
import Layout from '../components/layout';
import ArticleHeader from '../components/article-header';
import Prose from '../components/prose';

export default function MarkdownPage({
  data,
  path,
}: PageProps<Queries.MarkdownPageQuery>) {
  const { markdownRemark } = data;
  const { frontmatter, html } = markdownRemark!!;

  // Forces any mermaid diagrams to be re-drawn
  React.useEffect(() => {
    // @ts-ignore
    mermaid.init();
  }, [html]);

  return (
    <Layout currentPath={path}>
      <ArticleHeader
        title={frontmatter!!.title!!}
        section={frontmatter!!.section!!}
      />
      <Prose>
        <div dangerouslySetInnerHTML={{ __html: html!! }} />
      </Prose>
    </Layout>
  );
}

export function Head({ data }: PageProps<Queries.MarkdownPageQuery>) {
  return <title>EOP - {data.markdownRemark!!.frontmatter!!.title!!}</title>;
}

export const pageQuery = graphql`
  query MarkdownPage($id: String!) {
    markdownRemark(id: { eq: $id }) {
      frontmatter {
        title
        section
      }
      html
    }
  }
`;
