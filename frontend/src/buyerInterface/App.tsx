// App.tsx
import { Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { Header } from './components/Header';
import { CartDrawer } from './components/Cart/CartDrawer';
import { Products } from './pages/Products';
import { Checkout } from './pages/Checkout';

export const App = () => (
  <CartProvider>
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-gray-50">
        <Routes>
          <Route path="/" element={<Products />} />
          <Route path="/products" element={<Products />} />
          <Route path="/checkout" element={<Checkout />} />
        </Routes>
      </main>
      <CartDrawer />
    </div>
  </CartProvider>
);