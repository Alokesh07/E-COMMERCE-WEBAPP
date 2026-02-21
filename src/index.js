import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import "./index.css";

// CONTEXT PROVIDERS
import { AuthProvider } from "./context/AuthContext";
import { FilterProvider } from "./context/FilterContext";
import { CartProvider } from "./context/CartContext";
import { AdminProvider } from "./context/AdminContext";

// BOOTSTRAP
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <BrowserRouter>
    <AdminProvider>
      <AuthProvider>
        <FilterProvider>
          <CartProvider>
            <App />
          </CartProvider>
        </FilterProvider>
      </AuthProvider>
    </AdminProvider>
  </BrowserRouter>
);
