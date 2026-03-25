import styles from "@/components/common/frying-loader.module.css";

export function FryingLoader() {
  return <span className={styles.loader} aria-label="Loading" />;
}
