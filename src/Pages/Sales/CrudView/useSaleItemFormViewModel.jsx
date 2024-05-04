export const useSaleItemFormViewModel = ({ setOrderItems, saleItems }) => {
   const createProductItem = () => {
      const emptyInputField = createEmptyProduct()
      setOrderItems((currentItems) => {
         return [...currentItems, emptyInputField]
      })
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
                  title: `${saleItem.title} ${saleItem.description}`
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
            value: '',
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
            value: '',
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
            value: '',
            errorMessage: '',
            isEnabled: false,
            placeholder: '$ 0.00'
         }]
      }
   }


   return { createProductItem }

}