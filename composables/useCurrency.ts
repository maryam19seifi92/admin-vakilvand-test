export const useCurrency = (price: number, rial?: string) => {
  return rial
    ? new Intl.NumberFormat().format(Math.trunc(price)) + " ریال"
    : new Intl.NumberFormat().format(Math.trunc(price)) + " تومان ";
};
