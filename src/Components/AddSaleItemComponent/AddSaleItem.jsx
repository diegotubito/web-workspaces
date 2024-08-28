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
import { ReactComponent as TrashIcon } from '../../Resources/Images/delete_icon.svg';
import { StakeholderType } from '../../Hooks/Stakeholder/stakeholderType';
import { TransactionTypeEnum } from '../../Hooks/Transaction/transactionType';

export const AddSaleItem = ({ orderItems, setOrderItems, title, selectedOrderType, selectedStakeholder, itemTotal, setItemTotal, selectedSalePriceList, setSelectedSalePriceList }) => {
   const { t } = useTranslation()

   const settings = {
      padding: '0.5rem 0.5rem',
      inputBorderColorEnabled: 'rgb(200, 200, 200)',
      inputBorderColorDisabled: 'rgb(240, 240, 240)',
      borderRadius: '4px'
   }

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
   }, [])

   useEffect(() => {
      if (!selectedStakeholder) {
         setOrderItems([])
      } else {
         switch (selectedOrderType) {
            case TransactionTypeEnum.PURCHASE:
               fetchItemsByWorkspaceAndStakeholder(selectedStakeholder)
               break
            case TransactionTypeEnum.SALE:
            case TransactionTypeEnum.CREDIT_NOTE:
            case TransactionTypeEnum.DEBIT_NOTE:
               fetchSaleItemsByWorkspace(true)
               break
            default:
               fetchSaleItemsByWorkspace(false)
               break
         }
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
         acceptedPaymentMethods: saleItem.acceptedPaymentMethods,
         acceptedCurrencies: saleItem.acceptedCurrencies,
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
      setItemTotal(result)
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
               acceptedPaymentMethods: saleItemObject.acceptedPaymentMethods,
               acceptedCurrencies: saleItemObject.acceptedCurrencies,
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

   const onRemoveButtonClicked = (orderItemObject) => {
      const index = orderItems.findIndex((item) => item.id === orderItemObject.id);
      if (index !== -1) {
         const newItems = [...orderItems];
         newItems.splice(index, 1); // Usar splice en newItems en lugar de orderItems
         setOrderItems(newItems);
      }
   }

   const getGridTemplate = () => {
      switch (selectedOrderType) {
         case TransactionTypeEnum.SALE:
            return '1fr 0.7fr 0.3fr 0.7fr 0.3fr 1fr 0.1fr 0.7fr 0.1fr'
         case TransactionTypeEnum.PURCHASE:
            return '1fr 0.7fr 0.3fr 1fr 0.1fr 0.7fr 0.1fr'
         default:
            return '1fr 0.7fr 0.3fr 0.7fr 0.3fr 1fr 0.1fr 0.7fr 0.1fr'
      }
   }

   const filterDiscounts = (orderItem) => {
      const discounts = discountsPerItem.filter((d) =>
         d.items.some(item => item._id === orderItem.saleItemId)
      ).filter((d) =>
         d.stakeholderTypes.includes(selectedStakeholder.stakeholderType)
      );
      return discounts
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

            {selectedOrderType !== TransactionTypeEnum.PURCHASE && (<PriceListSelection
               selectedSalePriceList={selectedSalePriceList}
               salePrices={salePrices}
               onSelectedPriceList={handleOnChangePriceList}
            />)}

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
                     gridTemplateColumns: getGridTemplate(),
                     alignItems: 'baseline',
                     gap: '0.5rem',
                     width: '100%',
                     color: 'white'
                  }}
               >
                  <div style={{
                     padding: '0.0rem 1rem',
                  }}>Item</div>
                  <div style={{
                     padding: '0.0rem 1rem',
                  }}>List Price</div>
                  <div style={{
                     padding: '0.0rem 1rem',
                  }}>Rate</div>
                  
                  {selectedOrderType !== TransactionTypeEnum.PURCHASE && (<div style={{
                     padding: '0.0rem 1rem',
                  }}>Discount</div>)}
                  
                  {selectedOrderType !== TransactionTypeEnum.PURCHASE && ( <div style={{
                     padding: '0.0rem 1rem',
                  }}>Rate</div>)}
                  
                  <div style={{
                     padding: '0.0rem 1rem',
                  }}>Note</div>
                  <div style={{
                     padding: '0.0rem 1rem',
                  }}>Qty</div>
                  <div style={{
                     padding: '0.0rem 1rem',
                  }}>Total Amount</div>
               </div>




               <form>
                  {orderItems.map((orderItem, index) => (
                     <div
                        key={orderItem.id} // Use a unique key for each item
                        style={{
                           display: 'grid',
                           gridTemplateColumns: getGridTemplate(),
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

                        {selectedOrderType !== TransactionTypeEnum.PURCHASE && (<DiscountSelection
                           settings={settings}
                           isEnabled={true}
                           index={index}
                           orderItem={orderItem}
                           discounts={filterDiscounts(orderItem)}
                           selectedDiscountPerItem={handleSelectedDiscountPerItem}
                        />)}

                        {selectedOrderType !== TransactionTypeEnum.PURCHASE && (<TextInput
                           isEnabled={false}
                           settings={settings}
                           placeholder={''}
                           maxLength={3}
                           textAlign={'center'}
                           initialValue={orderItem.discount}
                           index={index}
                        />)}

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

                        <div className="input_field_column">
                           <TrashIcon
                              className='input_field_column__trash-button'
                              onClick={() => onRemoveButtonClicked(orderItem)}
                           />
                        </div>
                     </div>
                  ))}
               </form>


            </div>
         </div>

         <div className='add_sale_item__total-amount-main'>
            <h2 className='add_sale_item__title'> {'Partial Amount'}</h2>
            <h3 className='add_sale_item__total-amount '>{formatCurrency(itemTotal.toFixed(2).toString())}</h3>
         </div>
      </div>
   )
}
