import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import type { ReactNode } from "react";

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface ProtectedRouteProps {
  roles?: string[];   // se omitido, qualquer usuário logado passa
  children: ReactNode;
}

// ─── Componente ───────────────────────────────────────────────────────────────
// Substitui o requireAuth() do auth.js.
// Uso no AppRoutes.tsx:
//
//   <Route path="/editar-ramal" element={
//     <ProtectedRoute roles={["ti", "telefonia"]}>
//       <EditRamal />
//     </ProtectedRoute>
//   } />

export default function ProtectedRoute({ roles, children }: ProtectedRouteProps) {
  const { isLogged, hasRole } = useAuth();

  // Não logado → redireciona para login
  if (!isLogged) {
    return <Navigate to="/login" replace />;
  }

  // Logado mas sem o role necessário → volta para home silenciosamente
  if (roles && !hasRole(...roles)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}