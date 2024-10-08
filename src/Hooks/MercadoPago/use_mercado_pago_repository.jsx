import { useApiCall } from "../../Utils/ApiNetwork/apiCall"

export const useMercadoPagoRepository = () => {
   const { apiCall, error, isLoading } = useApiCall()

   const createPaymentRepository = (body) => {
      return apiCall({
         path: `/api/v1/mercadopago/payments`,
         method: 'POST',
         body: body,
         isLogin: false
      })
   }

   const createMercadoPagoSuscriptionRepo = (body) => {
      return apiCall({
         path: `/api/v1/mercadopago/subscription/preapproval-internal`,
         method: 'POST',
         body: body,
         isLogin: false
      })
   }

   return { createPaymentRepository, createMercadoPagoSuscriptionRepo }
}