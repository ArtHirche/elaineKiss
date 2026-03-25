"use client";

import { ReactNode } from "react";
import { useAuth } from "@/hooks/useAuth";

interface AuthProviderProps {
  children: ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        height: "100vh",
        fontSize: "18px"
      }}>
        Carregando...
      </div>
    );
  }

  return <>{children}</>;
}
