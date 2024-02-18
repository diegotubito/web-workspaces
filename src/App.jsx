import logo from './logo.svg';
import './App.css';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import { LoginView } from './Pages/Login/LoginView';
import { Home } from './Pages/Home/Home';
import { useUserSession } from './Utils/userSessionContext'; // Import the hook


function App() {
  /* With the default route and protected routes set up, you may not need the useEffect hook in your App component to navigate to /home immediately.
   The routing logic will handle taking the user to the correct page based on their authentication status and the URL they visit.*/
  
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
  
  const isAuthenticated = userSession ? true : false;
  isAuthenticated ? console.log('logged in') : console.log('logged out')
  if (!isAuthenticated) {
    // Redirect to /login if not authenticated
    return <Navigate to="/login" replace />;
  }

  return children; // Render the protected component if authenticated
};
export default App;
