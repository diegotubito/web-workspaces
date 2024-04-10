import { useTranslation } from 'react-i18next';
import { SearchBar } from '../TextField/SearchBar/SearchBar';
import { Button } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStakeholderViewModel } from '../../Hooks/Stakeholder/useStakeholderViewModel';
import './CustomerSelector.css'
import defaultProfileImage from '../../Resources/Images/empty_profile.jpg';
import { Spinner } from '../Spinner/spinner'
import { ErrorAlert } from '../CustomAlert/ErrorAlert';


export const CustomerSelector = ({ selectedCustomer, setSelectedCustomer }) => {
   const { t } = useTranslation();
   const navigate = useNavigate();

   const {
      stakeholders,
      isLoading: stakeholderIsLoading,
      getStakeholdersByType,
      onStakeholderFailed,
      fetchStakeholdersByWorkspaceAndTypePaginated,
      stakeholderEmptyList
   } = useStakeholderViewModel()

   const [customerForm, setCustomerForm] = useState({
      name: 'customer_input',
      title: 'Search Customer Bar',
      placeholder: t('National ID, Tax ID, Lastname, Firstname searches criteria.'),
      value: '',
      errorMessage: '',
      autocomplete: 'off',
      autoCapitalize: 'none',
      textAlign: 'start',
      maxLength: 30
   })
   const [showSearchTextField, setShowSearchTextField] = useState(true)
   const [customers, setCustomers] = useState([])

   const onInputChange = (name, newValue) => {

   }

   const onDidBeginInput = (name, begin) => {
      if (!begin) {

      } else {
      }
   }

   const onReturnPressed = (name) => {
      fetchStakeholdersByWorkspaceAndTypePaginated('CUSTOMER', customerForm.value)
   }

   useEffect(() => {
      setCustomers(stakeholders)
   }, [stakeholders])

   useEffect(() => {
      if (stakeholderEmptyList) {
         setCustomerForm((prev) => {
            return { ...prev, errorMessage: 'No se encontro ningun registro' }
         })
      } else {
         setCustomerForm((prev) => {
            return { ...prev, errorMessage: '' }
         })
      }
   }, [stakeholderEmptyList])

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
      <>
         {showSearchTextField && (
            <>
              {stakeholderIsLoading && <Spinner />}

               {onStakeholderFailed && (
                  <ErrorAlert
                     errorDetails={onStakeholderFailed}
                     navigate={navigate}
                  />
               )}

               <SearchBar
                  title={t('Customer')}
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
               <div className="selected-stakeholder-card">
                  <div className="stakeholder-info-row">


                     {/* Personal Information */}
                     <div className="stakeholder-info-section" style={{ display: 'flex', alignItems: 'center' }}>

                        {/* Profile Image */}
                        <div>
                           <img
                              src={selectedCustomer.profileImage?.thumbnailImage?.url || defaultProfileImage}
                              alt={selectedCustomer.firstName ? `${selectedCustomer.firstName}'s profile` : "Default Profile"}
                              className="stakeholder-profile-image"
                           />
                        </div>

                        <div style={{ marginLeft: '10px' }}>
                           <div className="stakeholder-name">
                              {`${selectedCustomer.firstName} ${selectedCustomer.lastName}`}
                           </div>
                           <div className="stakeholder-rest-info">
                              ID: {selectedCustomer.nationalId || selectedCustomer.taxId}
                           </div>
                           {selectedCustomer.dob && (
                              <div className="stakeholder-rest-info">
                                 DOB: {new Date(selectedCustomer.dob).toLocaleDateString()}
                              </div>
                           )}
                        </div>
                     </div>


                     {/* Contact Information */}
                     <div className="stakeholder-info-section">
                        {selectedCustomer.email && (
                           <div className="stakeholder-rest-info">
                              Email: {selectedCustomer.email}
                           </div>
                        )}
                        {selectedCustomer.phoneNumber && (
                           <div className="stakeholder-rest-info">
                              Phone: {selectedCustomer.phoneNumber}
                           </div>
                        )}
                     </div>

                     {/* Address Information */}
                     {selectedCustomer.legacyAddress && (
                        <div className="stakeholder-info-section">
                           <div className="stakeholder-rest-info">
                              Address: {selectedCustomer.legacyAddress}
                           </div>
                        </div>
                     )}

                     {/* Action Buttons */}
                     <div className="stakeholder-actions">
                        <button className="edit-stakeholder-btn" onClick={() => onChangeCustomer()}>
                           Select Other
                        </button>
                        {/* Add more action buttons if needed */}
                     </div>
                  </div>
               </div>
            )
         }

      </>
   )
}