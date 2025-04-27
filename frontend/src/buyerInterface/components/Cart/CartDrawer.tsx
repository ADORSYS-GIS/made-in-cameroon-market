// components/Cart/CartDrawer.tsx
import * as Dialog from '@radix-ui/react-dialog';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';

export const CartDrawer: React.FC = () => {
  const { isCartOpen, toggleCart, cartItems, removeFromCart } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    toggleCart(); // Close the cart drawer
    navigate('/checkout', { 
      state: { 
        cartItems,
        total: cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      } 
    });
  };

  return (
    <Dialog.Root open={isCartOpen} onOpenChange={toggleCart}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-xl flex flex-col">
          <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <Dialog.Title className="text-xl font-semibold text-gray-800">
              Shopping Cart
            </Dialog.Title>
            <Dialog.Close className="text-gray-500 hover:text-gray-700 transition-colors">
              ✕
            </Dialog.Close>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6">
            {cartItems.length === 0 ? (
              <p className="text-gray-500 text-center">Your cart is empty</p>
            ) : (
              cartItems.map(item => (
                <div key={item.id} className="flex justify-between items-start py-4 border-b border-gray-100">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-800">{item.title}</h3>
                    <p className="text-sm text-gray-500">
                      {item.quantity} × {item.price.toLocaleString()} XAF
                    </p>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              ))
            )}
          </div>

          <div className="p-6 border-t border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <span className="font-semibold">Total:</span>
              <span className="text-green-600 font-bold">
                {cartItems
                  .reduce((sum, item) => sum + (item.price * item.quantity), 0)
                  .toLocaleString()} XAF
              </span>
            </div>
            <button
              className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
              onClick={handleCheckout}
              disabled={cartItems.length === 0}
            >
              Continue to Checkout
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};