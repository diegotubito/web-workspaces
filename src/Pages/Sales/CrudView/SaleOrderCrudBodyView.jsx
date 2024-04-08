import { useTranslation } from 'react-i18next';
import { TextField } from '../../../Components/TextField/TextField';
import { Button, Spinner } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStakeholderViewModel } from '../../../Hooks/Stakeholder/useStakeholderViewModel';
import './SaleOrderCrudBodyView.css'

export const SaleOrderCrudBodyView = () => {
   const { t } = useTranslation();
   const navigate = useNavigate();
   const {
      stakeholders,
      stakeholderIsLoading,
      getStakeholdersByType,
      setOnStakeholderFailed,
      fetchStakeholdersByWorkspaceAndTypePaginated
   } = useStakeholderViewModel()

   const [customerForm, setCustomerForm] = useState({
      name: 'customer_input',
      value: '',
      errorMessage: '',
      type: 'text',
      autocomplete: 'off',
      autoCapitalize: 'none',
      size: 'large'
   })
   const [selectedCustomer, setSelectedCustomer] = useState()
   const [showSearchTextField, setShowSearchTextField] = useState(true)
   const [customers, setCustomers] = useState([])

   const onInputChange = (name, newValue) => {
      console.log(newValue)
   }

   const onDidBeginInput = (name, begin) => {
      if (!begin) {
         console.log('ended')
      } else {
         console.log('begin')
      }
   }

   const onReturnPressed = (name) => {
      console.log(customerForm)
      fetchStakeholdersByWorkspaceAndTypePaginated('CUSTOMER', customerForm.value)
   }

   useEffect(() => {
     setCustomers(stakeholders)
     if (stakeholders.length === 0) {
        setCustomerForm((prev) => {
         return { ... prev, errorMessage: 'No se encontro ningun registro'}
        })
     } else {
        setCustomerForm((prev) => {
           return { ...prev, errorMessage: '' }
        })
     }
   }, [stakeholders])

  

   useEffect(() => {
      if (selectedCustomer) {
         setShowSearchTextField(false)
      } else {
         setShowSearchTextField(true)
      }
   }, [selectedCustomer, setSelectedCustomer])

   const onSelectedCustomer = (customer) => {
      setSelectedCustomer(customer)
   }

   const onChangeCustomer = () => {
      setSelectedCustomer(null)
      setShowSearchTextField(true)
   }

   return (
      <div>
         <div>
            {showSearchTextField && (
               <>
                  <TextField
                     title={t('Customer')}
                     placeholder={t('National ID, Tax ID, Lastname, Firstname searches criteria.')}
                     onInputChange={onInputChange}
                     onDidBegin={onDidBeginInput}
                     onReturnPressed={onReturnPressed}
                     form={customerForm}
                     setForm={setCustomerForm}
                  />
                  <ul className="stakeholder-list">
                     {customers.map((customer) => (
                        <li key={customer._id} onClick={() => onSelectedCustomer(customer)} className="stakeholder-item">
                           <div className="register-content">
                              <div className="register-title">
                                 {`${customer.firstName} ${customer.lastName} - ID: ${customer.nationalId}`}
                              </div>
                           </div>
                        </li>
                     ))}
                  </ul>

               </>
            )}

            {
               !showSearchTextField && (
                  <>
                     <div className="selected-stakeholder-card">
                        <div className="stakeholder-info">
                           <div className="stakeholder-name">
                              {`${selectedCustomer.firstName} ${selectedCustomer.lastName}`}
                           </div>
                           <div className="stakeholder-id">
                              ID: {selectedCustomer.nationalId}
                           </div>
                        </div>
                        <button className="edit-stakeholder-btn" onClick={() => onChangeCustomer() }>
                           Editar
                        </button>
                     </div>
                  </>
               )
            }


         </div>
      </div>
   )
}