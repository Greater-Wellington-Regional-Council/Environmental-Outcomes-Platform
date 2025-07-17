export const snakeCase = (str: string, sep: string = '_') => {
  return str
    .replace(/[ \-_]/g, '') // Remove spaces, hyphens, underscores
    .replace(/([A-Z])/g, `${sep}$1`) // Add separator before uppercase
    .toLowerCase()
    .replace(new RegExp(`^${sep}+`), '') // Trim leading separator
    .replace(new RegExp(`${sep}{2,}`, 'g'), sep); // Remove duplicate separators
};

export default snakeCase;
