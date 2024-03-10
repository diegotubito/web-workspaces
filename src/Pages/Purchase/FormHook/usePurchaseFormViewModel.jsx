import { useEffect, useState } from 'react'

export const usePurchaseFormViewModel = ({items, setItems}) => {
   const [processedItems, setProcessedItems] = useState([]); // Items con los totales calculados

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
            name: 'description',
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
            maxLength: '12'
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

   const createEmptyService = () => {
      return {
         _id: Date.now().toString() + 'a', // Ensuring _id is a string
         title: '',
         footer: '',
         removeIsAllowed: true,
         fields: [{
            _id: Date.now().toString() + 'b', // Ensuring _id is a string
            name: 'description',
            type: 'text',
            minWidth: '20rem',
            maxWidth: '2fr',
            value: '',
            errorMessage: '',
            isEnabled: true,
            placeholder: 'Description'
         },
         {
            _id: Date.now().toString() + 'f', // Ensuring _id is a string
            name: 'total',
            type: 'currency',
            minWidth: '10rem',
            maxWidth: '0.5fr',
            value: '',
            errorMessage: '',
            isEnabled: true,
            placeholder: '$ 0.00'
         }]
      }
   }

   return { createProductItem, createServiceItem }

}