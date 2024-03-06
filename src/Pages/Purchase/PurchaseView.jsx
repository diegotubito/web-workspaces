import { useEffect, useState } from 'react'
import './PurchaseView.css'
import { usePurchaseViewModel } from './usePurchaseViewModel'
import { TextInputView } from '../../Components/InputViews/TextInputView'
import { useTranslation } from 'react-i18next';

export const PurchaseView = () => {
   const { t } = useTranslation()
   const { getItems, items } = usePurchaseViewModel()
   const [selectedItem, setSelectedItem] = useState("");
   const [amountForm, setAmountForm] = useState({
      name: 'amount_input',
      value: '0',
      errorMessage: '',
      type: 'currency',
      autocomplete: 'off',
      maxLength: 12
   })

   const handleChange = (event) => {
      const itemId = event.target.value;
      const obj = items.find(item => item._id === itemId);
      setSelectedItem(itemId);
      console.log(obj.title);
   };

   useEffect(() => {
      getItems()
   }, [])

   const onInputChange = (name, newValue) => {
      switch (name) {
         case 'amount_input':
            break
         default:
            console.log(`Sorry, we are out of scope`);

      }
   }

   const onDidBeginInput = (name, begin) => {
      if (!begin) {

         switch (name) {
            case 'amount_input':
               validateAmount()
               break
            default:
               console.log(`Sorry, we are out of scope`);

         }
      } else {
         // did begin
         switch (name) {
            case 'amount_input':
               setAmountForm({ ...amountForm, errorMessage: null })
               break
            default:
               console.log(`Sorry, we are out of scope`);
         }
      }
   }

   const onReturnPressed = (name) => {
   }

   const validateAmount = () => {
      if (!amountForm.value) {
         setAmountForm({ ...amountForm, errorMessage: t('LOGIN_MISSING_USERNAME') })
         return false
      }

      setAmountForm({ ...amountForm, errorMessage: null })
      return true
   }

   const groupValidation = () => {
      const emailValidation = validateAmount()

      return emailValidation
   }


   return (
      <div className='purchase_view__main'>
         <h1>Purchase View</h1>
        
         <div>
            <h3 className='purchase_view__form-title'>Elije el artículo de compra.</h3>
            <select className="form-select" value={selectedItem} onChange={handleChange}>

               { items.map( (item) => {
                  return (
                     <option key={item._id} value={item._id}>{item.title}, {item.description}.</option>
                  )
               }
               )}
            </select>
         </div>

         <div className='purchase_view__amount-textfield'>
            <TextInputView
               title={t('Amount')}
               placeholder={''}
               onInputChange={onInputChange}
               onDidBegin={onDidBeginInput}
               onReturnPressed={onReturnPressed}
               form={amountForm}
               setForm={setAmountForm}
            />
         </div>


      </div >
   )
}