import { useEffect, useState } from 'react'
import { GridView } from '../../../Components/GridView/GridView';
import { useTranslation } from 'react-i18next';

import { SimpleButton } from '../../../Components/Buttons/SimpleButton/SimpleButton'
import { useTransactionViewModel } from '../../../Hooks/Transaction/useTransactionViewModel'
import { usePaymentsMapping } from '../usePaymentsMapping'

export const PurchaseOrderTransactionComponent = ({ initialInstallment, onSelectedTransaction, onTransactionError }) => {
   const { t } = useTranslation()

   const { getPayments, payments, removePayment, getPaymentsByInstallment, onTransactionSuccess } = useTransactionViewModel()
   const { mapTransactions } = usePaymentsMapping()
   const [mappedTransactions, setMappedTransactions] = useState([])
   const [selectedPayment, setSelectedPayment] = useState()

   const [removePaymentButtonState, setRemovePaymentButtonState] = useState(false)

   // PAYMENTS
   useEffect(() => {
      setMappedTransactions([])
      if (initialInstallment) {
         getPaymentsByInstallment(initialInstallment._id)
      }
   }, [initialInstallment])

   useEffect(() => {
      setMappedTransactions(mapTransactions(payments))
   }, [payments])

   useEffect(() => {
      determineSelectedPayment()
   }, [mappedTransactions])

   useEffect(() => {
      validateRemovePaymentButton()
      onSelectedTransaction(selectedPayment)
   }, [selectedPayment])

   const getPayment = (_id) => {
      return payments.filter((obj) => obj._id === _id)[0]
   }

   const determineSelectedPayment = () => {
      const selectedItems = mappedTransactions.filter((item) => {
         if (item.isSelected) {
            return item
         }
      })

      if (selectedItems.length === 0) {
         setSelectedPayment(null)
         return
      }

      setSelectedPayment(getPayment(selectedItems[0]._id))
   }

   const validateRemovePaymentButton = () => {
      if (!selectedPayment) {
         setRemovePaymentButtonState(false)
         return
      }

      if (selectedPayment.isEnabled) {
         setRemovePaymentButtonState(true)
         return
      }

      setRemovePaymentButtonState(false)
   }

   const onRemovePaymentDidClicked = () => {
      if (selectedPayment) {
         removePayment(selectedPayment._id)
      }
   }

   return (
      <>
         {initialInstallment && (
            <>
               <GridView
                  gridTitle={'Payments'}
                  className='purchase__view-order-list '
                  items={mappedTransactions}
                  setItems={setMappedTransactions}
                  gap={'1px'}
                  selectionMode={'single'}  // none, single, multiple.
               />

               {payments.length === 0 ?
                  (
                     <h3> No hay pagos realizado.</h3>
                  ) : (
                     <div className="purchase_view__button-container">
                        <SimpleButton
                           style='destructive'
                           title='Remove'
                           onClick={onRemovePaymentDidClicked}
                           disabled={!removePaymentButtonState}
                        />
                     </div>
                  )}

            </>
         )}

      </ >
   )
}