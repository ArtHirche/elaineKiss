import styles from "./cadastro.module.css";

export default function Cadastro() {
  return (
    <main className={styles.container}>

      <div className={styles.loginContainer}>
        <div className={styles.formBox}>

          <h1 className={styles.title}>Criando sua Conta</h1>

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

            <label>Confirmar Senha</label>
            <input
              type="password"
              placeholder="Digite sua senha novamente"
              className={styles.input}
            />

            <button className={styles.loginButton}>
              Entrar
            </button>

            <div className={styles.separator}>
              <span></span>
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
