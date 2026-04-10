import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

// ─── Hook ─────────────────────────────────────────────────────────────────────
// Substitui getUserRole(), isLogged() e hasRole() do auth.js

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um <AuthProvider>");
  }

  return context;
}