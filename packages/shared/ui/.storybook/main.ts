import type { StorybookConfig } from "@storybook/react-vite";
import { execSync } from "child_process";

const findStorybookRefs = (): Record<string, { title: string; url: string }> => {
  const refs: Record<string, { title: string; url: string }> = {};
  const basePort = 6007;
  const maxPort = 6010;

  for (let port = basePort; port <= maxPort; port++) {
    try {
      const result = execSync(`lsof -i :${port}`, { encoding: "utf-8" });

      if (result.includes("LISTEN")) {
        refs[`storybook-${port}`] = {
          title: `Storybook on ${port}`,
          url: `http://localhost:${port}`,
        };
      }
    } catch {
      continue;
    }
  }

  return refs;
};

const config: StorybookConfig = {
  stories: [
    "../src/**/*.mdx",
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)",
  ],
  refs: findStorybookRefs(),
  addons: [
    "@storybook/addon-onboarding",
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@chromatic-com/storybook",
    "@storybook/addon-interactions",
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
};

export default config;