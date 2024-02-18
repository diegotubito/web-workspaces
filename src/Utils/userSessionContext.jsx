import React, { createContext, useContext, useState } from 'react';

const UserSessionContext = createContext();

export const useUserSession = () => useContext(UserSessionContext);

export const UserSessionProvider = ({ children }) => {
    // Directly initializing the userSession state with the value from localStorage
    const [userSession, setUserSession] = useState(() => {
        const sessionData = localStorage.getItem('userSession');
        // Return the parsed object if it exists, or null if not
        return sessionData ? JSON.parse(sessionData) : null;
    });

    // Update both localStorage and state when userSession changes
    const updateUserSession = (newSession) => {
        localStorage.setItem('userSession', JSON.stringify(newSession));
        setUserSession(newSession);
    };

    return (
        <UserSessionContext.Provider value={{ userSession, updateUserSession }}>
            {children}
        </UserSessionContext.Provider>
    );
};
