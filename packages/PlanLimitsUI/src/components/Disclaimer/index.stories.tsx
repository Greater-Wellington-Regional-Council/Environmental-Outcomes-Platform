import { Meta } from '@storybook/react-vite';
import Disclaimer from '../Disclaimer'; // Adjust the import path as needed

export default {
  title: 'Components/Disclaimer',
  component: Disclaimer,
} as Meta;

export const Default = {
  args: {},

  // decorators: [
  //   (Story) => {
  //     localStorage.removeItem('disclaimer-agreed');
  //     return <Story />;
  //   },
  // ],
};
