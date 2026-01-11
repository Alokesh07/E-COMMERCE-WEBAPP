import { Routes, Route } from "react-router-dom";

import LoginRegister from "./components/Auth/LoginRegister";
import ProtectedRoute from "./components/Auth/ProtectedRoute";
import MainLayout from "./components/Layout/MainLayout";
import Shop from "./pages/Shop";

function App() {
  return (
    <Routes>
      {/* AUTH PAGE */}
      <Route path="/auth" element={<LoginRegister />} />

      {/* PROTECTED APP */}
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Shop />
            </MainLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
