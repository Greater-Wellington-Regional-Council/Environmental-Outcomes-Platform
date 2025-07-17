
export const isNumber = (value: unknown): boolean =>
  typeof value === 'number' && !Number.isNaN(value);

export const isNumberString = (value: unknown): boolean => /^[+-]?\d+(\.\d+)?$/.test(value as string)

export const numValue = (value: unknown, defaultValue?: number): number => {
  if (isNumber(value))
    return value as number;

  if (typeof value === 'string' && isNumberString(value))
    return parseFloat(value)

  return defaultValue ?? 0;
}

export default numValue
