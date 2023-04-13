import * as React from 'react';
import Layout from '../components/layout';
import ArticleHeader from '../components/article-header';
import Prose from '../components/prose';
import { graphql, PageProps } from 'gatsby';

export default function Index({ data }: PageProps<Queries.MarkdownPageQuery>) {
  const { markdownRemark } = data;
  const { html } = markdownRemark!!;

  return (
    <Layout currentPath="/">
      <ArticleHeader title="What is EOP" section="Introduction" />
      <Prose>
        <div>
          <p className="text-center font-bold italic">
            The Environmental Outcomes Platform (EOP) is an end-to-solution for
            acquiring, managing, and interacting with environmental information
            to empower council services both internally and externally.
          </p>
          <p className="text-center font-bold italic">
            The vision is to have an environment focused platform that has
            outcomes at heart.
          </p>

          <div dangerouslySetInnerHTML={{ __html: html!! }} />
        </div>
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
      html
    }
  }
`;
