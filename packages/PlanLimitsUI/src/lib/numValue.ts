
export const isNumber = (value: unknown): boolean =>
  typeof value === 'number' && !Number.isNaN(value);

export const numValue = (value: unknown): number => {
  if (isNumber(value))
    return value as number;

  if (typeof value === 'string' && /^\d+(\.\d+)?$/.test(value))
    return parseFloat(value)

  return 0;
}

export default numValue
