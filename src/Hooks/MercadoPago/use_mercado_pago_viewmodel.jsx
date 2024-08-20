import { useMercadoPagoRepository } from "./use_mercado_pago_repository";
import { useWorkspaceSession } from "../../Utils/Contexts/workspaceSessionContext";
import { useUserSession } from "../../Utils/Contexts/userSessionContext";
import { useState } from "react";

export const useMercadoPagoViewModel = () => {
   const { createPaymentRepository } = useMercadoPagoRepository()
   const { workspaceSession } = useWorkspaceSession()
   const { userSession } = useUserSession()

   const [onError, setOnError] = useState(null)

   const createPayment = async (entityModel, amount, installment, accountId, balanceId, description, exchangeRate, selectedPaymentMethodId) => {
      try {

         if (Number(exchangeRate * amount) > (installment?.remainingAmount ?? 0)) {
            setOnError({
               title: 'Validation Error',
               message: 'Amount exceeds remaining amount'
            })
            return
         }

         if (!balanceId) {
            setOnError({
               title: 'Validation Error',
               message: 'You need to espicify a balance'
            })
            return
         }

         console.log(installment.paymentMethod._id, selectedPaymentMethodId)
         if (installment.paymentMethod._id !== selectedPaymentMethodId) {
             setOnError({
               title: 'Validation Error',
               message: 'Payment method should match with order payment method.'
            })

            return
         }


         const externalReference = {
            workspaceId: workspaceSession._id,
            userId: userSession.user._id,
            type: installment.type,
            orderId: installment.order._id,
            entityModel: entityModel,
            paymentMethodId: selectedPaymentMethodId,
            accountId: accountId,
            balanceId: balanceId,
            installmentId: installment._id,
            exchangeRate: exchangeRate,
            stakeholderId: installment.stakeholder,
            currencyId: installment.currency._id
         }
         
         const body = {
            workspaceId: workspaceSession._id,
            title: description,
            unit_price: amount,
            quantity: 1,
            email: 'payer@email.com',
            applicationFee: amount * 0.05,
            terminalId: '',
            externalReference
         }

         const response = await createPaymentRepository(body)
         setOnError(null)
         console.log(body)
         /*
         respose model
         {
    "preferenceId": "1645285786-e7a3db8c-9117-4f16-80c9-8a29f55c5bde",
    "initPoint": "https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=1645285786-e7a3db8c-9117-4f16-80c9-8a29f55c5bde",
    "sandboxInitPoint": "https://sandbox.mercadopago.com.ar/checkout/v1/redirect?pref_id=1645285786-e7a3db8c-9117-4f16-80c9-8a29f55c5bde"
}
         */
      } catch (error) {

         console.error('Error:', error.title, error.message);
         setOnError({
            title: error.title || "Error",
            message: error.message || "An unexpected error occurred",
            action: 'none',
            setError: setOnError
         })
      } 
   }

   return { createPayment, onError, setOnError }
}