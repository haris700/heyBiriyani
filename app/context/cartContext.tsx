"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import axios from "axios";
import { UserContext } from "./userContext";

interface Items {
  id: number;
  ingredients: string[];
  name: string;
  price: number;
  uid: string;
}

interface CartItem {
  id: string;
  itemId: number;
  quantity: number;
  totalPrice: number;
  item: Items;
  unitPrice: number;
  // add other necessary fields
}

interface AddCart {
  userId: number;
  itemId: number;
  quantity: number;
  price: number;
  totalPrice: number;
}

interface CartContextType {
  cartItems: CartItem[];
  totalAmount: number;
  fetchCartItems: () => Promise<void>;
  addCartItem: (item: AddCart) => Promise<void>;
  updateCartItem: (
    itemId: number,
    quantity: number,
    itemPrice: number
  ) => Promise<void>;
  removeCartItem: (itemId: number) => Promise<void>;
}

interface CartContextProvide {
  children: ReactNode;
}

export const CartContext = createContext<CartContextType | undefined>(
  undefined
);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export const CartProvider: React.FC<CartContextProvide> = ({ children }) => {
  const { user } = useContext(UserContext);

  const userId = user?.id;

  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const [totalAmount, setTotalAmount] = useState(0);

  const fetchCartItems = async () => {
    if (!user) return;
    try {
      const response = await axios.get(
        `/api/cart/getCartItemByUserId/${userId}`
      );
      const cartItems: CartItem[] = response.data;

      setCartItems(cartItems);

      const total = cartItems.reduce((acc, item) => acc + item.totalPrice, 0);
      setTotalAmount(total);
    } catch (error) {
      console.error("Failed to fetch cart items:", error);
      alert("Failed to fetch cart items");
    }
  };

  const addCartItem = async (item: AddCart) => {
    if (!user) return;
    try {
      const response = await axios.post(`/api/cart/addToCart`, {
        userId,
        itemId: item.itemId,
        quantity: item.quantity,
        unitPrice: item.price,
        totalPrice: item.totalPrice,
      });

      const addedItem: CartItem = response.data.cartItem;
      setCartItems((prevItems) => [...prevItems, addedItem]);
      setTotalAmount((prevTotal) => prevTotal + addedItem.totalPrice);
    } catch (error) {
      console.error("Failed to add cart item:", error);
      alert("Failed to add cart item");
    }
  };
  const updateCartItem = async (
    itemId: number,
    quantity: number,
    itemPrice: number
  ) => {
    if (!user) return;

    try {
      await axios.patch(`/api/cart/updateCart`, {
        userId,
        itemId,
        quantity,
        itemPrice,
      });

      setCartItems((prevItems) =>
        prevItems.map((cartItem) =>
          cartItem.itemId === itemId
            ? {
                ...cartItem,
                quantity,
                totalPrice: cartItem.unitPrice * quantity,
              }
            : cartItem
        )
      );
      const updatedItem = cartItems.find((item) => item.itemId === itemId);
      if (updatedItem) {
        setTotalAmount(
          (prevTotal) =>
            prevTotal -
            updatedItem.totalPrice +
            updatedItem.unitPrice * quantity
        );
      }
    } catch (error) {
      console.error("Failed to update cart item:", error);
      alert("Failed to update cart item");
    }
  };

  const removeCartItem = async (itemId: number) => {
    if (!user) return;
    try {
      await axios.delete(`/api/cart/removeCartItem`, {
        data: { userId, itemId },
      });

      const itemToRemove = cartItems.find((item) => item.itemId === itemId);
      if (itemToRemove) {
        setCartItems((prevItems) =>
          prevItems.filter((item) => item.itemId !== itemId)
        );
        setTotalAmount((prevTotal) => prevTotal - itemToRemove.totalPrice);
      }
    } catch (error) {
      console.error("Failed to remove cart item:", error);
      alert("Failed to remove cart item");
    }
  };

  useEffect(() => {
    if (!userId) return;
    fetchCartItems();
  }, [userId]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        totalAmount,
        fetchCartItems,
        addCartItem,
        updateCartItem,
        removeCartItem,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
