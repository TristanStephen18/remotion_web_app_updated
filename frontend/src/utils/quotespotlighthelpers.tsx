export const fontSizeIndicatorQuote = (size: number) => {
  console.log(size);
  if (size <= 60) {
    return 1;
  } else if (size > 60) {
    return 0.75;
  } else {
    return 0.5;
  }
};

export const quoteSpotlightDurationCalculator = (size: number) => {
  if (size <= 60) {
    return 7;
  } else if (size > 60 && size < 80) {
    return 10;
  } else {
    return 14;
  }
};
