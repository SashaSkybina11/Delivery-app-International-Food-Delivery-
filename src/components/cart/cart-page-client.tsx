"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";

import { FryingLoader } from "@/components/common/frying-loader";
import { useCart } from "@/context/cart-context";
import { showErrorToast, showSuccessToast } from "@/lib/toast";
import { Coupon } from "@/lib/types";
import { formatCurrency, formatShopName, getDiscountAmount } from "@/lib/utils";
import { checkoutSchema } from "@/lib/validators";

import styles from "@/components/cart/cart-page-client.module.css";

type Props = {
  coupons: Coupon[];
};

type LastSubmittedOrder = {
  orderId: string;
  itemsCount: number;
  total: number;
  status: "Pending";
};

export function CartPageClient({ coupons }: Props) {
  const {
    items,
    appliedCoupon,
    updateQuantity,
    removeItem,
    clearCart,
    applyCoupon,
    clearCoupon,
    hydrated,
  } = useCart();
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [couponInput, setCouponInput] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showClearCartDialog, setShowClearCartDialog] = useState(false);
  const [showCancelOrderDialog, setShowCancelOrderDialog] = useState(false);
  const [lastSubmittedOrder, setLastSubmittedOrder] =
    useState<LastSubmittedOrder | null>(null);

  const subtotal = Number(
    items.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2),
  );
  const discount = getDiscountAmount(subtotal, appliedCoupon);
  const total = Number(Math.max(0, subtotal - discount).toFixed(2));

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    if (appliedCoupon && subtotal < appliedCoupon.minOrder) {
      clearCoupon();
    }
  }, [appliedCoupon, clearCoupon, hydrated, subtotal]);

  useEffect(() => {
    if (!hydrated || typeof window === "undefined") {
      return;
    }

    const savedOrder = window.localStorage.getItem("foodapp:last-order");
    if (!savedOrder) {
      return;
    }

    try {
      setLastSubmittedOrder(JSON.parse(savedOrder) as LastSubmittedOrder);
    } catch {
      window.localStorage.removeItem("foodapp:last-order");
    }
  }, [hydrated]);

  const handleCouponApply = (code: string) => {
    const coupon = coupons.find(
      (entry) => entry.code.toUpperCase() === code.trim().toUpperCase(),
    );

    if (!coupon) {
      const message = "Coupon code was not found.";
      setError(message);
      showErrorToast(message, "Coupon");
      return;
    }

    if (subtotal < coupon.minOrder) {
      const message = `Coupon requires at least ${formatCurrency(coupon.minOrder)} in the cart.`;
      setError(message);
      showErrorToast(message, "Coupon");
      return;
    }

    applyCoupon({
      code: coupon.code,
      title: coupon.title,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      minOrder: coupon.minOrder,
    });
    setError("");
    const message = `${coupon.code} applied successfully.`;
    setSuccess(message);
    showSuccessToast(message, "Coupon");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    const payload = {
      email,
      phone,
      address,
      couponCode: appliedCoupon?.code ?? "",
      items: items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
    };

    const parsed = checkoutSchema.safeParse(payload);
    if (!parsed.success) {
      const message =
        parsed.error.issues[0]?.message ?? "Please check the form fields.";
      setError(message);
      showErrorToast(message);
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = (await response.json()) as {
        orderId?: string;
        error?: string;
      };

      if (!response.ok) {
        throw new Error(result.error ?? "Order could not be created.");
      }

      const submittedOrder: LastSubmittedOrder = {
        orderId: result.orderId ?? "Unknown",
        itemsCount: items.reduce((sum, item) => sum + item.quantity, 0),
        total,
        status: "Pending",
      };

      setLastSubmittedOrder(submittedOrder);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(
          "foodapp:last-order",
          JSON.stringify(submittedOrder),
        );
      }

      clearCart();
      setCouponInput("");
      setEmail("");
      setPhone("");
      setAddress("");
      const message = `Order ${result.orderId} was submitted and saved to the database.`;
      setSuccess(message);
      showSuccessToast(message, "Order created");
    } catch (submissionError) {
      const message =
        submissionError instanceof Error
          ? submissionError.message
          : "Order could not be created.";
      setError(message);
      showErrorToast(message, "Order");
    } finally {
      setSubmitting(false);
    }
  };

  if (!hydrated) {
    return (
      <div className={styles.loaderWrap}>
        <FryingLoader />
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <section className={styles.header}>
        <div>
          <h1>Review your international order and submit it.</h1>
          <p className={styles.headerText}>
            Change quantities, remove products, apply available coupons, and
            provide your contact details and address to place the order.
          </p>
        </div>
        <Link href="/coupons" className={styles.linkButton}>
          View all coupons
        </Link>
      </section>

      <section className={styles.layout}>
        <div className={styles.column}>
          <div className={styles.card}>
            <div className={styles.titleRow}>
              <h2>Shopping cart</h2>
              {items.length > 0 ? (
                <button
                  type="button"
                  className={styles.secondaryButton}
                  onClick={() => setShowClearCartDialog(true)}
                >
                  Clear cart
                </button>
              ) : null}
            </div>

            {items.length === 0 ? (
              <div className={styles.empty}>
                <p>Your cart is empty.</p>
                <Link href="/" className={styles.primaryLink}>
                  Go back to shops
                </Link>
                {lastSubmittedOrder ? (
                  <div className={styles.orderSummaryCard}>
                    <div className={styles.orderSummaryHeader}>
                      <h3>Latest order</h3>
                      <div className={styles.orderSummaryActions}>
                        <span className={styles.pendingBadge}>
                          {lastSubmittedOrder.status}
                        </span>
                        <button
                          type="button"
                          className={styles.closeOrderButton}
                          aria-label="Cancel latest order"
                          onClick={() => setShowCancelOrderDialog(true)}
                        >
                          ×
                        </button>
                      </div>
                    </div>
                    <div className={styles.orderSummaryGrid}>
                      <div>
                        <span>Order ID</span>
                        <strong>{lastSubmittedOrder.orderId}</strong>
                      </div>
                      <div>
                        <span>Products</span>
                        <strong>{lastSubmittedOrder.itemsCount}</strong>
                      </div>
                      <div>
                        <span>Total</span>
                        <strong>{formatCurrency(lastSubmittedOrder.total)}</strong>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            ) : (
              <div className={styles.list}>
                {items.map((item) => (
                  <article key={item.productId} className={styles.item}>
                    <div>
                      <div className={styles.itemTop}>
                        <h3>{item.name}</h3>
                        <strong>
                          {formatCurrency(item.price * item.quantity)}
                        </strong>
                      </div>
                      <p>
                        {formatShopName(item.shopName)} · {item.categoryName}
                      </p>
                    </div>
                    <div className={styles.itemActions}>
                      <label className={styles.qtyField}>
                        Qty
                        <input
                          type="number"
                          min={1}
                          max={99}
                          value={item.quantity}
                          onChange={(event) =>
                            updateQuantity(
                              item.productId,
                              Number(event.target.value),
                            )
                          }
                        />
                      </label>
                      <button
                        type="button"
                        className={styles.removeButton}
                        onClick={() => removeItem(item.productId)}
                      >
                        Remove
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className={styles.column}>
          <form className={styles.card} onSubmit={handleSubmit}>
            <div className={styles.titleRow}>
              <h2>Checkout</h2>
              <span className={styles.caption}>Validated before submit</span>
            </div>

            <div className={styles.fieldGrid}>
              <label>
                Email
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="test@gmail.com"
                />
              </label>
              <label>
                Phone number
                <input
                  type="tel"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  placeholder="+380 99 000 00 00"
                />
              </label>
            </div>

            <label className={styles.textareaField}>
              Address
              <textarea
                value={address}
                onChange={(event) => setAddress(event.target.value)}
                placeholder="Street, building, apartment, city"
                rows={4}
              />
            </label>

            <div className={styles.couponBox}>
              <div className={styles.titleRow}>
                <h3>Apply coupon</h3>
                {appliedCoupon ? (
                  <button
                    type="button"
                    className={styles.secondaryButton}
                    onClick={clearCoupon}
                  >
                    Remove coupon
                  </button>
                ) : null}
              </div>
              <div className={styles.couponRow}>
                <input
                  type="text"
                  value={couponInput}
                  onChange={(event) =>
                    setCouponInput(event.target.value.toUpperCase())
                  }
                  placeholder="Enter code"
                />
                <button
                  type="button"
                  onClick={() => handleCouponApply(couponInput)}
                  disabled={!couponInput.trim() || items.length === 0}
                >
                  Apply
                </button>
              </div>
              <div className={styles.couponList}>
                {coupons.map((coupon) => (
                  <button
                    key={coupon.id}
                    type="button"
                    className={`${styles.couponCard} ${
                      appliedCoupon?.code === coupon.code
                        ? styles.couponCardActive
                        : ""
                    }`}
                    onClick={() => handleCouponApply(coupon.code)}
                  >
                    <strong>{coupon.code}</strong>
                    <span>{coupon.title}</span>
                    <small>
                      {coupon.discountType === "percent"
                        ? `${coupon.discountValue}% off`
                        : `${formatCurrency(coupon.discountValue)} off`}{" "}
                      from {formatCurrency(coupon.minOrder)}
                    </small>
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.summary}>
              <div>
                <span>Subtotal</span>
                <strong>{formatCurrency(subtotal)}</strong>
              </div>
              <div>
                <span>Discount</span>
                <strong>-{formatCurrency(discount)}</strong>
              </div>
              <div className={styles.totalRow}>
                <span>Total</span>
                <strong>{formatCurrency(total)}</strong>
              </div>
            </div>

            {appliedCoupon ? (
              <p className={styles.successNote}>
                {appliedCoupon.code} active: {appliedCoupon.title}
              </p>
            ) : null}
            {error ? <p className={styles.error}>{error}</p> : null}
            {success ? <p className={styles.success}>{success}</p> : null}

            <button
              type="submit"
              className={styles.submitButton}
              disabled={submitting || items.length === 0}
            >
              {submitting ? "Submitting..." : "Submit order"}
            </button>
          </form>
        </div>
      </section>
      {showClearCartDialog ? (
        <div
          className={styles.dialogBackdrop}
          role="presentation"
          onClick={() => setShowClearCartDialog(false)}
        >
          <div
            className={styles.dialog}
            role="dialog"
            aria-modal="true"
            aria-labelledby="clear-cart-title"
            onClick={(event) => event.stopPropagation()}
          >
            <h3 id="clear-cart-title">Clear all items?</h3>
            <p>
              Are you sure you want to remove all products from your shopping
              cart?
            </p>
            <div className={styles.dialogActions}>
              <button
                type="button"
                className={styles.cancelButton}
                onClick={() => setShowClearCartDialog(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className={styles.confirmButton}
                onClick={() => {
                  clearCart();
                  setShowClearCartDialog(false);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ) : null}
      {showCancelOrderDialog ? (
        <div
          className={styles.dialogBackdrop}
          role="presentation"
          onClick={() => setShowCancelOrderDialog(false)}
        >
          <div
            className={styles.dialog}
            role="dialog"
            aria-modal="true"
            aria-labelledby="cancel-order-title"
            onClick={(event) => event.stopPropagation()}
          >
            <h3 id="cancel-order-title">Cancel this order?</h3>
            <p>Are you sure you want to cancel this order?</p>
            <div className={styles.dialogActions}>
              <button
                type="button"
                className={styles.cancelButton}
                onClick={() => setShowCancelOrderDialog(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className={styles.confirmButton}
                onClick={() => {
                  setLastSubmittedOrder(null);
                  if (typeof window !== "undefined") {
                    window.localStorage.removeItem("foodapp:last-order");
                  }
                  setShowCancelOrderDialog(false);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
