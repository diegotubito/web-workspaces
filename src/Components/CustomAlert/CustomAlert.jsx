import { useEffect } from 'react';
import { Button, Alert } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

export const CustomAlert = ({ title, message, setErrorStateToNull, action, navigate }) => {
   const {t} = useTranslation()

   const handleOnClickOkButton = () => {
      setErrorStateToNull(null);
      switch (action) {
         case 'none':
            break;
         case 'pop':
            navigate(-1);
            break;
         // Agrega más casos según sea necesario
      }
   };

   
   return (
      <div className="alert-container">
         <Alert variant="warning">
            <Alert.Heading>{t(title)}</Alert.Heading>
            <h3>
               {t(message)}
            </h3>
            <hr />
            <div className="d-flex justify-content-end">
               <Button onClick={handleOnClickOkButton} variant="outline-success">
                  Close me
               </Button>
            </div>
         </Alert>
      </div>
   )
}