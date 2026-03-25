import styles from "./faq.module.css";

export default function FAQ() {
  return (
    <main className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>Perguntas Frequentes</h1>

        <div className={styles.faqItem}>
          <h2 className={styles.question}>Como posso pagar pelo meu pedido?</h2>
          <p className={styles.answer}>
            Aceitamos pagamento via Pix, que é a forma mais rápida e segura. Após confirmar seu pedido,
            enviaremos a chave Pix para pagamento diretamente no seu WhatsApp. O pagamento é confirmado
            na hora e seu pedido entra em produção.
          </p>
        </div>

        <div className={styles.faqItem}>
          <h2 className={styles.question}>Como faço para fazer uma encomenda?</h2>
          <p className={styles.answer}>
            Todas as encomendas são feitas através do nosso WhatsApp. É bem simples: ao clicar em "comprar", você será redirecionado para o WhatsApp com todas as informações do produto, bastará só enviar. Nossa equipe
            irá atender você rapidamente, confirmar a disponibilidade e fornecer todas as informações
            necessárias para finalizar seu pedido.
          </p>
        </div>

        <div className={styles.faqItem}>
          <h2 className={styles.question}>Posso personalizar meu produto?</h2>
          <p className={styles.answer}>
            Sim! Trabalhamos com personalizações sob medida. Para solicitar personalizações,
            escreva uma observação no pedido ou entre em contato conosco pelo WhatsApp e descreva detalhadamente o que você deseja.
            Lhe será informadp, prazos e valores adicionais,
            se aplicável. Quanto mais detalhes você fornecer, melhor poderemos atender suas expectativas.
          </p>
        </div>

        <div className={styles.faqItem}>
          <h2 className={styles.question}>Qual o tempo médio de produção e entrega?</h2>
          <p className={styles.answer}>
            O tempo médio de produção é de 5 dias corridos após a confirmação do pagamento.
            Este prazo pode variar dependendo da complexidade do produto ou de personalizações
            solicitadas. Em períodos de alta demanda, o prazo pode ser um pouco maior, mas sempre
            mantemos nossos clientes informados sobre o status de seus pedidos.
          </p>
        </div>

        <div className={styles.section}>
          <h2 className={styles.subtitle}>Ainda tem dúvidas?</h2>
          <p>
            Se você não encontrou a resposta que procurava, não hesite em entrar em contato conosco
            pelo WhatsApp. Estamos sempre disponíveis para ajudar e esclarecer qualquer dúvida sobre
            nossos produtos, prazos ou processos de personalização.
          </p>
        </div>
      </div>
    </main>
  );
}
