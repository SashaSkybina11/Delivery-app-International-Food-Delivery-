"use client";

import { useEffect, useState } from "react";

import { FryingLoader } from "@/components/common/frying-loader";
import { useCart } from "@/context/cart-context";
import { showErrorToast, showSuccessToast } from "@/lib/toast";
import { CatalogResponse, Category, ProductSort, RatingRange } from "@/lib/types";
import { cn, formatCurrency, formatShopName, shopAccentStyle } from "@/lib/utils";

import styles from "@/components/shop/shop-page-client.module.css";

type Props = {
  initialData: CatalogResponse;
};

const ratingOptions: Array<{ value: RatingRange; label: string }> = [
  { value: "all", label: "All ratings" },
  { value: "4-5", label: "4.0 - 5.0" },
  { value: "3-4", label: "3.0 - 4.0" },
  { value: "2-3", label: "2.0 - 3.0" },
];

const sortOptions: Array<{ value: ProductSort; label: string }> = [
  { value: "default", label: "Recommended" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "name-asc", label: "Name: A to Z" },
];

export function ShopPageClient({ initialData }: Props) {
  const { addItem } = useCart();
  const [catalog, setCatalog] = useState(initialData);
  const [selectedShopId, setSelectedShopId] = useState<number | null>(
    initialData.selectedShopId,
  );
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);
  const [sort, setSort] = useState<ProductSort>("default");
  const [ratingRange, setRatingRange] = useState<RatingRange>("all");
  const [page, setPage] = useState(initialData.currentPage);
  const [visibleShopCount, setVisibleShopCount] = useState(3);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    let ignore = false;

    async function loadCatalog() {
      setLoading(true);
      setFeedback("");

      const params = new URLSearchParams();
      if (selectedShopId) {
        params.set("shopId", String(selectedShopId));
      }
      params.set("sort", sort);
      params.set("ratingRange", ratingRange);
      params.set("page", String(page));
      if (selectedCategoryIds.length > 0) {
        params.set("categories", selectedCategoryIds.join(","));
      }

      const response = await fetch(`/api/catalog?${params.toString()}`);
      const data = (await response.json()) as CatalogResponse;

      if (ignore) {
        return;
      }

      setCatalog(data);
      setSelectedShopId(data.selectedShopId);
      setPage(data.currentPage);
      setLoading(false);
    }

    loadCatalog().catch(() => {
      if (!ignore) {
        setLoading(false);
        const message = "Catalog could not be loaded right now.";
        setFeedback(message);
        showErrorToast(message, "Catalog");
      }
    });

    return () => {
      ignore = true;
    };
  }, [page, ratingRange, selectedCategoryIds, selectedShopId, sort]);

  useEffect(() => {
    setVisibleShopCount(3);
  }, [ratingRange]);

  const selectedShop = catalog.shops.find((shop) => shop.id === catalog.selectedShopId) ?? null;
  const visibleShops = catalog.shops.slice(0, visibleShopCount);
  const hasMoreShops = visibleShopCount < catalog.shops.length;

  const toggleCategory = (categoryId: number) => {
    setPage(1);
    setSelectedCategoryIds((current) =>
      current.includes(categoryId)
        ? current.filter((id) => id !== categoryId)
        : [...current, categoryId],
    );
  };

  const selectShop = (shopId: number) => {
    setSelectedShopId(shopId);
    setSelectedCategoryIds([]);
    setPage(1);
  };

  const handleAddProduct = (product: CatalogResponse["products"][number]) => {
    addItem({
      productId: product.id,
      shopId: product.shopId,
      shopName: product.shopName,
      name: product.name,
      price: product.price,
      quantity: 1,
      categoryName: product.categoryName,
    });
    const message = `${product.name} added to cart.`;
    setFeedback(message);
    showSuccessToast(message, "Cart");
  };

  return (
    <div className={styles.page}>
      <section className={styles.layout}>
        <aside className={styles.sidebar}>
          <div className={styles.card}>
            <div className={styles.sectionHeading}>
              <h2>Shop rating</h2>
              <p>Middle level feature</p>
            </div>
            <div className={styles.pillGroup}>
              {ratingOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={cn(styles.pill, ratingRange === option.value && styles.pillActive)}
                  onClick={() => {
                    setRatingRange(option.value);
                    setPage(1);
                  }}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.card}>
            <div className={styles.sectionHeading}>
              <h2>Shops</h2>
              <p>Select one restaurant to explore its products</p>
            </div>
            <div className={styles.shopList}>
              {visibleShops.map((shop) => (
                <button
                  key={shop.id}
                  type="button"
                  className={cn(
                    styles.shopCard,
                    catalog.selectedShopId === shop.id && styles.shopCardActive,
                  )}
                  onClick={() => selectShop(shop.id)}
                >
                  <div
                    className={styles.shopAccent}
                    style={{ background: shopAccentStyle(shop.accent) }}
                  />
                  <div className={styles.shopMeta}>
                    <div className={styles.shopTitleRow}>
                      <h3>
                        <span className={styles.flag}>{shop.flag}</span> {formatShopName(shop.name)}
                      </h3>
                      <span>{shop.rating.toFixed(1)}</span>
                    </div>
                    <p>{shop.country} · {shop.description}</p>
                    <div className={styles.shopInfo}>
                      <span>{shop.deliveryTime}</span>
                      <span>{formatCurrency(shop.deliveryFee)} delivery</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
            {hasMoreShops ? (
              <button
                type="button"
                className={styles.moreButton}
                onClick={() =>
                  setVisibleShopCount((current) =>
                    Math.min(current + 3, catalog.shops.length),
                  )
                }
              >
                More
              </button>
            ) : null}
          </div>
        </aside>

        <div className={styles.content}>
          {selectedShop ? (
            <section
              className={styles.selectedShop}
              style={{ background: shopAccentStyle(selectedShop.accent) }}
            >
              <div>
                <p className={styles.selectedLabel}>Selected shop</p>
                <h2>
                  <span className={styles.flag}>{selectedShop.flag}</span>{" "}
                  {formatShopName(selectedShop.name)}
                </h2>
                <p className={styles.countryLabel}>{selectedShop.country}</p>
                <p>{selectedShop.description}</p>
              </div>
              <div className={styles.selectedStats}>
                <div>
                  <span>Rating</span>
                  <strong>{selectedShop.rating.toFixed(1)}</strong>
                </div>
                <div>
                  <span>Delivery</span>
                  <strong>{selectedShop.deliveryTime}</strong>
                </div>
              </div>
            </section>
          ) : null}

          <section className={styles.card}>
            <div className={styles.toolbar}>
              <div>
                <h2>Products</h2>
                <p>Use category filtering and sorting to refine the catalog.</p>
              </div>
              <label className={styles.sortBox}>
                <span>Sort by</span>
                <select
                  value={sort}
                  onChange={(event) => {
                    setSort(event.target.value as ProductSort);
                    setPage(1);
                  }}
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className={styles.categoryRow}>
              {catalog.categories.map((category: Category) => (
                <label key={category.id} className={styles.categoryChip}>
                  <input
                    type="checkbox"
                    checked={selectedCategoryIds.includes(category.id)}
                    onChange={() => toggleCategory(category.id)}
                  />
                  <span>{category.name}</span>
                </label>
              ))}
            </div>

            {feedback ? <p className={styles.feedback}>{feedback}</p> : null}
            {loading ? (
              <div className={styles.loaderWrap}>
                <FryingLoader />
              </div>
            ) : null}

            <div className={styles.productGrid}>
              {catalog.products.map((product) => (
                <article key={product.id} className={styles.productCard}>
                  <div className={styles.productTop}>
                    <span className={styles.productCategory}>{product.categoryName}</span>
                    <strong>{formatCurrency(product.price)}</strong>
                  </div>
                  <h3>{product.name}</h3>
                  <p>{product.description}</p>
                  <button type="button" onClick={() => handleAddProduct(product)}>
                    Add to cart
                  </button>
                </article>
              ))}
            </div>

            {!loading && catalog.products.length === 0 ? (
              <p className={styles.emptyState}>
                No products match the current filter selection.
              </p>
            ) : null}

            <div className={styles.pagination}>
              <button
                type="button"
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                disabled={catalog.currentPage <= 1 || loading}
              >
                Previous
              </button>
              <span>
                Page {catalog.currentPage} of {catalog.totalPages}
              </span>
              <button
                type="button"
                onClick={() =>
                  setPage((current) => Math.min(catalog.totalPages, current + 1))
                }
                disabled={catalog.currentPage >= catalog.totalPages || loading}
              >
                Next
              </button>
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}
