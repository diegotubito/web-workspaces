import { useEffect, useState } from 'react'
import { PurchaseCrudView } from './CrudView/PurchaseCrudView'
import { Button } from 'react-bootstrap';
import { usePurchaseViewModel } from '../../Hooks/PurchaseItem/usePurchaseViewModel';
import { dateAndTimeFormat } from '../../Utils/Common/dateUtils';
import { PurchaseListView } from './List/PurchaseListView';
import './PurchaseView.css'

export const PurchaseView = () => {
   const [shouldOpenPurchaseCrudView, setShouldPurchaseOpenCrudView] = useState(false)
   const { getPurchaseOrders, orders } = usePurchaseViewModel()
   const [selectedItem, setSelectedItem] = useState()

   useEffect(() => {
      getPurchaseOrders()
   }, [])

   useEffect(() => {
      console.log(selectedItem)
   }, [selectedItem])

   const openPurchaseCrudView = () => {
      setShouldPurchaseOpenCrudView(true)
   }

   const items = [{
      _id: Date.now().toString() + 'a', // Ensuring _id is a string

      fields: [{
         _id: Date.now().toString() + 'b', // Ensuring _id is a string
         name: 'description',
         minWidth: '20rem',
         maxWidth: '2fr',
         value: 'value a',
      },
      {
         _id: Date.now().toString() + 'c', // Ensuring _id is a string
         name: 'owner',
         minWidth: '20rem',
         maxWidth: '2fr',
         value: 'value b',
      },
      {
         _id: Date.now().toString() + 'd', // Ensuring _id is a string
         name: 'total',
         minWidth: '20rem',
         maxWidth: '2fr',
         value: 'value c',
         },  {
            _id: Date.now().toString() + 'i', // Ensuring _id is a string
            name: 'description',
            minWidth: '20rem',
            maxWidth: '2fr',
            value: 'value a',
         }, {
            _id: Date.now().toString() + 'j', // Ensuring _id is a string
            name: 'description',
            minWidth: '20rem',
            maxWidth: '2fr',
            value: 'value a',
         }]
   },
   {
      _id: Date.now().toString() + 'e', // Ensuring _id is a string

      fields: [{
         _id: Date.now().toString() + 'f', // Ensuring _id is a string
         name: 'description',
         minWidth: '20rem',
         maxWidth: '2fr',
         value: 'value a',
      },
      {
         _id: Date.now().toString() + 'g', // Ensuring _id is a string
         name: 'owner',
         minWidth: '20rem',
         maxWidth: '2fr',
         value: 'value b',
      },
      {
         _id: Date.now().toString() + 'h', // Ensuring _id is a string
         name: 'total',
         minWidth: '20rem',
         maxWidth: '2fr',
         value: 'value c',
      }, {
         _id: Date.now().toString() + 'i', // Ensuring _id is a string
         name: 'description',
         minWidth: '20rem',
         maxWidth: '2fr',
         value: 'value a',
      }, {
         _id: Date.now().toString() + 'j', // Ensuring _id is a string
         name: 'description',
         minWidth: '20rem',
         maxWidth: '2fr',
         value: 'value a',
      },]
   }]

   return (
      <div className='purchase_view__main purchase_view__gap'>
         <Button size='lr' onClick={() => openPurchaseCrudView()}>Open Pop Up</Button>

         <PurchaseCrudView
            isOpen={shouldOpenPurchaseCrudView}
            setIsOpen={setShouldPurchaseOpenCrudView}
         />

         <PurchaseListView
            className='purchase__view-order-list '
            items={items}
            selectedItem={selectedItem}
            setSelectedItem={setSelectedItem}
         />


      </div >
   )
}