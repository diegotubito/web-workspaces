import React from 'react';
import './ButtonIcon.css';

export const ButtonIcon = ({ reactIcon: Icon, title, onClick }) => {
   return (
      <div className='button_icon__main' onClick={onClick}>
         <div className='button_icon__container'>
            {Icon && <Icon className='button_icon__image' />}
         </div>
         <h2>{title}</h2>
      </div>
   );
};
