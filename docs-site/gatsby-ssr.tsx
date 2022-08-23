import React from 'react';
import { GatsbySSR } from 'gatsby';

export const onRenderBody: GatsbySSR['onRenderBody'] = ({
  setHeadComponents,
}) => {
  setHeadComponents([
    <link
      key="favicon"
      href="data:image/x-icon;base64,AAABAAEAEBAQAAEABAAoAQAAFgAAACgAAAAQAAAAIAAAAAEABAAAAAAAgAAAAAAAAAAAAAAAEAAAAAAAAADbcgAAAAAAAP///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEREQAAABEREREAIiIiABEREAIiIiIgAREAIiICIiIAEQIiIgIiIiAQAiIiACIiAgAiIiAAAiACACIiIAACIAAAIiACACIAAAAiACIiIiAAACIAIiIiIiABAAAAIiIgABEAAAAiIAAAERAAAiIAAAEREQAiIiIAEREREQAAABERH4HwAA4AcAAMADAACAAQAAgAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIABAACAAQAAwAMAAOAHAAD4HwAA"
      rel="icon"
      type="image/x-icon"
    />,
    <script
      key="mermaid_script"
      src="https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js"
    ></script>,
    <script
      key="mermaid_init"
      dangerouslySetInnerHTML={{
        __html: `mermaid.initialize({startOnLoad:true});`,
      }}
    />,
  ]);
};
