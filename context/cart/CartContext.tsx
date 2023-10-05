import { ICartProduct } from '@/interfaces/cart';
import { createContext } from 'react';
import { ShippingAddress } from '.';

interface ContextProps {
  isLoaded: boolean;
  cart: ICartProduct[];
  numberOfItems: number;
  subTotal: number;
  tax: number;
  total: number;
  shippingAddress?: ShippingAddress;
  addProductToCart: (product: ICartProduct) => void;
  updateCartQuantity: (Product: ICartProduct) => void;
  removeCartProduct: (Product: ICartProduct) => void;
  updateAddress: (address: ShippingAddress) => void;
}

export const CartContext = createContext({} as ContextProps);
