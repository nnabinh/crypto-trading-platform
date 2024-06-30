export function formatPercent(value: number) {
  let sign = '';
  if (value > 0) {
    sign = '+';
  } else if (value < 0) {
    sign = '-';
  }
  return `${sign}${Math.abs(value).toFixed(2)}%`;
}

export function formatDollar(value: number) {
  return `$${value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
}
