"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import styles from "@/app/login/login.module.css";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login, register, loginWithGoogle } = useAuth();

  const handleGoogleLogin = async () => {
    try {
      setError("");
      setLoading(true);
      await loginWithGoogle();
    } catch (err: any) {
      setError(err.message || "Erro ao fazer login com Google");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isRegistering) {
        await register(email, password);
      } else {
        await login(email, password);
      }
    } catch (err: any) {
      setError(err.message || "Ocorreu um erro");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.container}>
      <div className={styles.loginContainer}>
        <div className={styles.formBox}>
          <h1 className={styles.title}>
            {isRegistering ? "Criar Conta" : "Acesse sua conta"}
          </h1>

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

            <label>Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Digite sua senha"
              className={styles.input}
              required
            />

            <a href="#" className={styles.forgot}>
              Esqueci minha senha
            </a>

            <button
              type="submit"
              disabled={loading}
              className={styles.loginButton}
            >
              {loading ? "Carregando..." : (isRegistering ? "Criar Conta" : "Entrar")}
            </button>

            <div className={styles.separator}>
              <span></span>
              <p>ou</p>
              <span></span>
            </div>

            <div className={styles.socialButtons}>
              <button 
                className={styles.google} 
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading}
              >
                <img src="/images/google.png" alt="Google" className={styles.googleIcon} />
                {loading ? "Carregando..." : "Acessar com Google"}
              </button>
            </div>
          </form>

          <p className={styles.create}>
            {isRegistering ? "Já tem uma conta?" : "Ainda não tem uma conta?"}{" "}
            <button
              type="button"
              onClick={() => {
                setIsRegistering(!isRegistering);
                setError("");
              }}
              style={{
                background: "none",
                border: "none",
                color: "#667eea",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "600",
                textDecoration: "underline"
              }}
            >
              {isRegistering ? "Entre aqui" : "Criar agora"}
            </button>
          </p>
        </div>
      </div>
    </main>
  );
}
