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
