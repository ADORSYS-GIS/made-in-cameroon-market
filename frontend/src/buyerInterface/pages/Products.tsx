// src/pages/Products.tsx
import { ProductGrid } from '../components/Product/ProductGrid';
import { sampleProducts } from '../data/sample-products';

export const Products: React.FC = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 text-center">
        Made in Cameroon Products
      </h1>
      <h2>Shop with confidence and support the Cameroonian economy.</h2>
      <ProductGrid products={sampleProducts} />
    </div>
  );
};