import './CashCountComponent.css'
import { useTranslation } from 'react-i18next';
import { dateAndTimeFormat } from '../../../Utils/Common/dateUtils';
import { formatCurrency } from '../../../Utils/Common/formatCurrency';
import { SimpleButton } from '../../Buttons/SimpleButton/SimpleButton';

export const CashCountComponent = ({cashCount, onCloseCashCount}) => {
   const { t } = useTranslation()
   
   const handleSubmit = () => {
      onCloseCashCount(cashCount)
   };

   return (
      <div key={cashCount._id} className='cash_count_component__item' style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

         <div>
            <div style={{
               display: 'flex',
               justifyContent: 'space-between'
            }}>
               <h3>{`${dateAndTimeFormat(cashCount.date)}`}</h3>
               <h3>{`${t(cashCount.status)}`}</h3>
            </div>

            {cashCount.closingDate && <h6>{`${dateAndTimeFormat(cashCount.closingDate)}`}</h6>}

         </div>


         <div>

            <div className='cash_count_component__balances cash_count_component__header-titles'>
               <h5>Balance</h5>
               <h5>System</h5>
               <h5>Counted</h5>
               <h5>Difference</h5>
            </div>

            {cashCount.balances.map((balanceCounted) => (

               <div key={balanceCounted._id} className='cash_count_component__balances'>
                  <h4>{`${balanceCounted.balance.displayName}`}</h4>
                  <h4>{`${formatCurrency(balanceCounted.balanceSnapshot.amount.toFixed(2).toString())}`}</h4>
                  <h4>{`${formatCurrency(balanceCounted.countedAmount.toFixed(2).toString())}`}</h4>
                  <h4>{`${formatCurrency(balanceCounted.discrepancies.toFixed(2).toString())}`}</h4>
               </div>
            ))}
         </div>


         <div style={{
            display: 'flex',
            justifyContent: 'flex-end'
         }}>
            <h4>{`Result: ${t(cashCount.globalResult)} ${formatCurrency(cashCount.totalDiscrepancies.toFixed(2).toString())}`}</h4>

         </div>

         <h5>{`Responsible ${cashCount.user.lastName} ${cashCount.user.firstName}`}</h5>

         {cashCount.status !== 'CASH_COUNT_STATUS_CLOSED' && <SimpleButton
            title={t('Close Cash Count')}
            style='destructive'
            onClick={handleSubmit}
         />}
      </div>
   )
}