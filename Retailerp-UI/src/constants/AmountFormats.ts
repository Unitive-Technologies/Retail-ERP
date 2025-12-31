export const formatCurrency = (value: number | string) => {
  const num = Number(value);
  return `₹${num.toLocaleString('en-IN')}`;
};

export const formatAmountCurrency = (value: number | string) => {
  const num = Number(value);
  return `₹${num.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};
