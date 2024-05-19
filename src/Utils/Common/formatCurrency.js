export const formatCurrency = (value) => {
   // Remove any character that is not a digit or a minus sign
   let cleanedValue = value.replace(/[^\d-]+/g, '');

   // Convert the cleaned value to cents
   let centValue = parseInt(cleanedValue, 10) || 0;

   // Convert to currency format
   let formattedValue = (centValue / 100).toFixed(2);

   // Use Intl.NumberFormat to format the number with the currency symbol and thousand separator
   const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD', // Change to your desired currency code
      maximumFractionDigits: 2,
   });

   // Return the formatted currency string
   return formatter.format(formattedValue);
};

export const convertCurrencyStringToNumber = (currencyString) => {
   // Check if currencyString is of type string
   if (typeof currencyString !== 'string') {
      // Return null or throw an error, depending on your use case
      return currencyString;
   }

   // Extract the number part from the currency string, preserving the minus sign
   const numberString = currencyString.replace(/[^0-9.-]+/g, '');

   // Parse the number part as a float
   return parseFloat(numberString);
};
