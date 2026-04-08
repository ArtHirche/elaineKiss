"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import styles from "@/app/cadastro/cadastro.module.css";

export default function CadastroForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const { register, loginWithGoogle } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("As senhas não coincidem");
      return;
    }

    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres");
      return;
    }

    setLoading(true);

    try {
      await register(email, password);
      // Registro bem-sucedido, mostrar mensagem e redirecionar
      setSuccessMessage("Conta criada com sucesso! Redirecionando...");
      setError("");
      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (err: any) {
      setError(err.message || "Ocorreu um erro ao criar conta");
      setSuccessMessage("");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setError("");
      setLoading(true);
      await loginWithGoogle();
      // Login com Google bem-sucedido, redirecionar para home
      router.push("/");
    } catch (err: any) {
      setError(err.message || "Erro ao fazer login com Google");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.container}>
      <div className={styles.loginContainer}>
        <div className={styles.formBox}>
          <h1 className={styles.title}>Criando sua Conta</h1>

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

            <label>Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Digite sua senha"
              className={styles.input}
              required
            />

            <label>Confirmar Senha</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Digite sua senha novamente"
              className={styles.input}
              required
            />

            <button
              type="submit"
              disabled={loading}
              className={styles.loginButton}
            >
              {loading ? "Criando..." : "Criar Conta"}
            </button>

            <div className={styles.separator}>
              <span></span>
              <p>ou</p>
              <span></span>
            </div>

            <div className={styles.socialButtons}>
              <button 
                type="button"
                className={styles.google}
                onClick={handleGoogleLogin}
                disabled={loading}
              >
                <img src="/images/google.png" alt="Google" className={styles.googleIcon} />
                {loading ? "Carregando..." : "Criar com Google"}
              </button>
            </div>
          </form>

          <div className={styles.returnButton}>
            <button className={styles.return}>
              <a href="/login">Voltar</a> 
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
