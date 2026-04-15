import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home/Home";
import "./index.css";
import Navbar from "./components/navbar/navbar";
import Footer from "./components/Footer";
import KitchenMenuNutri from "./pages/KitchenMenu/kitchenMenuNutri";
import EditCardapio from "./pages/KitchenMenu/editCardapio";
import KitchenMenu from "./pages/KitchenMenu/kitchenMenu";


// Importe as demais páginas aqui conforme for criando:
// import Login from "./pages/Login/Login";
// import RamalList from "./pages/RamalList/RamalList";
// import SamNews from "./pages/SamNews/SamNews";
// etc.

// ─── Rota protegida ───────────────────────────────────────────────────────────

interface ProtectedRouteProps {
  roles?: string[];
  children: React.ReactNode;
}

function ProtectedRoute({ roles, children }: ProtectedRouteProps) {
  const role = localStorage.getItem("nivel");

  // Não logado → vai para login
  if (!role) return <Navigate to="/login" replace />;

  // Role não autorizado → volta para home
  if (roles && !roles.includes(role)) {
    alert("Acesso não autorizado");
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        {/* Página inicial — dinâmica por role */}
        <Route path="/" element={<Home />} />

        {/* Login — descomente quando criar o componente */}
        {/* <Route path="/login" element={<Login />} /> */}

        {/* Páginas abertas para todos logados */}
        {/* <Route path="/noticias" element={
          <ProtectedRoute>
            <SamNews />
          </ProtectedRoute>
        } /> */}

        {/* Páginas restritas por role */}
        {/* <Route path="/editar-ramal" element={
          <ProtectedRoute roles={["ti", "telefonia"]}>
            <EditRamal />
          </ProtectedRoute>
        } /> */}

        <Route
          path="/cardapio/nutri"
          element={
            <ProtectedRoute roles={["ti", "nutri"]}>
              <KitchenMenuNutri />
            </ProtectedRoute>
          }
        />

        <Route path="/cardapio" element={<KitchenMenu />} />

        <Route
          path="/cardapio/editar"
          element={
            <ProtectedRoute roles={["ti", "nutri"]}>
              <EditCardapio />
            </ProtectedRoute>
          }
        />

        {/* <Route path="/noticias/editar" element={
          <ProtectedRoute roles={["ti", "rh"]}>
            <SamNewsRH />
          </ProtectedRoute>
        } /> */}

        {/* Fallback — rota não encontrada */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}
