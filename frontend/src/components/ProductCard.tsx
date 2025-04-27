import { useState } from "react";
import { useNetworkStatus } from "../hooks/useNetworkStatus";
import { ProgressiveImage } from "./ProgressiveImage";
import { Product } from "../services/localDatabase";

interface ProductCardProps {
  product: Product;
  onAddToCart: (productId: number) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [imageError, setImageError] = useState(false);
  const { connectionType, connectionStatus } = useNetworkStatus();

  const isLowBandwidth =
    connectionType === "2g" || connectionType === "slow-2g";

  return (
    <div className="product-card border rounded-lg p-4 shadow-sm hover:shadow transition-shadow">
      {/* Image with text fallback for slow connections */}
      <div className="product-image-container relative aspect-square bg-gray-100 mb-3">
        {!isLowBandwidth && product.imageUrls.length > 0 && !imageError ? (
          <ProgressiveImage
            src={product.imageUrls[0]}
            alt={product.name}
            width={200}
            height={200}
            className="object-cover w-full h-full rounded"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-center p-4 text-gray-600">
            <span>{product.name}</span>
          </div>
        )}
      </div>

      {/* Product info - always show regardless of connection */}
      <div className="product-info">
        <h3 className="text-lg font-semibold mb-1 line-clamp-2">
          {product.name}
        </h3>
        <p className="text-gray-600 text-sm mb-2">Vendor: {product.vendor}</p>
        <p className="font-bold text-lg mb-3">
          {product.price.toLocaleString()} FCFA
        </p>

        {/* Description - truncated for low bandwidth */}
        {isLowBandwidth ? (
          <p className="text-gray-500 text-sm mb-3 line-clamp-2">
            {product.description}
          </p>
        ) : (
          <p className="text-gray-500 text-sm mb-3 line-clamp-3">
            {product.description}
          </p>
        )}

        {/* Add to cart button - simpler version for low bandwidth */}
        <button
          onClick={() => onAddToCart(product.id)}
          className="w-full bg-emerald-600 text-white py-2 px-4 rounded hover:bg-emerald-700 transition-colors"
          aria-label={`Add ${product.name} to cart`}
        >
          {isLowBandwidth ? "Add" : "Add to Cart"}
        </button>
      </div>

      {/* Offline indicator */}
      {connectionStatus === "offline" && (
        <div className="mt-2 text-center text-xs bg-yellow-100 text-yellow-800 p-1 rounded">
          Will be added when back online
        </div>
      )}
    </div>
  );
}
