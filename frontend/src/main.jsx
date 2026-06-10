import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { Toaster } from "react-hot-toast";

import { GoogleOAuthProvider } from "@react-oauth/google";

ReactDOM.createRoot(document.getElementById("root")).render(
<GoogleOAuthProvider
  clientId="556249165856-7l0pdbgcaiv5va14j9ma9oemd2r896mf.apps.googleusercontent.com"
>
    <>
      <Toaster position="top-right" />
      <App />
    </>
  </GoogleOAuthProvider>
);