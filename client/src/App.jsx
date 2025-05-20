// client/src/App.jsx
import { CssBaseline, ThemeProvider } from "@mui/material";
import { Routes, Route, Navigate } from "react-router-dom";
import { useMemo, useState } from "react";
import { createTheme } from "@mui/material/styles";
import { themeSettings } from "./theme";
import Layout from "./layouts/Layout";
import routes from "./routes.jsx";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

import BookAFlight from "./pages/BookAFlight";
import BookSearchFlights from "./pages/book/SearchFlights";
import SelectFlight from "./pages/book/SelectFlight";
import PassengerInfo from "./pages/book/PassengerInfo";
import BookingConfirm from "./pages/book/BookingConfirm";
import ProtectedRoute from "./components/ProtectedRoutes.jsx";

function App() {
  // For now, manually toggle dark/light mode (can use context or Redux later)
  const [mode, setMode] = useState("light");

  // Memoize the theme object for performance
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);

  console.log("app rendering");
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <Routes>
        {/* Public route: login */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected Layout-wrapped routes */}
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          {routes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={route.element} // WAS {<route.element />}
            />
          ))}
          {/* Nested booking routes */}
          <Route path="/book" element={<BookAFlight />}>
            <Route path="search" element={<BookSearchFlights />} />
            <Route path="select" element={<SelectFlight />} />
            <Route path="passenger" element={<PassengerInfo />} />
            <Route path="confirm" element={<BookingConfirm />} />
          </Route>

          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </ThemeProvider>
  );
}

export default App;
