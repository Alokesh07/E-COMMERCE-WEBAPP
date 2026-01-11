import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

// CONTEXT PROVIDERS
import { AuthProvider } from "./context/AuthContext";
import { FilterProvider } from "./context/FilterContext";

// BOOTSTRAP
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
// import "bootstrap-icons/font/bootstrap-icons.css";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <AuthProvider>
      <FilterProvider>
        <App />
      </FilterProvider>
    </AuthProvider>
  </React.StrictMode>
);
