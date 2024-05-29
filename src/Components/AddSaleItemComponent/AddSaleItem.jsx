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

export const AddSaleItem = ({ title, selectedStakeholderType, selectedStakeholder }) => {
   const { t } = useTranslation()

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

      const newItem = {
         id: Math.random().toString(36), // Ensure a unique id for each new item
         saleItemId: saleItem._id,  // Use saleItemId for comparison
         discountPerItemId: "", // Store the discountPerItemId or null
         saleItem: saleItem.title,
         price: saleItem.salePrice,
         discount: discount,
         priceListRate: priceList.rate,
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

   const handleOnChange = (event) => {
      const item = event.target.value;
      setSelectedSalePriceList(item);
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
               total: priceList.rate * discount * quantity * saleItem.salePrice
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
            return {
               ...o,
               saleItemId: saleItemObject._id,
               discountPerItemId: "", // Reset discount to "None"
               saleItem: saleItemObject.title,
               price: saleItemObject.salePrice,
               discount: discount,
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
            <div>
               <h1 className='add_sale_item__title'>{'Price List'}</h1>
               <select className="add_sale_item__price-list-selector" value={selectedSalePriceList} onChange={handleOnChange}>
                  {salePrices.map((item) => (
                     <option
                        key={item._id}
                        value={item._id}>{t(item.name)}
                     </option>
                  ))}
               </select>
            </div>
         </div>

         <div className='add_sale_item__container'>
            {orderItems.map((orderItem, index) => (
               <div
                  key={orderItem.id} // Use a unique key for each item
                  style={{
                     display: 'grid',
                     gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr',
                     alignItems: 'baseline',
                     gap: '5px',
                     width: '100%'
                  }}
               >

                  <ItemSelection
                     index={index}
                     orderItem={orderItem}
                     items={saleItems}
                     onSelectedItem={handleSelectedSaleItem}
                  />

                  <DiscountSelection
                     index={index}
                     orderItem={orderItem}
                     discounts={discountsPerItem.filter((d) => d.items.includes(orderItem.saleItemId)).filter((d) => d.stakeholderTypes.includes(selectedStakeholder.stakeholderType)) }
                     selectedDiscountPerItem={handleSelectedDiscountPerItem}
                  />



                  <div>{orderItem.discount}</div>
                  <div>{orderItem.price}</div>
                  <div>{orderItem.priceListRate}</div>
                  <div>{orderItem.quantity}</div>
                  <div>{orderItem.total}</div>
               </div>
            ))}
         </div>

         <div className='add_sale_item__total-amount-main'>
            <h2 className='add_sale_item__title'> {'Partial Amount'}</h2>
            <h3 className='add_sale_item__total-amount '>{formatCurrency(total.toFixed(2).toString())}</h3>
         </div>
      </div>
   )
}
