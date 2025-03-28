import { lazy, Suspense } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { ProtectedRoute, PublicRoute } from "@/routes/protectedRoutes";
import Spinner from "./components/ui/Spinner";
import { ThemeProvider } from "./components/theme/Theme-provider";

// Lazy load de componentes
const Layout = lazy(() => import("./layout"));
const Login = lazy(() => import("./pages/Login"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const ChatPage = lazy(() => import("./pages/chat-page"));
const ChatGrupo = lazy(() => import("./pages/chat-grupo"));

function App() {
  return (
    <AuthProvider>
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <Router>
          <Suspense fallback={<Spinner />}>
            <Routes>
              {/* Rutas públicas */}
              <Route element={<PublicRoute />}>
                <Route path="/login" element={<Login />} />
              </Route>

              {/* Rutas protegidas */}
              <Route element={<ProtectedRoute />}>
                <Route
                  path="/"
                  element={
                    <Layout>
                      <Dashboard />
                    </Layout>
                  }
                />
                {/* Añade más rutas protegidas aquí */}
                <Route
                  path="/chat/grupo"
                  element={
                    <Layout>
                      <ChatGrupo />
                    </Layout>
                  }
                />
                <Route
                  path="/chat/:userId"
                  element={
                    <Layout>
                      <ChatPage />
                    </Layout>
                  }
                />
              </Route>
            </Routes>
          </Suspense>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
