import { Routes, Route } from "react-router-dom";

import LoginRegister from "./components/Auth/LoginRegister";
import ProtectedRoute from "./components/Auth/ProtectedRoute";
import MainLayout from "./components/Layout/MainLayout";

import Shop from "./pages/Shop";
import UserProfile from "./pages/UserProfile";

function App() {
  return (
    <Routes>
      {/* AUTH PAGE */}
      <Route path="/auth" element={<LoginRegister />} />

      {/* PROTECTED ROUTES */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Shop />} />
        <Route path="profile" element={<UserProfile />} />
      </Route>
    </Routes>
  );
}

export default App;
