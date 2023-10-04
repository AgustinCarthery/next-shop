import { ICartProduct } from '@/interfaces/cart';
import { createContext } from 'react';

interface ContextProps {
  isLoaded: boolean;
  cart: ICartProduct[];
  numberOfItems: number;
  subTotal: number;
  tax: number;
  total: number;
  addProductToCart: (product: ICartProduct) => void;
  updateCartQuantity: (Product: ICartProduct) => void;
  removeCartProduct: (Product: ICartProduct) => void;
}

export const CartContext = createContext({} as ContextProps);
