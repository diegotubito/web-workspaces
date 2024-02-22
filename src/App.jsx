import './App.css';
import { Routes, Route } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import { LoginView } from './Pages/Login/LoginView';
import { Home } from './Pages/Home/Home';
import { useUserSession } from './Utils/userSessionContext'; // Import the hook
import './i18n'; // The path to your i18n config file
import { useEffect } from 'react';

function App() {
  /* With the default route and protected routes set up, you may not need the useEffect hook in your App component to navigate to /home immediately.
   The routing logic will handle taking the user to the correct page based on their authentication status and the URL they visit.*/
  const { initializeUUID } = useUserSession()

  useEffect(() => {
    initializeUUID(); // Asegúrate de importar esta función si está definida en otro archivo
  }, [initializeUUID]);

  return (
    <>
      <Routes>

        <Route path="/" element={<Navigate replace to="/home" />} /> {/* Redirect from / to /home */}
        <Route path="/login" element={<LoginView />} />

        <Route path="/home" element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        } />
      </Routes>

    </>
  )
}

const ProtectedRoute = ({ children }) => {
  const { userSession } = useUserSession();

  const isAuthenticated = validateAuthentication(userSession)
  if (!isAuthenticated) {
    // Redirect to /login if not authenticated
    return <Navigate to="/login" replace />;
  }

  return children; // Render the protected component if authenticated
};

function validateAuthentication(userSession) {
  if (!userSession) {
    console.log('no user session: log out')
    return false
  }

  const force_authentication = userSession.force_authentication

  if (force_authentication === true) {
    console.log('forced log in')
    return false
  }


  const refreshTokenExpirationDate = new Date(userSession.refreshTokenExpirationDateString)
  if (refreshTokenExpirationDate < Date.now()) {
    console.log('refresh token expired', refreshTokenExpirationDate)
    return false
  }

  // const accessTokenExpirationDate = new Date(userSession.accessTokenExpirationDateString)
  // if (accessTokenExpirationDate < Date.now()) {
  //   console.log('access token expired', accessTokenExpirationDate)
  //   return false
  // }

  console.log('logged in')
  return true
}

export default App;
