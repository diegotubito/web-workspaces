import { useState } from "react";
import { useImageLoaderRepository } from "./useImageLoaderRepository";

export const useImageLoaderViewModel = () => {
   const { loadImageFromURLRepository, isLoading } = useImageLoaderRepository()
   const [image, setImage] = useState()
   const [onImageFailed, setOnImageFailed] = useState()

   const loadImageFromURL = async (url) => {
      try {
         const response = await loadImageFromURLRepository(url)
         const downloadedImage = URL.createObjectURL(response)
         setImage(downloadedImage)
      } catch (error) {
         console.error('Error:', error.title, error.message);
         setOnImageFailed({
            title: error.title || "Error",
            message: error.message || "An unexpected error occurred",
            action: 'none',
            setError: setOnImageFailed
         })
      }
   }

   return {
      loadImageFromURL,
      isLoading,
      onImageFailed,
      image
   }
}