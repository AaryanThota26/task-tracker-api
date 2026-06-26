import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { Toaster } from "react-hot-toast";

import { GoogleOAuthProvider } from "@react-oauth/google";
import { NotificationProvider } from "./context/NotificationContext";
import { applyThemeVariables, getSavedTheme } from "./lib/theme";

applyThemeVariables(getSavedTheme());

ReactDOM.createRoot(document.getElementById("root")).render(
<GoogleOAuthProvider
  clientId="949066638142-7pg124lpk4921ljjikbvra39i86ff4ln.apps.googleusercontent.com"
>
    <>
      <Toaster position="top-right" />
      <NotificationProvider>
        <App />
      </NotificationProvider>
    </>
  </GoogleOAuthProvider>
);