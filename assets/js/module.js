"use strict"; // Enforces strict mode in JavaScript, which helps catch errors such as undeclared variables, assignments to read-only properties, and other mistakes.

export const numberToKilo = function (number) {
  // Exports the function 'numberToKilo' so it can be imported into other modules.
  // The function takes a single argument: 'number', which is a number that will be formatted as a shortened string with 'k' (thousand) or 'M' (million).

  const /** { String } */ numStr = String(number);
  // Converts the input 'number' to a string and assigns it to the variable 'numStr'.
  // The comment /** { String } */ is a JSDoc annotation that indicates 'numStr' should be a string.

  if (numStr.length <= 3) {
    // Checks if the length of 'numStr' (i.e., the number of digits in the number) is less than or equal to 3 (e.g., 999 or lower).
    // This means the number is less than 1000 and doesn't need shortening.

    return numStr;
    // If the number is less than or equal to 999, the function simply returns the original string representation of the number.
  } else if (numStr.length >= 4 && numStr.length <= 5) {
    // If the number has 4 or 5 digits (e.g., between 1000 and 99999), we need to shorten it and append 'k' for "thousands".

    return `${numStr.slice(0, -3)}.${numStr.slice(-3, -2)}k`;
    // This line shortens the number by removing the last 3 digits (the thousands place) and adds a decimal point followed by the first digit of the last 3 digits.
    // For example:
    //   1234 → '1.2k'
    //   9999 → '9.9k'
    // The 'slice(0, -3)' removes the last 3 digits, and 'slice(-3, -2)' extracts the third-to-last digit.
  } else if (numStr.length === 6) {
    // If the number has exactly 6 digits (i.e., 100000 to 999999), we shorten it by removing the last 3 digits and appending 'k'.

    return `${numStr.slice(0, -3)}k`;
    // This shortens the number by removing the last 3 digits and appending 'k' (indicating thousands).
    // For example:
    //   100000 → '100k'
    //   999999 → '999k'
  } else {
    // If the number has more than 6 digits, we assume it is in the millions and shorten it with 'M' for "million".

    return `${numStr.slice(0, -6)}M`;
    // This removes the last 6 digits and appends 'M', indicating millions.
    // For example:
    //   1000000 → '1M'
    //   5000000 → '5M'
  }
};
// End of the function 'numberToKilo'. It handles various numbers by converting them into a human-readable format (thousands or millions).
