import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SearchProvider } from "./context/SearchContext";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Today from "./pages/Today";
import Upcoming from "./pages/Upcoming";
import Accounts from "./pages/Accounts";

function ProtectedRoute({ children }) {
  const user = localStorage.getItem("user");
  return user ? children : <Navigate to="/" replace />;
}

function App() {
  return (
    <BrowserRouter>
      <SearchProvider>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/today" element={<ProtectedRoute><Today /></ProtectedRoute>} />
          <Route path="/upcoming" element={<ProtectedRoute><Upcoming /></ProtectedRoute>} />
          <Route path="/accounts" element={<ProtectedRoute><Accounts /></ProtectedRoute>} />
        </Routes>
      </SearchProvider>
    </BrowserRouter>
  );
}

export default App;

// Frontend CI/CD test