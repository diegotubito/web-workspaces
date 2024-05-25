import './CustomerSelector.css'
import { useTranslation } from 'react-i18next';
import { SearchBar } from '../../../Components/TextField/SearchBar/SearchBar'
import { Button } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStakeholderViewModel } from '../../../Hooks/Stakeholder/useStakeholderViewModel'
import defaultProfileImage from '../../../Resources/Images/empty_profile.jpg'
import { Spinner } from '../../Spinner/spinner';
import { ErrorAlert } from '../../CustomAlert/ErrorAlert';


export const CustomerSelector = ({ selectedCustomer, setSelectedCustomer, stakeholderType }) => {
   const { t } = useTranslation();
   const navigate = useNavigate();

   const defaultTextFieldForm = {
      name: 'customer_input',
      title: t(stakeholderType),
      placeholder: t('National ID, Tax ID, Lastname, Firstname searches criteria.'),
      value: '',
      errorMessage: '',
      autocomplete: 'off',
      autoCapitalize: 'none',
      textAlign: 'start',
      maxLength: 30
   }

   const {
      stakeholders,
      setStakeholders,
      isLoading: stakeholderIsLoading,
      getStakeholdersByType,
      onStakeholderFailed,
      fetchStakeholdersByWorkspaceAndTypePaginated,
      stakeholderEmptyList
   } = useStakeholderViewModel()

   const [customerForm, setCustomerForm] = useState(defaultTextFieldForm)
   const [showSearchTextField, setShowSearchTextField] = useState(true)

   const onInputChange = (name, newValue) => {

   }

   const onDidBeginInput = (name, begin) => {
      if (!begin) {

      } else {
      }
   }

   const onReturnPressed = (name) => {
      fetchStakeholdersByWorkspaceAndTypePaginated(stakeholderType, customerForm.value)
   }

   useEffect(() => {
      setCustomerForm(defaultTextFieldForm)
      setStakeholders([])
   }, [stakeholderType])

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
         setStakeholders([])
         setCustomerForm(defaultTextFieldForm)
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
            <div>
               {stakeholderIsLoading && <Spinner />}

               {onStakeholderFailed && (
                  <ErrorAlert
                     errorDetails={onStakeholderFailed}
                     navigate={navigate}
                  />
               )}

               <div>
                  <p style={{
                     fontSize: '19px',
                     fontWeight: 'bold',
                     margin: '0'
                  }}>{t(stakeholderType)}</p>
                  <SearchBar
                     title={t('Customer')}
                     onInputChange={onInputChange}
                     onDidBegin={onDidBeginInput}
                     onReturnPressed={onReturnPressed}
                     form={customerForm}
                     setForm={setCustomerForm}
                  />
               </div>

               <ul className="stakeholder-list">
                  {stakeholders.map((customer) => (
                     <li key={customer._id} onClick={() => onSelectedCustomer(customer)} className="stakeholder-item">
                        <div className="register-content">
                           <div className="register-title">
                              {customer.firstName && (
                                 `${customer.firstName} ${customer.lastName} - ID: ${customer.nationalId}`
                              )}
                              {customer.title && (
                                 `${customer.title} ${customer.subTitle ? customer.subTitle : ''} - Tax ID: ${customer.taxId ? customer.taxId : 'none'}`
                              )}
                           </div>
                        </div>
                     </li>
                  ))}
               </ul>
            </div>
         )}

         {
            !showSearchTextField && (

               <div>
                  <p style={{
                     fontSize: '19px',
                     fontWeight: 'bold',
                     margin: '0'
                  }}>{t(stakeholderType)}</p>


                  <div className="selected-stakeholder-card">

                     <div className="stakeholder-info-row">


                        {/* Personal Information */}
                        <div className="stakeholder-info-section" >

                           {/* Profile Image */}
                           {selectedCustomer && selectedCustomer.profileImage && (
                              <div>
                                 <img
                                    src={selectedCustomer.profileImage?.thumbnailImage?.url || defaultProfileImage}
                                    alt={selectedCustomer.firstName ? `${selectedCustomer.firstName}'s profile` : "Default Profile"}
                                    className="stakeholder-profile-image"
                                 />
                              </div>
                           )}

                           {selectedCustomer && selectedCustomer.firstName && (

                              <div style={{ marginLeft: '10px' }}>
                                 <div className="stakeholder-name">
                                    {`${selectedCustomer.firstName} ${selectedCustomer.lastName}`}
                                 </div>
                              </div>
                           )}

                           {selectedCustomer && selectedCustomer.title && (

                              <div style={{ marginLeft: '10px' }}>
                                 <div className="stakeholder-name">
                                    {`${selectedCustomer.title} ${selectedCustomer.subTitle ? selectedCustomer.subTitle : ''}`}
                                 </div>
                              </div>
                           )}

                           {selectedCustomer && selectedCustomer.nationalId && (

                              <div style={{ marginLeft: '10px' }}>
                                 <div className="stakeholder-rest-info">
                                    ID: {selectedCustomer.nationalId || selectedCustomer.taxId}
                                 </div>
                              </div>
                           )}

                           {selectedCustomer && selectedCustomer.dob && (

                              <div style={{ marginLeft: '10px' }}>

                                 {selectedCustomer.dob && (
                                    <div className="stakeholder-rest-info">
                                       DOB: {new Date(selectedCustomer.dob).toLocaleDateString()}
                                    </div>
                                 )}
                              </div>
                           )}


                        </div>


                        {/* Contact Information */}
                        {selectedCustomer && (
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

                        )}


                        {/* Address Information */}
                        {selectedCustomer && selectedCustomer.legacyAddress && (
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
               </div>
            )
         }

      </>
   )
}