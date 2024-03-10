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
   const [selectedPurchaseItem, setSelectedPurchaseItem] = useState("");
   const [amount, setAmount] = useState(0)
      
   const [items, setItems] = useState([]);
 
   useEffect(() => {
      setItems([])
      createNewItem()
   }, [selectedPurchaseItem])

   useEffect(() => {
      getPurchaseItems();
      setAmount(15)
   }, []);

   useEffect(() => {
      
   }, [items])

   useEffect(() => {
      if (purchaseItems.length > 0) {
         setSelectedPurchaseItem(purchaseItems[1]._id)
      }
   }, [purchaseItems])

   const handleChange = (event) => {
      const itemId = event.target.value;
      setSelectedPurchaseItem(itemId);
   };

   const onNewItemDidPressed = () => {
      createNewItem()
   }

   const createNewItem = () => {
      const obj = purchaseItems.find(item => item._id === selectedPurchaseItem);
      if (!obj) { return }
      console.log(obj.itemType)
      
      if (obj.itemType === 'BE_ITEMTYPE_PHSYSICAL') {
         createProductItem()         
      } else if (obj.itemType === 'BE_ITEMTYPE_SERVICE') {
         createServiceItem()
      }
   }

   const createProductItem = () => {
      const emptyInputField = createEmptyProduct()
      setItems((currentItems) => {
         return [...currentItems, emptyInputField]
      })
   }

   const createServiceItem = () => {
      const emptyInputField = createEmptyService()
      setItems((currentItems) => {
         return [...currentItems, emptyInputField]
      })
   }

   const createEmptyProduct = () => {
      return {
         _id: Date.now().toString() + 'a', // Ensuring _id is a string
         title: '',
         footer: '',
         removeIsAllowed: true,
         fields: [{
            _id: Date.now().toString() + 'b', // Ensuring _id is a string

            type: 'selector',
            selectorItems: [{ _id: Date.now().toString() + 'f', title: 'uno' },
                            { _id: Date.now().toString() + 'g', title: 'dos' }],
            minWidth: '20rem',
            maxWidth: '2fr',
            value: '',
            errorMessage: '',
            isEnabled: true,
            placeholder: ''
         },
         {
            _id: Date.now().toString() + 'd', // Ensuring _id is a string
            type: 'text',
            minWidth: '3rem',
            maxWidth: '0.3fr',
            value: '',
            errorMessage: '',
            isEnabled: true,
            placeholder: ''
            },
            {
               _id: Date.now().toString() + 'e', // Ensuring _id is a string
               type: 'currency',
               minWidth: '10rem',
               maxWidth: '0.5fr',
               value: '',
               errorMessage: '',
               isEnabled: true,
               placeholder: '$ 0.00'
            },
            {
               _id: Date.now().toString() + 'f', // Ensuring _id is a string
               type: 'currency',
               minWidth: '10rem',
               maxWidth: '0.5fr',
               value: '',
               errorMessage: '',
               isEnabled: false,
               placeholder: '$ 0.00'
            }]
      }
   }

   const createEmptyService = () => {
      return {
         _id: Date.now().toString() + 'a', // Ensuring _id is a string
         title: '',
         footer: '',
         removeIsAllowed: true,
         fields: [{
            _id: Date.now().toString() + 'b', // Ensuring _id is a string

            type: 'text',
            minWidth: '20rem',
            maxWidth: '2fr',
            value: '',
            errorMessage: '',
            isEnabled: true,
            placeholder: 'Description'
         },
         {
            _id: Date.now().toString() + 'd', // Ensuring _id is a string
            type: 'text',
            minWidth: '3rem',
            maxWidth: '0.3fr',
            value: '',
            errorMessage: '',
            isEnabled: true,
            placeholder: ''
         },
         {
            _id: Date.now().toString() + 'e', // Ensuring _id is a string
            type: 'currency',
            minWidth: '10rem',
            maxWidth: '0.5fr',
            value: '',
            errorMessage: '',
            isEnabled: true,
            placeholder: '$ 0.00'
         },
         {
            _id: Date.now().toString() + 'f', // Ensuring _id is a string
            type: 'currency',
            minWidth: '10rem',
            maxWidth: '0.5fr',
            value: '',
            errorMessage: '',
            isEnabled: false,
            placeholder: '$ 0.00'
         }]
      }
   }

   return (
      <div className='purchase_view__main'>
         <h1>Purchase View</h1>

         <div>
            <h3 className='purchase_view__form-title'>Elije el artículo de compra.</h3>
            <select className="form-select" value={selectedPurchaseItem} onChange={handleChange}>

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

      </div >
   )
}