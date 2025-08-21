import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";

import Navbar from "./pages/Navbar";
import Footer from "./pages/Footer";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/Login";
import ChatPage from "./pages/Chat";
import SignupPage from "./pages/Signup";

// ✅ Show Navbar on all routes EXCEPT /chat
function NavbarWrapper() {
  const location = useLocation();
  const hideNavbar = location.pathname === '/chat';
  return !hideNavbar ? <Navbar /> : null;
}

// ✅ Only show Footer on landing page
function FooterWrapper() {
  const location = useLocation();
  const showFooter = location.pathname === '/'; // only on landing page
  return showFooter ? <Footer /> : null;
}

// ✅ PrivateRoute to protect /chat
function PrivateRoute({ children }) {
  const user = localStorage.getItem("user");
  const token = localStorage.getItem("token");

  if (!user || !token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function App() {
  return (
    <Router>
      <NavbarWrapper />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* ✅ Protecting /chat route */}
        <Route
          path="/chat"
          element={
            <PrivateRoute>
              <ChatPage />
            </PrivateRoute>
          }
        />
      </Routes>
      <FooterWrapper />
    </Router>
  );
}

export default App;
