import * as React from 'react';
import Layout from '../components/layout';
import ArticleHeader from '../components/article-header';
import Prose from '../components/prose';

export default function Index() {
  return (
    <Layout currentPath="/">
      <ArticleHeader title="Getting Started" section="Introduction" />
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
          <h2>Overview</h2>
          <p>
            EOP is an initiative led by GWRC building on the experience of ECAN
            to build a set of systems for managing environmental information in
            such a way to lead to actionable outcomes in a way that can support
            all councils.
          </p>
          <p>
            <span className="font-bold">TODO</span> Describe what we mean by
            outcomes
          </p>
          <p>
            <span className="font-bold">TODO</span> Talk about regional sector
            governance
          </p>
          <h2>Roadmap</h2>
          <p>
            In these pages we document the architectural vision for EOP. When it
            comes to building out the platform the intention is to focus on
            building a MVP slice through the architecture that supports an
            delivering for an outcome to a set of users and only what is
            required to deliver that. Then the next outcome we will deliver will
            build on top of the previous and evolve things as needed as we learn
            more.
          </p>
          <p>
            We trust the we can evolve the architecture as we go and adjust when
            new information comes to light.
          </p>
          <h2>Open Source</h2>
          <p>
            EOP is a collaboration being developed as Open Source Software (OSS
            - License MIT) making it open and available for all New Zealand
            regional councils. The regional councils are expected to be the main
            contributors whether via their own staff or employing a third party
            vendor to contribute on their behalf.
          </p>
          <h2>Hosting</h2>
          <p>
            While this is being built as OSS there is a cost to host and
            maintain an instance of the platform. The platform is built to be
            multi-tenanted with a small number of instances run to support the
            councils of New Zealand.
          </p>
        </div>
      </Prose>
    </Layout>
  );
}

export function Head() {
  return <title>Environmental Outcomes Platform (EOP)</title>;
}
