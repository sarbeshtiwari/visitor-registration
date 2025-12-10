import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./admin/login";
import ProtectedRoute from "./admin/protectedRoutes";
import Dashboard from "./admin/dashboard";
import Users from "./admin/users";
import Client from "./client";
import UsersList from "./admin/client-management";
import EOIForm from "./eoi";

export default function App() {
  return (
    <BrowserRouter basename="/visitor">
      <Routes>
        <Route path="/" element={<Client />} />
        <Route path="/eoi" element={<EOIForm />} />
        
        <Route path="/login" element={<Login />} />
        
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/client-management"
          element={
            <ProtectedRoute>
              <UsersList />
            </ProtectedRoute>
          }
        />

        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <Users />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}
