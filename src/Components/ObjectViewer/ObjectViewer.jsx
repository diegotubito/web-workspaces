import React, { useState, useEffect, useRef } from 'react';
import './ObjectViewer.css';

export const ObjectViewer = () => {
   const [position, setPosition] = useState({ x: 0, y: 0 });
   const innerRef = useRef(null);

   useEffect(() => {
      if (innerRef.current) {
         const width = innerRef.current.offsetWidth;
         const height = innerRef.current.offsetHeight;
         console.log(`El ancho de inner es: ${width}px`);
         console.log(`La altura de inner es: ${height}px`);
      }
   }, []); // Este efecto se ejecuta una vez cuando el componente se monta

   const moveBox = () => {
      setPosition((currentPosition) => {
         const x = currentPosition.x
         const y = currentPosition.y

         return {x: x + 10, y: y}
      })

      console.log('paso por aca')
   };

   const handleClick = (event) => {
      // Obten las coordenadas del clic respecto al viewport
      const xInViewport = event.clientX;
      const yInViewport = event.clientY;

      // Obten la posición del object_viewer__main respecto al viewport
      const mainRect = event.currentTarget.getBoundingClientRect();

      // Calcula las coordenadas del clic dentro de object_viewer__inner
      // considerando el scroll de object_viewer__main
      const xInsideInner = xInViewport - mainRect.left + event.currentTarget.scrollLeft;
      const yInsideInner = yInViewport - mainRect.top + event.currentTarget.scrollTop;

      console.log(`Click inside inner element: x: ${xInsideInner}, y: ${yInsideInner}`);
   };

   const elBox = () => {
      console.log('t')
   }


   return (
      <div className='object_viewer__main' onClick={handleClick}>
         <div className='object_viewer__inner' ref={innerRef}>
            <div
            onClick={elBox}
               className='object_viewer__box'
               style={{
                  position: 'absolute', // Asegúrate de que .object_viewer__box tenga posición absoluta
                  top: `${position.y}rem`,
                  left: `${position.x}rem`,
               }}
            ></div>
         </div>
      </div>
   );
};
