import { useState } from 'react'
import { PurchaseCrudView } from './CrudView/PurchaseCrudView'
import { Button } from 'react-bootstrap';

export const PurchaseView = () => {
   const [shouldOpenPurchaseCrudView, setShouldPurchaseOpenCrudView] = useState(false)

   const openPurchaseCrudView = () => {
      setShouldPurchaseOpenCrudView(true)
   }

   return (
      <div className='purchase_view__main purchase_view__gap'>
         <Button size='lr' onClick={() => openPurchaseCrudView()}>Open Pop Up</Button>

         <PurchaseCrudView
            isOpen={shouldOpenPurchaseCrudView}
            setIsOpen={setShouldPurchaseOpenCrudView}
         />
      </div >
   )
}