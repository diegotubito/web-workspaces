import { convertCurrencyStringToNumber, formatCurrency } from "../../../Utils/Common/formatCurrency"

export const useSaleItemFormViewModel = ({ setOrderItems, saleItems }) => {
   const createProductItem = () => {
      const emptyInputField = createEmptyProduct()
      setOrderItems((currentItems) => {
         return [...currentItems, emptyInputField]
      })
   }

   const getDefaultSalesPrice = () => {
      const result = (saleItems.length > 0) ? saleItems[0].salePrice : ''
      const formattedResult = formatCurrency(String(result))
      return formattedResult
   }

   const createEmptyProduct = () => {

      return {
         _id: Date.now().toString() + 'a', // Ensuring _id is a string
         title: '',
         footer: '',
         removeIsAllowed: true,
         fields: [{
            _id: Date.now().toString() + 'b', // Ensuring _id is a string
            name: 'selector',
            type: 'selector',
            selectorItems: saleItems
               .map(saleItem => ({
                  _id: saleItem._id,
                  title: `${saleItem.title} ${saleItem.description}`,
                  price: saleItem.salePrice ? saleItem.salePrice: 0
               })),
            minWidth: '20rem',
            maxWidth: '1fr',
            value: (saleItems.length > 0) ? saleItems[0]._id : '',
            errorMessage: '',
            isEnabled: true,
            placeholder: ''
         }, {
            _id: Date.now().toString() + 'c', // Ensuring _id is a string
            name: 'description',
            type: 'text',
            minWidth: '20rem',
            maxWidth: '1fr',
            value: '',
            errorMessage: '',
            isEnabled: true,
            placeholder: 'Description'
         },
         {
            _id: Date.now().toString() + 'd', // Ensuring _id is a string
            name: 'quantity',
            type: 'quantity',
            minWidth: '3rem',
            maxWidth: '0.3fr',
            value: '1',
            errorMessage: '',
            isEnabled: true,
            placeholder: '0',
            maxLength: '3'
         },
         {
            _id: Date.now().toString() + 'e', // Ensuring _id is a string
            name: 'sub_total',
            type: 'currency',
            minWidth: '10rem',
            maxWidth: '0.5fr',
            value: getDefaultSalesPrice(),
            errorMessage: '',
            isEnabled: true,
            placeholder: '$ 0.00',
            maxLength: '15'
         },
         {
            _id: Date.now().toString() + 'f', // Ensuring _id is a string
            name: 'total',
            type: 'currency',
            minWidth: '10rem',
            maxWidth: '0.5fr',
            value: getDefaultSalesPrice(),
            errorMessage: '',
            isEnabled: false,
            placeholder: '$ 0.00'
         }]
      }
   }


   return { createProductItem }

}