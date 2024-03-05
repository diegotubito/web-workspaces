import { useEffect } from 'react'
import './PurchaseView.css'
import {usePurchaseViewModel} from './usePurchaseViewModel'

export const PurchaseView = () => {
   const {getItems} = usePurchaseViewModel()

   useEffect(() => {
      getItems()
   }, [])

   return (
      <div className='purchase_view__main'>
         <h1>Purchase View</h1>
        
      </div>
   )
}