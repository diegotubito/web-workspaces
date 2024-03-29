import './SimpleButton.css'

export const SimpleButton = ({ style, title, onClick, disabled }) => {

   const Style = {
      primary: 'primary',
      secondary: 'secondary',
      destructive: 'destructive',
      cancel: 'cancel'      
   }

   const buttonClass = `simple_button__style${disabled ? ' disabled' : ''}`;

   const handleOnClick = () => {
      if (disabled) {
         return;
      }
      onClick();
   };

   const getColor = () => {
      switch (style) {
         case Style.primary:
            return 'white'
         case Style.secondary:
            return 'white'
         case Style.destructive:
            return 'white'
         case Style.cancel:
            return 'white'
         default:
            return 'white'
      }
   }

   const getBackgroundColor = () => {
      switch (style) {
         case Style.primary:
            return 'var(--highlightBlue)'
         case Style.secondary:
            return 'var(--orange)'
         case Style.destructive:
            return 'var(--destructive)'
         case Style.cancel:
            return 'var(--gray)'
         default:
            return 'clear'
      }
   }

   return (
      <div
         className={buttonClass}
         style={{
            backgroundColor: getBackgroundColor(),
            color: getColor(),
            pointerEvents: disabled ? 'none' : 'auto', // Prevents click events
         }}
         onClick={handleOnClick}
      >
         {title}
      </div>
   );
}