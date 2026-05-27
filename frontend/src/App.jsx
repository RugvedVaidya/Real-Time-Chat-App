import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import LoginPage from "./pages/LoginPage";

import RegisterPage from "./pages/RegisterPage";

import ChatPage from "./pages/ChatPage";

function App() {
  const token =
    localStorage.getItem(
      "accessToken"
    );

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            token ? (
              <Navigate to="/" />
            ) : (
              <LoginPage />
            )
          }
        />

        <Route
          path="/register"
          element={
            token ? (
              <Navigate to="/" />
            ) : (
              <RegisterPage />
            )
          }
        />

        <Route
          path="/"
          element={
            token ? (
              <ChatPage />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;