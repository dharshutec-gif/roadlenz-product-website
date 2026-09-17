"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

/* =========================================================
   TYPES
========================================================= */

export interface CartItem {
  id: string;
  name: string;
  slug?: string;
  price: number;
  quantity: number;

  image?: string;
  category?: string;
  sku?: string;
  description?: string;
}

interface CartContextType {
  items: CartItem[];

  cartCount: number;
  cartTotal: number;

  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;

  increaseQuantity: (id: string) => void;
  decreaseQuantity: (id: string) => void;

  clearCart: () => void;
}

/* =========================================================
   CONTEXT
========================================================= */

const CartContext =
  createContext<CartContextType | undefined>(
    undefined,
  );

const STORAGE_KEY = "roadlenz-cart";

/* =========================================================
   PROVIDER
========================================================= */

export function CartProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [items, setItems] = useState<CartItem[]>([]);

  /* =======================================================
     LOAD CART
  ======================================================= */

  useEffect(() => {
    try {
      const storedCart =
        localStorage.getItem(STORAGE_KEY);

      if (!storedCart) {
        return;
      }

      const parsedCart: unknown =
        JSON.parse(storedCart);

      if (!Array.isArray(parsedCart)) {
        return;
      }

      setItems(
        parsedCart.filter(
          (item): item is CartItem => {
            if (
              typeof item !== "object" ||
              item === null
            ) {
              return false;
            }

            const cartItem =
              item as Record<string, unknown>;

            return (
              typeof cartItem.id === "string" &&
              typeof cartItem.name === "string" &&
              typeof cartItem.price === "number" &&
              typeof cartItem.quantity === "number"
            );
          },
        ),
      );
    } catch (error) {
      console.error(
        "ROADLENZ: Failed to load cart",
        error,
      );
    }
  }, []);

  /* =======================================================
     SAVE CART
  ======================================================= */

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(items),
      );
    } catch (error) {
      console.error(
        "ROADLENZ: Failed to save cart",
        error,
      );
    }
  }, [items]);

  /* =======================================================
     ADD TO CART
  ======================================================= */

  const addToCart = (item: CartItem) => {
    setItems((currentItems) => {
      const existingItem =
        currentItems.find(
          (cartItem) =>
            cartItem.id === item.id,
        );

      if (existingItem) {
        return currentItems.map(
          (cartItem) => {
            if (
              cartItem.id !== item.id
            ) {
              return cartItem;
            }

            return {
              ...cartItem,
              quantity:
                cartItem.quantity +
                Math.max(
                  1,
                  item.quantity || 1,
                ),
            };
          },
        );
      }

      return [
        ...currentItems,
        {
          ...item,
          quantity: Math.max(
            1,
            item.quantity || 1,
          ),
        },
      ];
    });
  };

  /* =======================================================
     REMOVE FROM CART
  ======================================================= */

  const removeFromCart = (id: string) => {
    setItems((currentItems) =>
      currentItems.filter(
        (item) => item.id !== id,
      ),
    );
  };

  /* =======================================================
     INCREASE QUANTITY
  ======================================================= */

  const increaseQuantity = (id: string) => {
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity:
                item.quantity + 1,
            }
          : item,
      ),
    );
  };

  /* =======================================================
     DECREASE QUANTITY
  ======================================================= */

  const decreaseQuantity = (id: string) => {
    setItems((currentItems) =>
      currentItems
        .map((item) =>
          item.id === id
            ? {
                ...item,
                quantity:
                  item.quantity - 1,
              }
            : item,
        )
        .filter(
          (item) => item.quantity > 0,
        ),
    );
  };

  /* =======================================================
     CLEAR CART
  ======================================================= */

  const clearCart = () => {
    setItems([]);
  };

  /* =======================================================
     CART COUNT
  ======================================================= */

  const cartCount = useMemo(() => {
    return items.reduce(
      (total, item) =>
        total + item.quantity,
      0,
    );
  }, [items]);

  /* =======================================================
     CART TOTAL
  ======================================================= */

  const cartTotal = useMemo(() => {
    return items.reduce(
      (total, item) =>
        total +
        item.price * item.quantity,
      0,
    );
  }, [items]);

  /* =======================================================
     CONTEXT VALUE
  ======================================================= */

  const value = useMemo(
    () => ({
      items,
      cartCount,
      cartTotal,

      addToCart,
      removeFromCart,

      increaseQuantity,
      decreaseQuantity,

      clearCart,
    }),
    [
      items,
      cartCount,
      cartTotal,
    ],
  );

  /* =======================================================
     PROVIDER
  ======================================================= */

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

/* =========================================================
   USE CART
========================================================= */

export function useCart() {
  const context =
    useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart must be used inside CartProvider.",
    );
  }

  return context;
}

/* =========================================================
   BACKWARD COMPATIBILITY
========================================================= */

export function useCartContext() {
  return useCart();
}

export default CartContext;
