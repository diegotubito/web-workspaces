import './TotalAmount.css'
import { formatCurrency, convertCurrencyStringToNumber } from '../../Utils/Common/formatCurrency'
import { useEffect } from 'react'

export const TotalAmount = ({ title, total}) => {
   
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