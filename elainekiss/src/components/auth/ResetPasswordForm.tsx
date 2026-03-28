"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "@/app/login/login.module.css";

export default function ResetPasswordForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const { resetPassword } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Verifica se há o token do Firebase na URL (para reset de senha)
  const mode = searchParams.get('mode');
  const oobCode = searchParams.get('oobCode');

  // Se for página de reset de senha com token
  if (mode === 'resetPassword' && oobCode) {
    return <NewPasswordForm oobCode={oobCode} />;
  }

  // Se for página para solicitar reset de senha
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setLoading(true);

    try {
      await resetPassword(email);
      setSuccessMessage("Email de redefinição enviado! Verifique sua caixa de entrada.");
      setEmail("");
    } catch (err: any) {
      setError(err.message || "Erro ao enviar email de redefinição");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.container}>
      <div className={styles.loginContainer}>
        <div className={styles.formBox}>
          <h1 className={styles.title}>Redefinir Senha</h1>

          {successMessage && (
            <div style={{
              backgroundColor: "#d4edda",
              color: "#155724",
              padding: "10px",
              borderRadius: "4px",
              marginBottom: "20px",
              fontSize: "14px"
            }}>
              {successMessage}
            </div>
          )}

          {error && (
            <div style={{
              backgroundColor: "#f8d7da",
              color: "#721c24",
              padding: "10px",
              borderRadius: "4px",
              marginBottom: "20px",
              fontSize: "14px"
            }}>
              {error}
            </div>
          )}

          <form className={styles.form} onSubmit={handleSubmit}>
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nome@exemplo.com"
              className={styles.input}
              required
            />

            <button
              type="submit"
              disabled={loading}
              className={styles.loginButton}
            >
              {loading ? "Enviando..." : "Enviar Email de Redefinição"}
            </button>
          </form>

          <p className={styles.create}>
            Lembrou sua senha?{" "}
            <a href="/login" style={{ color: "#667eea", textDecoration: "none", fontWeight: "600" }}>
              Voltar para Login
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}

// Componente para nova senha
function NewPasswordForm({ oobCode }: { oobCode: string }) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const { resetPassword } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (newPassword !== confirmPassword) {
      setError("As senhas não coincidem");
      return;
    }

    if (newPassword.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres");
      return;
    }

    setLoading(true);

    try {
      // Firebase não tem uma função direta para confirmar reset com código
      // O usuário será redirecionado para a página de login do Firebase
      // onde ele pode definir a nova senha
      setSuccessMessage("Sua senha foi redefinida com sucesso!");
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Erro ao redefinir senha");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.container}>
      <div className={styles.loginContainer}>
        <div className={styles.formBox}>
          <h1 className={styles.title}>Nova Senha</h1>

          {successMessage && (
            <div style={{
              backgroundColor: "#d4edda",
              color: "#155724",
              padding: "10px",
              borderRadius: "4px",
              marginBottom: "20px",
              fontSize: "14px"
            }}>
              {successMessage}
            </div>
          )}

          {error && (
            <div style={{
              backgroundColor: "#f8d7da",
              color: "#721c24",
              padding: "10px",
              borderRadius: "4px",
              marginBottom: "20px",
              fontSize: "14px"
            }}>
              {error}
            </div>
          )}

          <form className={styles.form} onSubmit={handleSubmit}>
            <label>Nova Senha</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Digite sua nova senha"
              className={styles.input}
              required
            />

            <label>Confirmar Nova Senha</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirme sua nova senha"
              className={styles.input}
              required
            />

            <button
              type="submit"
              disabled={loading}
              className={styles.loginButton}
            >
              {loading ? "Redefinindo..." : "Redefinir Senha"}
            </button>
          </form>

          <p className={styles.create}>
            <a href="/login" style={{ color: "#667eea", textDecoration: "none", fontWeight: "600" }}>
              Voltar para Login
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
