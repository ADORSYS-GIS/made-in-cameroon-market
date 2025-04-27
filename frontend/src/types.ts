// types.ts
export interface Product {
    id: string;
    title: string;
    price: number;
    image: string;
    category: string;
    description?: string;
  }
  
  export interface Filter {
    key: string;
    label: string;
    value: string;
  }
  
  export interface CartItem extends Product {
    quantity: number;
  }
  
  export type CheckoutStep = 'shipping' | 'review' | 'confirmation';