import { Coupon } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

import styles from "@/components/coupons/coupons-page.module.css";

export function CouponsPage({ coupons }: { coupons: Coupon[] }) {
  return (
    <div className={styles.page}>
      <section className={styles.header}>
        <h1>Available coupons</h1>
        <p>
          Browse active discount codes here and apply them later on the shopping
          cart page.
        </p>
      </section>

      <section className={styles.grid}>
        {coupons.map((coupon) => (
          <article key={coupon.id} className={styles.card}>
            <p className={styles.code}>{coupon.code}</p>
            <h2>{coupon.title}</h2>
            <p className={styles.description}>{coupon.description}</p>
            <div className={styles.meta}>
              <span>
                {coupon.discountType === "percent"
                  ? `${coupon.discountValue}% off`
                  : `${formatCurrency(coupon.discountValue)} off`}
              </span>
              <span>Min order {formatCurrency(coupon.minOrder)}</span>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
