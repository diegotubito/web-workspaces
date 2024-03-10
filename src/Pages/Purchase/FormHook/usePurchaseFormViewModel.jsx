export const usePurchaseFormViewModel = ({setItems}) => {
   

   const createProductItem = () => {
      const emptyInputField = createEmptyProduct()
      setItems((currentItems) => {
         return [...currentItems, emptyInputField]
      })
   }

   const createServiceItem = () => {
      const emptyInputField = createEmptyService()
      setItems((currentItems) => {
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

            type: 'selector',
            selectorItems: [{ _id: Date.now().toString() + 'f', title: 'uno' },
            { _id: Date.now().toString() + 'g', title: 'dos' }],
            minWidth: '20rem',
            maxWidth: '2fr',
            value: '',
            errorMessage: '',
            isEnabled: true,
            placeholder: ''
         },
         {
            _id: Date.now().toString() + 'd', // Ensuring _id is a string
            type: 'text',
            minWidth: '3rem',
            maxWidth: '0.3fr',
            value: '',
            errorMessage: '',
            isEnabled: true,
            placeholder: ''
         },
         {
            _id: Date.now().toString() + 'e', // Ensuring _id is a string
            type: 'currency',
            minWidth: '10rem',
            maxWidth: '0.5fr',
            value: '',
            errorMessage: '',
            isEnabled: true,
            placeholder: '$ 0.00'
         },
         {
            _id: Date.now().toString() + 'f', // Ensuring _id is a string
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

   const createEmptyService = () => {
      return {
         _id: Date.now().toString() + 'a', // Ensuring _id is a string
         title: '',
         footer: '',
         removeIsAllowed: true,
         fields: [{
            _id: Date.now().toString() + 'b', // Ensuring _id is a string

            type: 'text',
            minWidth: '20rem',
            maxWidth: '2fr',
            value: '',
            errorMessage: '',
            isEnabled: true,
            placeholder: 'Description'
         },
         {
            _id: Date.now().toString() + 'd', // Ensuring _id is a string
            type: 'text',
            minWidth: '3rem',
            maxWidth: '0.3fr',
            value: '',
            errorMessage: '',
            isEnabled: true,
            placeholder: ''
         },
         {
            _id: Date.now().toString() + 'e', // Ensuring _id is a string
            type: 'currency',
            minWidth: '10rem',
            maxWidth: '0.5fr',
            value: '',
            errorMessage: '',
            isEnabled: true,
            placeholder: '$ 0.00'
         },
         {
            _id: Date.now().toString() + 'f', // Ensuring _id is a string
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

   return { createProductItem, createServiceItem }

}