export function cn(...inputs: string[]) {
  return inputs.filter(Boolean).join(' ');
}

export function countZerosAfterDecimal(num: string): number {
  const match = num.match(/\.0*/);
  return match ? match[0].length - 1 : 0;
}

// create a function to read number of 0's after decimal and use <span tw="text-6xl justify-end items-end -mb-2">4</span> to create subscript
export function formatDecimal(num: string, ...classNames: string[]) {
  const zeroCount = countZerosAfterDecimal(num);
  
  if (zeroCount <= 3) return parseFloat(num).toFixed(zeroCount+4);

  const splitNum = num.toString().split('.');

  return (
    <>${splitNum[0]}.0<span tw={cn("justify-end items-end -mb-2", ...classNames)}>{zeroCount}</span>{splitNum[1].substring(zeroCount, 4 + zeroCount)}</>
  )
}

export function formatPercentage(num: number, ...classNames: string[]) {
  if (num > 0) return <span tw={cn("text-[#39c040]", ...classNames)}>+{num}%</span>;
  if (num < 0) return <span tw={cn("text-[#c03939]", ...classNames)}>{num}%</span>;
  return <span tw={cn("text-[#8d8d8d]", ...classNames)}>+0%</span>;
}

export function commify(num: number, decimals: number = 2) {
  num = parseFloat(num.toFixed(decimals));
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}