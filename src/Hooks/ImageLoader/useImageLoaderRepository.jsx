
import { useApiCall } from '../../Utils/ApiNetwork/apiCall'

export const useImageLoaderRepository = () => {
   const { apiCall, isLoading, error } = useApiCall()

   const loadImageFromURLRepository = (url) => {
      const encodedUrl = encodeURIComponent(url);
      return apiCall({
         path: `/api/v1/storage/imageUrl?url=${encodedUrl}`,
         method: 'GET',
         responseType: 'blob',  // Specify that the response should be treated as a Blob
      });
   };

   return { loadImageFromURLRepository, isLoading, error }
}