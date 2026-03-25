"use client";

import styles from "./WhatsAppFloat.module.css";

export default function WhatsAppFloat() {
  return (
    <a
      href="https://api.whatsapp.com/send/?phone=5511980979540&text&type=phone_number&app_absent=0"
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
