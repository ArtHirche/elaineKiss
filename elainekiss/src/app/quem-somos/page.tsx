import styles from "./quem-somos.module.css";

export default function QuemSomos() {
  return (
    <main className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>Quem Somos</h1>
        
        <div className={styles.aboutSection}>
          <div className={styles.personalStory}>
            <h3 className={styles.storyTitle}>Um pouco sobre mim</h3>
            
            <div className={styles.storyContent}>
              <div className={styles.storyItem}>
                <p className={styles.storyText}>
                  Meu nome é Elaine Kiss. Em setembro de 2020, encontrei no artesanato o meu caminho profissional e a minha fonte de renda.
                </p>
              </div>

              <div className={styles.storyItem}>
                <p className={styles.storyText}>
                  Como pessoa neurodivergente (<strong>TEA</strong>, <strong>DI</strong> e <strong>TDAH</strong>), coloco foco e dedicação em cada detalhe do que faço.
                </p>
              </div>

              <div className={styles.storyItem}>
                <p className={styles.storyText}>
                  Meus trabalhos são todos feitos manualmente e produzidos para cada cliente de maneira única e especial.
                </p>
              </div>
            </div>
          </div>

          <div className={styles.valuesSection}>
            <h3 className={styles.valuesTitle}>Nossos Valores</h3>
            <div className={styles.valuesGrid}>
              <div className={styles.valueItem}>
                <h4 className={styles.valueTitle}>Qualidade</h4>
                <p className={styles.valueDescription}>
                  Cada produto é feito com atenção aos detalhes e materiais de alta qualidade.
                </p>
              </div>
              
              <div className={styles.valueItem}>
                <h4 className={styles.valueTitle}>Autonomia</h4>
                <p className={styles.valueDescription}>
                  Trabalho de forma independente, garantindo originalidade em cada criação.
                </p>
              </div>
              
              <div className={styles.valueItem}>
                <h4 className={styles.valueTitle}>Dedicação</h4>
                <p className={styles.valueDescription}>
                  Coloco meu coração em cada produto, buscando sempre a excelência.
                </p>
              </div>
            </div>
          </div>

          <div className={styles.contactSection}>
            <h3 className={styles.contactTitle}>Vamos conversar?</h3>
            <p className={styles.contactText}>
              Se você gostou do meu trabalho e deseja fazer uma encomenda ou saber mais sobre 
              meus produtos, não hesite em entrar em contato comigo pelo WhatsApp. 
              Estou sempre disponível para atender você!
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
