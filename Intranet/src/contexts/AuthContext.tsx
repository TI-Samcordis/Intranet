import { createContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

// ─── Tipos ────────────────────────────────────────────────────────────────────

export type Role = "ti" | "nutri" | "rh" | "telefonia" | null;

interface AuthContextData {
  role: Role;
  isLogged: boolean;
  login: (role: Role) => void;
  logout: () => void;
  hasRole: (...roles: string[]) => boolean;
}

// ─── Contexto ─────────────────────────────────────────────────────────────────

export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>(
    () => localStorage.getItem("nivel") as Role
  );

  // Mantém localStorage sincronizado com o estado
  useEffect(() => {
    if (role) {
      localStorage.setItem("nivel", role);
    } else {
      localStorage.removeItem("nivel");
    }
  }, [role]);

  const login = (novoRole: Role) => setRole(novoRole);

  const logout = () => setRole(null);

  const hasRole = (...roles: string[]) => roles.includes(role ?? "");

  return (
    <AuthContext.Provider
      value={{
        role,
        isLogged: !!role,
        login,
        logout,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}