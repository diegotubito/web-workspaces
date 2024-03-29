import './PaymentView.css'

export const PaymentView = ({ isOpen, setIsOpen }) => {
   return (!isOpen) ? null : (
      <div className='purchase_crud_view__main'>
         <div className='purchase_crud_view__container'>
            <h1 className='purchase_crud_view__title'>Purchase View</h1>

            
         </div>
      </div>
   )
}