import type { Preview } from '@storybook/react';
import '../index.scss';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export const parameters = {
    actions: { argTypesRegex: '^on[A-Z].*' },
};

export default preview;