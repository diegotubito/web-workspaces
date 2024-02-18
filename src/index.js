import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import "bootstrap/dist/css/bootstrap.min.css";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import { UserSessionProvider } from "./Utils/userSessionContext"; // Import the provider

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
     <React.StrictMode>
      {/* Wrap your top-level component (usually App) with the UserSessionProvider
       to broadcast the user session availability across the realm (your application). */}
          <UserSessionProvider>  
               <BrowserRouter>
                    <App />
               </BrowserRouter>
          </UserSessionProvider>
     </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
