import './AddSaleItem.css'
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next';
import { SimpleButton } from '../Buttons/SimpleButton/SimpleButton';
import { formatCurrency } from '../../Utils/Common/formatCurrency';
import { useSalePriceListViewModel } from '../../Hooks/SalePriceList/useSalePriceListViewModel';
import { useItemViewModel } from '../../Hooks/Item/useItemViewModel';
import { useDiscountPerItemViewModel } from '../../Hooks/DiscountPerItem/useDiscountPerItemViewModel';
import { DiscountSelection } from './DiscountSelection/DiscountSelection';
import { ItemSelection } from './ItemSelection/ItemSelection';
import { PriceListSelection } from './PriceListSelection/PriceListSelection';
import { PriceInput } from './PriceInput/PriceInput';
import { QuantityInput } from './QuantityInput/QuantityInput';
import { TextInput } from './TextInput/TextInput';

export const AddSaleItem = ({ title, selectedStakeholderType, selectedStakeholder }) => {
   const { t } = useTranslation()

   const settings = {
      padding: '0.5rem 0.5rem',
      inputBorderColorEnabled: 'rgb(200, 200, 200)',
      inputBorderColorDisabled: 'rgb(240, 240, 240)',
      borderRadius: '4px'
   }

   const [orderItems, setOrderItems] = useState([])
   const [selectedSalePriceList, setSelectedSalePriceList] = useState()
   const [total, setTotal] = useState(0)

   const {
      fetchSalePricesByWorkspace,
      salePrices,
      setSalePrices
   } = useSalePriceListViewModel()

   const {
      fetchDiscountsPerItemByWorkspace,
      discountsPerItem,
      setDiscountsPerItem
   } = useDiscountPerItemViewModel()

   const {
      fetchItemsByWorkspaceAndStakeholder,
      fetchSaleItemsByWorkspace,
      items: saleItems,
      setItems,
      saleItemsIsLoading,
      onGetSaleFailed,
      setOnGetSaleFailed
   } = useItemViewModel()

   useEffect(() => {
      fetchSalePricesByWorkspace()
      fetchDiscountsPerItemByWorkspace()
      fetchSaleItemsByWorkspace(true)
   }, [])

   useEffect(() => {
      if (!selectedStakeholder) {
         setOrderItems([])
      }
   }, [selectedStakeholder])

   // Autoselect First List Price
   useEffect(() => {
      if (salePrices.length > 0) {
         setSelectedSalePriceList(salePrices[0]._id)
      }
   }, [salePrices])

   const onNewItemDidPressed = () => {
      const priceList = salePrices.find((salePrice) => salePrice._id === selectedSalePriceList)
      const saleItem = saleItems.find((saleItem) => saleItem._id === saleItems[0]._id)
      const discountPerItem = ""

      if (!priceList || !saleItem) {
         return
      }

      const discount = discountPerItem ? discountPerItem.rate : 1
      const quantity = 1
      const note = ''

      const newItem = {
         id: Math.random().toString(36), // Ensure a unique id for each new item
         saleItemId: saleItem._id,  // Use saleItemId for comparison
         discountPerItemId: "", // Store the discountPerItemId or null
         saleItem: saleItem.title,
         price: saleItem.salePrice,
         discount: discount,
         priceListRate: priceList.rate,
         note: note,
         quantity: quantity,
         total: priceList.rate * discount * quantity * saleItem.salePrice
      }

      const clones = [...orderItems, newItem]
      setOrderItems(clones)
   }

   const updateOrderItemsWithPriceList = () => {
      const priceList = salePrices.find((salePrice) => salePrice._id === selectedSalePriceList)

      if (!priceList) {
         return
      }

      const updatedOrders = orderItems.map((o) => {
         const saleItem = saleItems.find((s) => s._id === o.saleItemId)
         const discountPerItem = discountsPerItem.find((d) => d._id === o.discountPerItemId)
         const discount = discountPerItem ? discountPerItem.rate : o.discount || 1
         const quantity = o.quantity || 1
         if (saleItem) {
            return {
               ...o,
               price: saleItem.salePrice,
               priceListRate: priceList.rate,
               discount: discount,
               total: priceList.rate * discount * quantity * saleItem.salePrice
            }
         }
         return o
      })
      setOrderItems(updatedOrders)
   }

   useEffect(() => {
      console.log(orderItems)
      updateTotal()
   }, [orderItems])

   useEffect(() => {
      updateOrderItemsWithPriceList()
   }, [selectedSalePriceList]) // Ensure to add selectedDiscountPerItem as dependency

   const updateTotal = () => {
      let result = 0
      orderItems.forEach((orderItem) => {
         result += orderItem.total
      })
      setTotal(result)
   }

   const handleOnChangePriceList = (priceListObject) => {
      setSelectedSalePriceList(priceListObject._id);
   };

   const handleSelectedDiscountPerItem = (discountObject, index) => {
      const discount = discountObject ? discountObject.rate : 1
      const discountId = discountObject ? discountObject._id : "" // selected none


      const updatedOrders = orderItems.map((o, i) => {
         if (i === index) {
            const priceList = salePrices.find((salePrice) => salePrice._id === selectedSalePriceList)
            const saleItem = saleItems.find((s) => s._id === o.saleItemId)
            if (!priceList || !saleItem) return o;

            const quantity = o.quantity || 1
            return {
               ...o,
               discountPerItemId: discountId, // Update the discountPerItemId
               discount: discount,
               total: priceList.rate * discount * quantity * o.price
            }
         }
         return o
      })
      setOrderItems(updatedOrders)
   }

   const handleSelectedSaleItem = (saleItemObject, index) => {

      const priceList = salePrices.find((salePrice) => salePrice._id === selectedSalePriceList)
      const updatedOrders = orderItems.map((o, i) => {
         if (i === index) {
            const discount = 1
            const quantity = 1
            const note = ""
            return {
               ...o,
               saleItemId: saleItemObject._id,
               discountPerItemId: "", // Reset discount to "None"
               saleItem: saleItemObject.title,
               price: saleItemObject.salePrice,
               discount: discount,
               priceListRate: priceList.rate,
               note: note,
               quantity: quantity,
               total: priceList.rate * discount * quantity * saleItemObject.salePrice
            }
         }
         return o
      })
      setOrderItems(updatedOrders)
   }

   if (!selectedStakeholder) {
      return
   }

   const onInputPriceChanged = (value, index) => {
      const priceList = salePrices.find((salePrice) => salePrice._id === selectedSalePriceList)
      const updatedOrders = orderItems.map((o, i) => {
         if (i === index) {
            const quantity = o.quantity || 1
            return {
               ...o,
               price: value, // Update the discountPerItemId
               total: priceList.rate * o.discount * o.quantity * value
            }
         }
         return o
      })
      setOrderItems(updatedOrders)
   }


   const onQuantityChanged = (value, index) => {
      const priceList = salePrices.find((salePrice) => salePrice._id === selectedSalePriceList)
      const updatedOrders = orderItems.map((o, i) => {
         if (i === index) {
            const quantity = value || 1
            return {
               ...o,
               quantity: quantity,
               total: priceList.rate * o.discount * quantity * o.price
            }
         }
         return o
      })
      setOrderItems(updatedOrders)
   }


   const onTextInputChanged = (value, index) => {
      console.log(value, index)
      const updatedOrders = orderItems.map((o, i) => {
         if (i === index) {
            return {
               ...o,
               note: value || ''
            }
         }
         return o
      })
      setOrderItems(updatedOrders)
   }

   return (
      <div className='add_sale_item__main'>
         {/* Title */}
         <div className='add_sale_item__space-between'>
            <div>
               {title &&
                  <h1 className='add_sale_item__title'>{title}</h1>
               }
               <div className='add_sale_item__add--button'>
                  <SimpleButton
                     title={t('PURCHASE_ORDER_CRUD_VIEW_ADD_NEW_ITEM_TITLE')}
                     style='primary'
                     onClick={() => onNewItemDidPressed()}
                     disabled={!saleItems.length > 0 || !selectedStakeholder}
                  />
               </div>
            </div>

            <PriceListSelection
               selectedSalePriceList={selectedSalePriceList}
               salePrices={salePrices}
               onSelectedPriceList={handleOnChangePriceList}
            />

         </div>

         <div className='add_sale_item__container'>


<div>

               <div
                  style={{
                     display: 'grid',
                     background: 'gray',
                     padding: '0.5rem 0rem',
                     marginBottom: '0.5rem',
                     borderRadius: '0px',
                     gridTemplateColumns: '1fr 0.7fr 0.3fr 0.7fr 0.3fr 1fr 0.1fr 0.7fr',
                     alignItems: 'baseline',
                     gap: '0.5rem',
                     width: '100%',
                     color: 'white'
                  }}
               >
                  <div>Item</div>
                  <div>List Price</div>
                  <div>Rate</div>
                  <div>Discount</div>
                  <div>Rate</div>
                  <div>Note</div>
                  <div>Qty</div>
                  <div>Total Amount</div>
               </div>




               <form>
                  {orderItems.map((orderItem, index) => (
                     <div
                        key={orderItem.id} // Use a unique key for each item
                        style={{
                           display: 'grid',
                           gridTemplateColumns: '1fr 0.7fr 0.3fr 0.7fr 0.3fr 1fr 0.1fr 0.7fr',
                           alignItems: 'baseline',
                           gap: '0.5rem',
                           width: '100%',
                           marginBottom: '0.5rem'
                        }}
                     >
                        <ItemSelection
                           isEnabled={true}
                           settings={settings}
                           index={index}
                           orderItem={orderItem}
                           items={saleItems}
                           onSelectedItem={handleSelectedSaleItem}
                        />


                        <PriceInput
                           settings={settings}
                           isEnabled={true}
                           maxLength={15}
                           textAlign={'end'}
                           initialValue={orderItem.price}
                           onInputChanged={onInputPriceChanged}
                           index={index}
                        />

                        <TextInput
                           settings={settings}
                           isEnabled={false}
                           placeholder={''}
                           maxLength={3}
                           textAlign={'center'}
                           initialValue={orderItem.priceListRate}
                           index={index}
                        />

                        <DiscountSelection
                           settings={settings}
                           isEnabled={true}
                           index={index}
                           orderItem={orderItem}
                           discounts={discountsPerItem.filter((d) => d.items.includes(orderItem.saleItemId)).filter((d) => d.stakeholderTypes.includes(selectedStakeholder.stakeholderType))}
                           selectedDiscountPerItem={handleSelectedDiscountPerItem}
                        />

                        <TextInput
                           isEnabled={false}
                           settings={settings}
                           placeholder={''}
                           maxLength={3}
                           textAlign={'center'}
                           initialValue={orderItem.discount}
                           index={index}
                        />

                        <TextInput
                           isEnabled={true}
                           settings={settings}
                           placeholder={'Note'}
                           maxLength={120}
                           textAlign={'start'}
                           initialValue={orderItem.note}
                           onInputChanged={onTextInputChanged}
                           index={index}
                        />

                        <QuantityInput
                           isEnabled={true}
                           settings={settings}
                           placeholder={orderItem.quantity}
                           maxLength={2}
                           textAlign={'center'}
                           initialValue={orderItem.quantity}
                           onInputChanged={onQuantityChanged}
                           index={index}
                        />

                        <PriceInput
                           settings={settings}
                           isEnabled={false}
                           maxLength={15}
                           textAlign={'end'}
                           initialValue={orderItem.total}
                           onInputChanged={onInputPriceChanged}
                           index={index}
                        />
                     </div>
                  ))}
               </form>


</div>
         </div>

         <div className='add_sale_item__total-amount-main'>
            <h2 className='add_sale_item__title'> {'Partial Amount'}</h2>
            <h3 className='add_sale_item__total-amount '>{formatCurrency(total.toFixed(2).toString())}</h3>
         </div>
      </div>
   )
}
