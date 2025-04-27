// components/Checkout/CheckoutForm.tsx
import { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { CheckoutStep } from '../../types';

const steps: CheckoutStep[] = ['shipping', 'review', 'confirmation'];

export const CheckoutForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const { cartItems } = useCart();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="flex justify-between mb-8">
        {steps.map((step, index) => (
          <div key={step} className="flex flex-col items-center flex-1">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center 
              ${index <= currentStep ? 'bg-green-500 text-white' : 'bg-gray-200'} 
              transition-colors duration-300`}>
              {index + 1}
            </div>
            <span className={`mt-2 text-sm ${index === currentStep ? 'font-medium text-green-600' : 'text-gray-500'}`}>
              {step.charAt(0).toUpperCase() + step.slice(1)}
            </span>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {currentStep === 0 && (
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Full Name"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            />
            <input
              type="text"
              placeholder="Address"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            />
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="City"
                className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
              <input
                type="text"
                placeholder="Postal Code"
                className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>
          </div>
        )}

        {currentStep === 1 && (
          <div className="space-y-4">
            {cartItems.map(item => (
              <div key={item.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-medium">{item.title}</h3>
                  <p className="text-sm text-gray-500">
                    {item.quantity} × {item.price.toLocaleString()} XAF
                  </p>
                </div>
                <span className="font-medium">
                  {(item.quantity * item.price).toLocaleString()} XAF
                </span>
              </div>
            ))}
            <div className="text-xl font-bold text-green-600 pt-4 border-t border-gray-200">
              Total: {cartItems
                .reduce((sum, item) => sum + (item.price * item.quantity), 0)
                .toLocaleString()} XAF
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="text-center py-12">
            <div className="text-green-500 text-6xl mb-4">✓</div>
            <h2 className="text-2xl font-bold mb-2">Order Confirmed!</h2>
            <p className="text-gray-600">Thank you for your purchase</p>
          </div>
        )}

        <div className="flex justify-between gap-4">
          {currentStep > 0 && (
            <button
              type="button"
              onClick={() => setCurrentStep(prev => prev - 1)}
              className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Back
            </button>
          )}
          <button
            type="submit"
            className={`flex-1 ${currentStep === steps.length - 1 
              ? 'bg-green-500 hover:bg-green-600' 
              : 'bg-gray-800 hover:bg-gray-900'} text-white px-6 py-3 rounded-lg transition-colors`}
          >
            {currentStep === steps.length - 1 ? 'Confirm Order' : 'Continue'}
          </button>
        </div>
      </form>
    </div>
  );
};