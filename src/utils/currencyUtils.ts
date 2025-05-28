
// Current USD to INR exchange rate
export const USD_TO_INR_RATE = 83.5;

// Convert USD to INR
export const convertUsdToInr = (usdAmount: number): number => {
  return usdAmount * USD_TO_INR_RATE;
};

// Format amount as Indian Rupees
export const formatINR = (amount: number): string => {
  return `₹${amount.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
};

// Format amount as Indian Rupees without decimal places for chart axes
export const formatINRShort = (amount: number): string => {
  if (amount >= 10000000) { // 1 crore
    return `₹${(amount / 10000000).toFixed(1)}Cr`;
  } else if (amount >= 100000) { // 1 lakh
    return `₹${(amount / 100000).toFixed(1)}L`;
  } else if (amount >= 1000) { // 1 thousand
    return `₹${(amount / 1000).toFixed(1)}K`;
  }
  return `₹${amount.toFixed(0)}`;
};

// Get exchange rate info for display
export const getExchangeRateInfo = (): string => {
  return `Exchange Rate: 1 USD = ₹${USD_TO_INR_RATE}`;
};
