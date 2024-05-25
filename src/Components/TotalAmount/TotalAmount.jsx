import './TotalAmount.css'
import { formatCurrency, convertCurrencyStringToNumber } from '../../Utils/Common/formatCurrency'
import { useEffect } from 'react'

export const TotalAmount = ({ title, items, total, setTotal }) => {
   useEffect(() => {
      updateTotalAmount()
   }, [items])

   const updateTotalAmount = () => {
      let result = 0
      let shouldUpdate = false
      items.forEach((item) => {
         item.fields.forEach((field) => {
            if (field.name === 'total') {
               const value = convertCurrencyStringToNumber(field.value).toFixed(2)
               const parsedValue = parseFloat(value) || 0
               result += parsedValue
               shouldUpdate = true
            }
         })
      })

      if (shouldUpdate) {
         setTotal(result)
      }
   }

   return (
      <div className='custom_component__total-amount-main'>
         <p style={{
            fontSize: '19px',
            fontWeight: 'bold',
            margin: '0'
         }}>{title}</p>
         <h3 className='custom_component__total-amount'>{formatCurrency(total.toFixed(2).toString())}</h3>
      </div>
   )
}