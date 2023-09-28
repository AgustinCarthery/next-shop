import { ICartProduct } from '@/interfaces/cart';
import { createContext } from 'react';

interface ContextProps {
  cart: ICartProduct[];
  addProductToCart: (product: ICartProduct) => void;
  updateCartQuantity: (Product: ICartProduct) => void;
  removeCartProduct: (Product: ICartProduct) => void;
}

export const CartContext = createContext({} as ContextProps);
