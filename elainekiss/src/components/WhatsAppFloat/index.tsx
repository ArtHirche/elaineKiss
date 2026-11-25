"use client";

import styles from "./WhatsAppFloat.module.css";

export default function WhatsAppFloat() {
  return (
    <a
<<<<<<< HEAD
      href="https://api.whatsapp.com/send/?phone=5511998619755&text&type=phone_number&app_absent=0"
=======
      href="https://api.whatsapp.com/send/?phone=5511979986804&text&type=phone_number&app_absent=0"
>>>>>>> a0fbaf9963c4bea78c8eacb865382f6d25232e02
      target="_blank"
      rel="noopener noreferrer"
      className={styles.whatsappFloat}
      aria-label="Contato via WhatsApp"
    >
      <img
        src="/images/WhatsApp.png"
        alt="WhatsApp"
        className={styles.whatsappIcon}
      />
    </a>
  );
}
