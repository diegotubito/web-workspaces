import './AddSaleItem.css'
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next';
import { SimpleButton } from '../Buttons/SimpleButton/SimpleButton';
import { formatCurrency } from '../../Utils/Common/formatCurrency';
import { useSalePriceListViewModel } from '../../Hooks/SalePriceList/useSalePriceListViewModel';
import { useItemViewModel } from '../../Hooks/Item/useItemViewModel';
import { useDiscountPerItemViewModel } from '../../Hooks/DiscountPerItem/useDiscountPerItemViewModel';

export const AddSaleItem = ({ title, selectedStakeholderType, selectedStakeholder }) => {
   const { t } = useTranslation()

   const [orderItems, setOrderItems] = useState([])
   const [selectedSalePriceList, setSelectedSalePriceList] = useState()
   const [selectedDiscountPerItem, setSelectedDiscountPerItem] = useState()
   const [total, setTotal] = useState(0)
   const [selectedSaleItem, setSelectedSaleItem] = useState()

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

   // Autoselect First List Price
   useEffect(() => {
      if (salePrices.length > 0) {
         setSelectedSalePriceList(salePrices[0]._id)
      }
   }, [salePrices])

   // Autoselect First Discount Per Item
   useEffect(() => {
      if (discountsPerItem.length > 0) {
         setSelectedDiscountPerItem("") // Initially, set it to an empty string indicating "Ninguna"
      }
   }, [discountsPerItem])

   // Autoselect First Sale Item
   useEffect(() => {
      if (saleItems.length > 0) {
         setSelectedSaleItem(saleItems[0]._id)
      }
   }, [saleItems])

   const onNewItemDidPressed = () => {
      const priceList = salePrices.find((salePrice) => salePrice._id === selectedSalePriceList)
      const saleItem = saleItems.find((saleItem) => saleItem._id === selectedSaleItem)
      const discountPerItem = discountsPerItem.find((d) => d._id === selectedDiscountPerItem)

      if (!priceList || !saleItem) {
         return
      }

      const discount = discountPerItem ? discountPerItem.rate : 1
      const quantity = 1

      const newItem = {
         id: Math.random().toString(36), // Ensure a unique id for each new item
         saleItemId: saleItem._id,  // Use saleItemId for comparison
         discountPerItemId: selectedDiscountPerItem || null, // Store the discountPerItemId or null
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
      updateTotal()
   }, [orderItems])

   useEffect(() => {
      updateOrderItemsWithPriceList()
   }, [selectedSalePriceList, selectedDiscountPerItem]) // Ensure to add selectedDiscountPerItem as dependency

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

   const handleOnDiscountPerItemChange = (event, index) => {
      const selectedDiscountId = event.target.value;
      const discountPerItem = discountsPerItem.find((d) => d._id === selectedDiscountId)
      const discount = discountPerItem ? discountPerItem.rate : 1

      const updatedOrders = orderItems.map((o, i) => {
         if (i === index) {
            const priceList = salePrices.find((salePrice) => salePrice._id === selectedSalePriceList)
            const saleItem = saleItems.find((s) => s._id === o.saleItemId)
            if (!priceList || !saleItem) return o;

            const quantity = o.quantity || 1
            return {
               ...o,
               discountPerItemId: selectedDiscountId || null, // Update the discountPerItemId
               discount: discount,
               total: priceList.rate * discount * quantity * saleItem.salePrice
            }
         }
         return o
      })
      setOrderItems(updatedOrders)
   };

   const handleSelectorChange = (event, index) => {
      const selectedOptionId = event.target.value;
      const priceList = salePrices.find((salePrice) => salePrice._id === selectedSalePriceList)
      const saleItem = saleItems.find((saleItem) => saleItem._id === selectedOptionId)
      if (!priceList || !saleItem) {
         return
      }

      const updatedOrders = orderItems.map((o, i) => {
         if (i === index) {
            const discount = 1
            const quantity = 1
            return {
               ...o,
               saleItemId: saleItem._id,
               discountPerItemId: "", // Reset discount to "Ninguna"
               saleItem: saleItem.title,
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
                     disabled={!saleItems.length > 0}
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
                  <select
                     style={{
                        width: '100%',
                        border: '1px solid rgb(180, 180, 180)',
                        height: '3rem'
                     }}
                     value={orderItem.saleItemId} // Ensure the value is the saleItemId
                     onChange={(event) => handleSelectorChange(event, index)}
                  >
                     {saleItems.map((s) => (
                        <option
                           key={s._id}
                           value={s._id}>{t(s.title)}
                        </option>
                     ))}
                  </select>

                  <select
                     style={{
                        width: '100%',
                        border: '1px solid rgb(180, 180, 180)',
                        height: '3rem'
                     }}
                     value={orderItem.discountPerItemId || ""} // Ensure the value is the discount id or an empty string
                     onChange={(event) => handleOnDiscountPerItemChange(event, index)}
                  >
                     <option value="">Ninguna</option> {/* Optional first option */}
                     {discountsPerItem.filter((d) => d.items.includes(orderItem.saleItemId)).map((s) => (
                        <option
                           key={s._id}
                           value={s._id}>{t(s.name)}
                        </option>
                     ))}
                  </select>
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
