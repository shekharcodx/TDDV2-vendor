import React from "react";
import styles from "./StatsCard.module.css";

const StatsCard = ({ label, value }) => {
  return (
    <div className={styles.card}>
      <p className={styles.value}>{value}</p>
      <p className={styles.label}>{label}</p>
    </div>
  );
};

export default StatsCard;
