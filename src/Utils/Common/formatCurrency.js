
export const formatCurrency = (value) => {
   // Eliminar cualquier caracter que no sea dígito
   let cleanedValue = value.replace(/\D+/g, '');

   // Convertir el valor limpio a centavos
   let centValue = parseInt(cleanedValue, 10) || 0;

   // Convertir a formato de moneda
   let formattedValue = (centValue / 100).toFixed(2)

   // Use Intl.NumberFormat to format the number with the currency symbol and thousand separator
   const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD', // Change to your desired currency code
      maximumFractionDigits: 2,
   });

   // Agregar símbolo de pesos
   return `${formatter.format(formattedValue)}`;
};

export const convertCurrencyStringToNumber = (currencyString) => {
   // Verifica si currencyString es de tipo string
   if (typeof currencyString !== 'string') {
      // Retorna null o podrías lanzar un error, dependiendo de tu caso de uso
      return currencyString;
   }

   const numberString = currencyString.replace(/[^0-9.-]+/g, '');
   return parseFloat(numberString);
};

