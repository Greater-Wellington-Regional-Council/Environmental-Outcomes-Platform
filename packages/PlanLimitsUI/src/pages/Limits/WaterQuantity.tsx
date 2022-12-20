const format = Intl.NumberFormat();

export default function waterQuantity(quantity: number, unit: string) {
  return `${format.format(quantity)} ${unit}`;
}
