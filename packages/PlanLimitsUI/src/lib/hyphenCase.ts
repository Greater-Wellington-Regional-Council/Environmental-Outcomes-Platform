import snakeCase from '@lib/snakeCase';

export const hyphenCase = (str: string) => snakeCase(str, '-');

export default hyphenCase;
