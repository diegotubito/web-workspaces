import { useState } from 'react';
import axios from 'axios';
import { useUserSession } from './userSessionContext';

const BASE_URL = process.env.REACT_APP_BASE_URL;

export const useApiCall = () => {
    const { userSession } = useUserSession();
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const apiCall = async ({ path, method = 'GET', data = null, headers = {} }) => {
        setIsLoading(true);
        const defaultHeaders = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${userSession?.accessToken}`,
            // Include other default headers as needed
        };

        try {
            const response = await axios({
                url: `${BASE_URL}${path}`,
                method,
                data,
                headers: { ...defaultHeaders, ...headers },
            });
            setData(response.data);
            setError(null); // Reset error state on successful call
            return response.data; // Optionally return data for immediate use
        } catch (err) {
            setData(null); // Reset data state on error
            console.log(err.response);
            if (err.response) {
                const { status, data } = err.response;
                const title = data.title || "_ERROR";
                const message = data.message || "An error occurred";
                switch (status) {
                    case 400:
                        throw new BadRequestError(title, message);
                    case 432:
                        throw new CustomError(title, message);
                    case 401:
                        throw new AuthenticationError();
                    case 404: 
                        throw new NotFoundError('Bad request', 'Your endpoint is not found.');
                    // Add other cases as per your Swift code
                    default:
                        throw new APIError(`${status} - ${message}`);
                }
            } else {
                // Handle network errors or errors without a response
                throw new APIError(err.message || "Network error");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return { apiCall, data, error, isLoading };
};


class APIError extends Error {
    constructor(message) {
        super(message);
        this.name = "APIError";
    }
}

class BadRequestError extends APIError {
    constructor(title, message) {
        super(`${title}: ${message}`);
        this.name = "BadRequestError";
    }
}

class CustomError extends APIError {
    constructor(title, message) {
        super(`${title}: ${message}`);
        this.name = "CustomError";
    }
}

class AuthenticationError extends APIError {
    constructor() {
        super("Authentication failed");
        this.name = "AuthenticationError";
    }
}

class NotFoundError extends APIError {
    constructor(title, message) {
        super();
        this.title = title
        this.message = message
        this.name = "NotFoundError";
    }
}

// Add other specific errors as needed...
