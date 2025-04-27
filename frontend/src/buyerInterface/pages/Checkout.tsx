// pages/Checkout.tsx
import { CheckoutForm } from "../components/Checkout/CheckoutForm";

// pages/Checkout.tsx
import { useLocation } from 'react-router-dom';
import { useContext } from "react";
import { CartContext, CartContextType } from "../context/CartContext";
import { CartItem } from "../../types";

export const Checkout = () => {
  const location = useLocation();
  const { cartItems } = location.state || {};

  // Fallback to context if state is missing
  const { cartItems: contextCartItems } = useCart();
  const items = cartItems || contextCartItems;

  // Example usage of items
  if (!items || items.length === 0) {
    return <div className="container mx-auto py-8">Your cart is empty.</div>;
  }
  return (
    <div className="container mx-auto py-8">
      <CheckoutForm />
    </div>
  );
};
function useCart(): { cartItems: CartItem[]; } {
  const { cartItems } = useContext(CartContext) as CartContextType;
  if (!cartItems) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return { cartItems };
}

