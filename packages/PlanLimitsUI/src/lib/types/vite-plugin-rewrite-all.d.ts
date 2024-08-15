declare module 'vite-plugin-rewrite-all' {
  import { Plugin } from 'vite';
  const redirectAll: () => Plugin;
  export default redirectAll;
}
