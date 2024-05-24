import './StakeholderTypeSelector.css'
import { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import { StakeholderType } from '../../Hooks/Stakeholder/stakeholderType';

export const StakeholderTypeSelector = ({ title, selectedStakeholderType, setSelectedStakeholderType }) => {
   const { t } = useTranslation()
   const [ types, setTypes] = useState([])

   useEffect(() => {
      const stakeholderTypes = Object.values(StakeholderType)
      setTypes(stakeholderTypes)
   }, [])

   useEffect(() => {
      // default payment method
      if (types.length > 0) {
         setSelectedStakeholderType(types[0])
      }
   }, [types])

   const handleOnSelectedStakeholderTypeChange = (event) => {
      const item = event.target.value;
      setSelectedStakeholderType(item);
   };

   return (
      <div>
         <h3 className='stakeholder_type_selector__form-title'>{t(title)}</h3>
         <select className="stakeholder_type_selector__form-select" value={selectedStakeholderType} onChange={handleOnSelectedStakeholderTypeChange}>
            {types.map((type) => (
               <option key={type} value={type}>{t(type)}</option>
            ))}
         </select>
      </div>
   )
}