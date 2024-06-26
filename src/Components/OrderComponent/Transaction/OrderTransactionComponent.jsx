import { useEffect, useState } from 'react'
import { GridView } from '../../GridView/GridView';
import { useTranslation } from 'react-i18next';

import { SimpleButton } from '../../Buttons/SimpleButton/SimpleButton'
import { useTransactionViewModel } from '../../../Hooks/Transaction/useTransactionViewModel'
import { usePaymentsMapping } from '../../../Pages/Purchase/usePaymentsMapping'

export const OrderTransactionComponent = ({ initialInstallment, onSelectedTransaction, onTransactionError, onTransactionChange, setIsLoading }) => {
   const { t } = useTranslation()

   const { getPayments, payments, removePayment, getPaymentsByInstallment, onTransactionSuccess, onTransactionFailed, isLoading } = useTransactionViewModel()
   const { mapTransactions } = usePaymentsMapping()
   const [mappedTransactions, setMappedTransactions] = useState([])
   const [selectedPayment, setSelectedPayment] = useState()

   const [removePaymentButtonState, setRemovePaymentButtonState] = useState(false)

   useEffect(() => {
      setIsLoading(isLoading)
   }, [isLoading, setIsLoading])

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

   useEffect(() => {
      if (onTransactionSuccess) {
         //getPaymentsByInstallment(initialInstallment._id)
         onTransactionChange()
      }
   }, [onTransactionSuccess])

   useEffect(() => {
      onTransactionError(onTransactionFailed)
   }, [onTransactionFailed])


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
                     <h3> No hay pagos realizado.</h3> : null
               } 

            </>
         )}

      </ >
   )
}