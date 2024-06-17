import { useState } from "react";
import axios from "axios";
import { useUserSession } from "../Contexts/userSessionContext";

const BASE_URL = process.env.REACT_APP_BASE_URL;
const APP_VERSION = process.env.REACT_APP_VERSION;

// Additional headers for device and system information
const additionalHeaders = {
   appVersion: APP_VERSION,
   UserAgent: navigator.userAgent, // Includes information about the browser and operating system
   Locale: navigator.language, // User's preferred language
   TimeZone: Intl.DateTimeFormat().resolvedOptions().timeZone, // User's time zone
};

export const useApiCall = () => {
   const {
      userSession,
      updateUserSession,
      retrieveUUID,
      retrieveAccessToken,
      retrieveRefreshToken,
      isAccessTokenExpired,
   } = useUserSession();
   const [error, setError] = useState(null);
   const [isLoading, setIsLoading] = useState(false);

   const apiCall = async ({
      path,
      method = "GET",
      body = {},
      headers = {},
      isLogin = false
   }) => {
     if (isAccessTokenExpired() && !isLogin) {
         console.log("refresing access token");
         try {
            const response = await refreshAccessToken();
             console.log("refreshed");

            const newUserSession = {
               ...userSession, accessToken: response.accessToken, accessTokenExpirationDateString: response.accessTokenExpirationDateString,
            };
            await updateUserSession(newUserSession);
            console.log("user session updated");

         } catch (error) {
            throw new RefreshingTokenError("Api Error", "Oops we've got an error. Try again later...");
         }
      }

      return performApiCall({ path, method, body, headers });
   };

   const performApiCall = async (
      { path, method = "GET", body = {}, headers = {} }
   ) => {
      setIsLoading(true);
      setError(null); // Ensure error state is reset at the start of the call
      try {
         const response = await axios({
            url: `${BASE_URL}${path}`,
            method,
            data: body, // Renamed to 'body' for clarity that this is the request payload
            headers: {
               "Content-Type": "application/json",
               Accept: "application/json",
               Authorization: `${retrieveAccessToken()}`,
               deviceuuid: `${retrieveUUID()}`,
               ...additionalHeaders,
               ...headers, // Spread custom headers last to allow override
            },
         });
         return response.data;
      } catch (err) {
         const apiError = mapErrorToCustom(err);
         setError(apiError);
         throw apiError;
      } finally {
         setIsLoading(false);
      }
   };

   const refreshAccessToken = async () => {
      setIsLoading(true);
      setError(null); // Ensure error state is reset at the start of the call
      try {
         const request = {
            url: `${BASE_URL}${"/api/v1/refresh"}`,
            method: "POST",
            headers: {
               "Content-Type": "application/json",
               Accept: "application/json",
               Authorization: `${retrieveRefreshToken()}`,
               deviceuuid: `${retrieveUUID()}`,
               ...additionalHeaders,
            },
         };
         const response = await axios(request);
         return response.data;
      } catch (err) {
         const apiError = mapErrorToCustom(err);
         setError(apiError);
         throw apiError;
      } finally {
         setIsLoading(false);
      }
   };

   return { apiCall, error, isLoading };
};

const mapErrorToCustom = (err) => {
   if (err.response) {
      const { status, data } = err.response;
      const title = data.title || "Error";
      const message = data.message || "An error occurred";

      switch (status) {
         case 400:
            return new BadRequestError(title, message);
         case 401:
            return new AuthenticationError();
         case 404:
            return new NotFoundError('_404_ERROR_TITLE', '_404_ERROR_MESSAGE');
         // Add more cases as needed
         default:
            return new APIError(`${status} - ${message}`);
      }
   } else {
      // Handle network errors or errors without a response
      return new CustomError("Api Error", "Some Error Occured.");
   }
};

class APIError extends Error {
   constructor(message) {
      super(message);
      this.name = "APIError";
   }
}

class BadRequestError extends APIError {
   constructor(title, message) {
      super();
      this.title = title;
      this.message = message;
      this.name = "BadRequest";
   }
}

class CustomError extends APIError {
   constructor(title, message) {
      super();
      this.title = title;
      this.message = message;
      this.name = "CustomError";
   }
}

class AuthenticationError extends APIError {
   constructor(title, message) {
      super();
      this.title = title;
      this.message = message;
      this.name = "AuthenticationError";
   }
}

class RefreshingTokenError extends APIError {
   constructor(title, message) {
      super();
      this.title = title;
      this.message = message;
      this.name = "AuthenticationError";
   }
}

class NotFoundError extends APIError {
   constructor(title, message) {
      super();
      this.title = title;
      this.message = message;
      this.name = "NotFoundError";
   }
}

// Add other specific errors as needed...
