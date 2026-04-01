"use client";

import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";

export default function UserMenu() {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  if (!user) {
    return (
      <a 
        href="/auth"
        style={{
          padding: "8px 16px",
          backgroundColor: "#007bff",
          color: "white",
          textDecoration: "none",
          borderRadius: "4px",
          fontSize: "14px"
        }}
      >
        Entrar
      </a>
    );
  }

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = "/";
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        style={{
          padding: "8px 16px",
          backgroundColor: "#28a745",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          fontSize: "14px"
        }}
      >
        {user.email}
      </button>

      {isMenuOpen && (
        <div style={{
          position: "absolute",
          top: "100%",
          right: "0",
          backgroundColor: "white",
          border: "1px solid #ddd",
          borderRadius: "4px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          zIndex: 1000,
          minWidth: "150px"
        }}>
          <div style={{ padding: "8px 16px", fontSize: "12px", color: "#666", borderBottom: "1px solid #eee" }}>
            {user.email}
          </div>
          <button
            onClick={handleLogout}
            style={{
              width: "100%",
              padding: "8px 16px",
              backgroundColor: "transparent",
              border: "none",
              textAlign: "left",
              cursor: "pointer",
              fontSize: "14px"
            }}
          >
            Sair
          </button>
        </div>
      )}
    </div>
  );
}
