import React from 'react';

const TurnstyleView = () => {
   const handleLedOn = async () => {
      try {
         const response = await fetch('http://localhost:666/api/v1/turnstyle/turn-on', {
            method: 'POST',
         });
         const message = await response.text();
         alert(message);
      } catch (error) {
         alert('Error encendiendo el LED');
      }
   };

   const handleLedOff = async () => {
      try {
         const response = await fetch('http://localhost:666/api/v1/turnstyle/turn-off', {
            method: 'POST',
         });
         const message = await response.text();
         alert(message);
      } catch (error) {
         alert('Error apagando el LED');
      }
   };

   return (
      <div>
         <h1>Control de LED</h1>
         <button onClick={handleLedOn}>Encender LED</button>
         <button onClick={handleLedOff}>Apagar LED</button>
      </div>
   );
};

export default TurnstyleView;