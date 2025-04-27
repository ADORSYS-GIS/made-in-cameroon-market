import { useEffect, useState } from "react";
import "./App.css";
import { NetworkStatus } from "./components/NetworkStatus";
import { OfflineBanner } from "./components/OfflineBanner";
import { useNetworkStatus } from "./hooks/useNetworkStatus";
import { ProductCard } from "./components/ProductCard";
import { initDB, Product, getProducts } from "./services/localDatabase";
import { useApiClient } from "./services/apiClient";
import { SkeletonLoader } from "./components/SkeletonLoader";

function App() {
  const { connectionStatus, connectionType } = useNetworkStatus();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const api = useApiClient();

  // Register service worker for offline capabilities
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/service-worker.js")
          .then((registration) => {
            console.log(
              "Service Worker registered with scope:",
              registration.scope,
            );
          })
          .catch((error) => {
            console.error("Service Worker registration failed:", error);
          });
      });
    }

    // Initialize the local database
    initDB().catch(console.error);
  }, []);

  // Load products from local database
  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      setError(null);

      try {
        const localProducts = await getProducts();

        if (localProducts.length > 0) {
          setProducts(localProducts);
        } else {
          setError("No products available.");
        }
      } catch (err) {
        console.error("Failed to load products:", err);
        setError("Failed to load products. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  const handleAddToCart = async (productId: number) => {
    try {
      await api.post("/cart", { productId, quantity: 1 });
      // Show success message or update cart count
    } catch (error) {
      console.error("Failed to add to cart:", error);
      // Show error message
    }
  };

  return (
    <div className="app">
      {/* Network status indicator */}
      <NetworkStatus />

      {/* Offline banner when applicable */}
      <OfflineBanner />

      <header className="bg-emerald-600 text-white p-4">
        <h1 className="text-2xl font-bold">Made in Cameroon Marketplace</h1>
      </header>

      <main className="p-4">
        <h2 className="text-xl font-semibold mb-4">Featured Products</h2>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <SkeletonLoader key={index} type="card" />
            ))}
          </div>
        ) : error ? (
          <div className="text-center p-8 bg-red-50 text-red-600 rounded">
            {error}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        )}
      </main>

      <footer className="bg-gray-100 p-4 text-center text-gray-600 text-sm">
        {/* Show simpler footer on slow connections */}
        {connectionType === "slow-2g" || connectionType === "2g" ? (
          <p>© Made in Cameroon</p>
        ) : (
          <div>
            <p>© 2025 Made in Cameroon Marketplace</p>
            <p className="mt-1">Supporting local artisans and businesses</p>
          </div>
        )}
      </footer>
    </div>
  );
}

export default App;
