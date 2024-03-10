import { useEffect, useState } from 'react'
import './PurchaseView.css'
import { usePurchaseViewModel } from './usePurchaseViewModel'
import { useTranslation } from 'react-i18next';
import { AmountField } from '../../Components/AmountField/AmountField';
import { BoxItem } from '../../Components/BoxItem/BoxItem';
import { ObjectViewer } from '../../Components/ObjectViewer/ObjectViewer';
import { Button } from 'react-bootstrap';
import { InputFieldColumn } from '../../Components/InputFieldColumn/InputFieldColumn';

export const PurchaseView = () => {
   const { t } = useTranslation()
   const { getPurchaseItems, purchaseItems } = usePurchaseViewModel()
   const [selectedItem, setSelectedItem] = useState("");
   const [amount, setAmount] = useState(0)
      
   const [items, setItems] = useState([]);

   const handleChange = (event) => {
      const itemId = event.target.value;
      const obj = purchaseItems.find(item => item._id === itemId);
      setSelectedItem(itemId);
   };

   useEffect(() => {
      getPurchaseItems();
      setAmount(15)
   }, []);

   useEffect(() => {
      console.log(items)
   }, [items])

   /*
   const onAmountDidChanged = (value) => {
     
   }

   const onBoxItemDidChanged = (items) => {
      let total = 0
      items.map((item) => {
         total += item.subTotal
      })
      setAmount(total)
   }
   */

   const onNewItemDidPressed = () => {
      const emptyInputField = createEmptyInputFieldItem()

      setItems((currentItems) => {
         return [...currentItems, emptyInputField]
      })
   }

   const createEmptyInputFieldItem = () => {
      return {
         _id: Date.now().toString() + 'a', // Ensuring _id is a string
         title: '',
         footer: '',
         fields: [{
            _id: Date.now().toString() + 'b', // Ensuring _id is a string

            type: 'selector',
            selectorItems: [{ _id: Date.now().toString() + 'f', title: 'uno' },
                            { _id: Date.now().toString() + 'g', title: 'dos' }],
            minWidth: '30rem',
            maxWidth: '2fr',
            selectedValue: 1
         },
         {
            _id: Date.now().toString() + 'c', // Ensuring _id is a string
            type: 'text',
            minWidth: '10rem',
            maxWidth: '2fr',
            value: 'some value'
         },
         {
            _id: Date.now().toString() + 'd', // Ensuring _id is a string
            type: 'text',
            minWidth: '3rem',
            maxWidth: '0.3fr',
            value: 'some value'
         },
         {
            _id: Date.now().toString() + 'e', // Ensuring _id is a string
            type: 'text',
            minWidth: '10rem',
            maxWidth: '0.5fr',
            value: 'some value'
         }]
      }
   }

 
   return (
      <div className='purchase_view__main'>
         <h1>Purchase View</h1>

         <div>
            <h3 className='purchase_view__form-title'>Elije el artículo de compra.</h3>
            <select className="form-select" value={selectedItem} onChange={handleChange}>

               {purchaseItems.map((item) => {
                  return (
                     <option key={item._id} value={item._id}>{item.title}, {item.description}.</option>
                  )
               }
               )}
            </select>
         </div>

         <Button size='sm' className='box_item__newButton' onClick={() => onNewItemDidPressed()}>+</Button>

         <InputFieldColumn
            items={items}
            setItems={setItems}
         />



         {/* <BoxItem
            initValues={[
               {
                  _id: Date.now().toString(), // Ensuring _id is a string
                  description: '',
                  quantity: 1,
                  price: 0,
                  subTotal: 0,
                  descriptionErrorMessage: '',
                  quantityErrorMessage: '',
                  priceErrorMessage: '',
               }
            ]}
            onBoxItemDidChanged={onBoxItemDidChanged}
         />

         <AmountField amount={amount} onAmountDidChanged={onAmountDidChanged} />

         <ObjectViewer className='purchase_view__object_viewer'/> */}

      </div >
   )
}