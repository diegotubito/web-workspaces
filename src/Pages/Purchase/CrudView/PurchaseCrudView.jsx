import './PuchaseCrudView.css'

export const PurchaseCrudView = ({isOpen}) => {
   if (!isOpen) { return null }
   
   return (
      <div className='purchase_crud_view__main'>
         <div className='purchase_crud_view__container'>
            <h1>Create new order...</h1>
         </div>
      </div>
   )
}