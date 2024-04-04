import { useEffect, useState } from 'react'
import { GridView } from '../../../Components/GridView/GridView';
import { useTranslation } from 'react-i18next';

import { SimpleButton } from '../../../Components/Buttons/SimpleButton/SimpleButton'

import { useInstallmentViewModel } from '../../../Hooks/Installment/useInstallmentViewModel';
import { useInstallmentMapping } from '../useInstallmentMapping';

export const PurchaseOrderInstallmentComponent = ({ initialOrder, onSelectedInstallment, onInstallmentError, onPayemntDidClicked, setIsLoading }) => {
   const { t } = useTranslation()

   const { getInstallments, installments, onInstallmentFailed, isLoading } = useInstallmentViewModel()
   const { mapInstallments } = useInstallmentMapping()
   const [mappedInstallments, setMappedInstallments] = useState([])
   const [selectedInstallment, setSelectedInstallment] = useState()

   const [payButtonState, setPayButtonState] = useState(false)

   useEffect(() => {
      setIsLoading(isLoading)
   }, [isLoading, setIsLoading])

   useEffect(() => {
      setMappedInstallments([])
      if (initialOrder) {
         getInstallments(initialOrder._id)
      }
   }, [initialOrder])

   useEffect(() => {
      if (selectedInstallment) {
         setMappedInstallments(mapInstallments(installments, selectedInstallment._id))
      } else {
         setMappedInstallments(mapInstallments(installments, ''))
      }
   }, [installments])

   useEffect(() => {
      determineSelectedInstallment()
   }, [mappedInstallments])

   useEffect(() => {
      validateInstallmentButtons()
      onSelectedInstallment(selectedInstallment)
   }, [selectedInstallment])

   useEffect(() => {
      onInstallmentError(onInstallmentFailed)
   }, [onInstallmentFailed])

   const determineSelectedInstallment = () => {
      const selectedItems = mappedInstallments.filter((item) => {
         if (item.isSelected) {
            return item
         }
      })

      if (selectedItems.length === 0) {
         setSelectedInstallment(null)
         return
      }

      setSelectedInstallment(getInstallment(selectedItems[0]._id))
   }

   const getInstallment = (_id) => {
      return installments.filter((obj) => obj._id === _id)[0]
   }

   const validateInstallmentButtons = () => {
      validatePayButton()
   }

   const validatePayButton = () => {
      if (!selectedInstallment || !initialOrder) {
         setPayButtonState(false)
         return
      }

      if (selectedInstallment.status === 'paid' || initialOrder.status === 'pending_approval' || initialOrder.status === 'rejected' || initialOrder.status === 'completed' || initialOrder.status === 'cancelled') {
         setPayButtonState(false)
         return
      }

      setPayButtonState(true)
   }

   return (
      <>
         {initialOrder && (
            <>
               <GridView
                  gridTitle={'Installments'}
                  className='purchase__view-order-list '
                  items={mappedInstallments}
                  setItems={setMappedInstallments}
                  gap={'1px'}
                  selectionMode={'single'}  // none, single, multiple.
               />

               {installments.length > 0 && (
                  <div className="purchase_view__button-container">
                     <SimpleButton
                        style='primary'
                        title='Pay'
                        onClick={onPayemntDidClicked}
                        disabled={!payButtonState}
                     />
                  </div>
               )}

            </>
         )}
      </ >
   )
}