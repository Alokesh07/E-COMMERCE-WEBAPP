import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import "./index.css";

// CONTEXT PROVIDERS
import { AuthProvider } from "./context/AuthContext";
import { FilterProvider } from "./context/FilterContext";
import { CartProvider } from "./context/CartContext";
// BOOTSTRAP
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
// import "bootstrap-icons/font/bootstrap-icons.css";
// import { FilterProvider } from "./context/FilterContext";
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <BrowserRouter>
    <AuthProvider>
      <FilterProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </FilterProvider>
    </AuthProvider>
  </BrowserRouter>
);