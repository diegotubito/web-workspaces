import React, { createContext, useContext, useState } from 'react';

// Create a Context object. This will be used to provide and consume the user session data throughout your app.
const UserSessionContext = createContext();

// Custom hook for consuming our context. This makes it easier to access the user session data and updater function from any component.
export const useUserSession = () => useContext(UserSessionContext);

// Provider component that wraps your app or parts of it, making the user session available to any child component.
export const UserSessionProvider = ({ children }) => {
    // State hook initialized with the user session data from localStorage.
    // This function runs only once when the component mounts, thanks to the lazy initial state syntax.
    const [userSession, setUserSession] = useState(() => {
        const sessionData = localStorage.getItem('userSession'); // Attempt to retrieve the user session from localStorage.
        // Parse the retrieved JSON string back into an object, or default to null if nothing was found.
        return sessionData ? JSON.parse(sessionData) : null;
    });

    // Function to update the user session both in the component state and localStorage.
    // This ensures that the user session is kept in sync across page reloads.
    const updateUserSession = (newSession) => {
        localStorage.setItem('userSession', JSON.stringify(newSession)); // Persist the new session data to localStorage.
        setUserSession(newSession); // Update the state, triggering a re-render of components that consume this context.
    };

    // The context provider component renders its children and provides them access to the context value,
    // which includes the current user session and the function to update it.
    return (
        <UserSessionContext.Provider value={{ userSession, updateUserSession }}>
            {children}
        </UserSessionContext.Provider>
    );
};
