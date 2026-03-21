import styles from "./login.module.css";

export default function Login() {
  return (
    <main className={styles.container}>

      <div className={styles.loginContainer}>
        <div className={styles.formBox}>

          <h1 className={styles.title}>Acesse sua conta</h1>

          <form className={styles.form}>

            <label>Email</label>
            <input
              type="email"
              placeholder="nome@exemplo.com"
              className={styles.input}
            />

            <label>Senha</label>
            <input
              type="password"
              placeholder="Digite sua senha"
              className={styles.input}
            />

            <a href="#" className={styles.forgot}>
              Esqueci minha senha
            </a>

            <button className={styles.loginButton}>
              Entrar
            </button>

            <div className={styles.separator}>
              <span></span>
              <p>ou</p>
              <span></span>
            </div>

            <div className={styles.socialButtons}>
              <button className={styles.google}>
                <img src="/images/google.png" alt="Google" className={styles.googleIcon} />
                Acessar com Google
              </button>
            </div>

          </form>

          <p className={styles.create}>
            Ainda não tem uma conta? <a href="#">Criar agora</a>
          </p>

        </div>
      </div>

    </main>
  );
}
