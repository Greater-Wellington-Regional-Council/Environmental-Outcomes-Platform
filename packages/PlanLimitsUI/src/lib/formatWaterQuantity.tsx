const format = Intl.NumberFormat();

export default function formatWaterQuantity(quantity: number, unit: string) {
  return `${format.format(quantity)} ${unit}`;
}
