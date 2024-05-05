import './SaleOrderCrudView.css'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { convertCurrencyStringToNumber, formatCurrency } from '../../../Utils/Common/formatCurrency';
import { Spinner } from '../../../Components/Spinner/spinner'
import { SimpleButton } from '../../../Components/Buttons/SimpleButton/SimpleButton'
import { ErrorAlert } from '../../../Components/CustomAlert/ErrorAlert';
import { CustomerSelector } from '../../../Components/CustomerSelector/CustomerSelector';
import { useItemViewModel } from '../../../Hooks/Item/useItemViewModel';
import { useSaleItemFormViewModel } from './useSaleItemFormViewModel';
import { InputFieldColumn } from '../../../Components/InputFieldColumn/InputFieldColumn';
import { TotalAmount } from '../../../Components/TotalAmount/TotalAmount';

export const SaleOrderCrudView = () => {
   const { t } = useTranslation()
   const navigate = useNavigate()
   const [selectedCustomer, setSelectedCustomer] = useState()
   const [selectedSaleItem, setSelectedSaleItem] = useState()
   const {
      fetchItemsByWorkspaceAndStakeholder,
      fetchSaleItemsByWorkspace,
      saleItems,
      saleItemsIsLoading,
      onGetSaleFailed,
      setOnGetSaleFailed
   } = useItemViewModel()
   
   const [orderItems, setOrderItems] = useState([]);
   const { createProductItem } = useSaleItemFormViewModel({ orderItems, setOrderItems, saleItems })
  
   const [totalAmount, setTotalAmount] = useState(0)

   useEffect(() => {
      fetchSaleItemsByWorkspace()
   }, [])

   useEffect(() => {
      console.log(selectedCustomer)
   }, [selectedCustomer, setSelectedCustomer])

   useEffect(() => {
      console.log(selectedSaleItem)
   }, [selectedSaleItem, setSelectedSaleItem])

  

   const onCreateSaleDidClicked = () => {

   }

   const onCancelDidClicked = () => {
      navigate(-1)
   }

   const createNewItem = () => {
      createProductItem()
   }

   const onNewItemDidPressed = () => {
      createNewItem()
   }

   return (

      <div className='sale_crud_view__main'>
         <div className='sale_crud_view__header'>
            <div className='sale_crud_view__footer-buttons'>

               <SimpleButton
                  title={t('PURCHASE_ORDER_CRUD_VIEW_CANCEL_ORDER_BUTTON_TITLE')}
                  style='cancel'
                  onClick={() => onCancelDidClicked()}
               />

            </div>
         </div>

         <div className='sale_crud_view__body'>
            <CustomerSelector
               selectedCustomer={selectedCustomer}
               setSelectedCustomer={setSelectedCustomer}
            />

            <div className='purchase_view__buttons'>
               <SimpleButton
                  title={t('PURCHASE_ORDER_CRUD_VIEW_ADD_NEW_ITEM_TITLE')}
                  style='primary'
                  onClick={() => onNewItemDidPressed()}
               />
            </div>

            <InputFieldColumn
               title={t('PURCHASE_ORDER_CRUD_VIEW_ITEMS_TITLE')}
               items={orderItems}
               setItems={setOrderItems}
            />

            <TotalAmount
               title={t('PURCHASE_ORDER_CRUD_VIEW_TOTAL_TO_PAY_TITLE')}
               items={orderItems}
               total={totalAmount}
               setTotal={setTotalAmount}
            />

         </div>

         <div className='sale_crud_view__footer'>

            <div className='sale_crud_view__footer-buttons'>

               <SimpleButton
                  title={t('PURCHASE_ORDER_CRUD_VIEW_CANCEL_ORDER_BUTTON_TITLE')}
                  style='cancel'
                  onClick={() => onCancelDidClicked()}
               />

               <SimpleButton
                  title={t('Create Sale')}
                  style='secondary'
                  onClick={() => onCreateSaleDidClicked()}
               />

            </div>
         </div>
      </div>
   )
}