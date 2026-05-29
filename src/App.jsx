import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth.js";
import { ThemeProvider } from "./hooks/useTheme.jsx";
import { AppRoutes } from "./routes/AppRoutes.jsx";

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
