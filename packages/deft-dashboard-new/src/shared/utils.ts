export function classNames(...classes: string[]): string {
  return classes.filter(Boolean).join(" ");
}

declare global {
  interface Number {
    asCurrency(fractionDigits?: number): string;
  }
}

// @ts-ignore
// eslint-disable-next-line no-extend-native
Number.prototype.asCurrency = function (this: number, fractionDigits?: number) {
  return (
    fractionDigits ? this.toFixed(fractionDigits) : this.toString()
  ).replace(/\d(?=(\d{3})+\.)/g, "$&,");
};
