const formatter = new Intl.NumberFormat("en-US");
export const formatCurrency = (amount: number) => {
  const formatedRes = formatter.format(Number(amount.toFixed(2)));

  const [, rest = ""] = formatedRes.split(".");

  if (rest.length == 2) {
    return formatedRes;
  } else if (rest.length === 1) {
    return formatedRes + "0";
  }

  return formatedRes + ".00";
};

// borrowed from https://github.com/mikemaccana/dynamic-template
export const dynamicTemplate = (templateStr: string, vars: any) =>
  templateStr.replace(/\${(.*?)}/g, (_, g) => vars[g]);

function chunk<T>(arr: T[], len: number) {
  var chunks = [],
    i = 0,
    n = arr.length;

  while (i < n) {
    chunks.push(arr.slice(i, (i += len)));
  }

  return chunks;
}

export const formatNum = (num: number) => {
  const s = Number(num).toString().split("").reverse();
  return chunk(s, 3)
    .map(item => item.reverse().join(""))
    .reverse()
    .join(",");
};

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
