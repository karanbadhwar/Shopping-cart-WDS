import {
  createContext,
  ReactNode,
  useContext,
  useState,
} from "react";
import { ShoppingCart } from "../components/ShoppingCart";
import { useLocalStorage } from "../hooks/useLocalStorage";

interface ShoppingCartProviderProps {
  children: ReactNode;
}

interface ShoppingCartContext {
  openCart: () => void;
  closeCart: () => void;
  getItemQuantity: (id: number) => number;
  increaseCartQuantity: (id: number) => void;
  decreaseCartQuantity: (id: number) => void;
  removeFromCart: (id: number) => void;
  cartQuantity: number;
  cartItems: CartItem[];
}

type CartItem = {
  id: number;
  quantity: number;
};

const ShoppingCartContext = createContext(
  {} as ShoppingCartContext
);

export function useShoppingCart() {
  return useContext(ShoppingCartContext);
}

export function ShoppingCartProvider({
  children,
}: ShoppingCartProviderProps) {
  //useState for CartItems
  const [cartItems, setCartitems] = useLocalStorage<
    CartItem[]
  >("Shopping-cart", []);

  //useState for Slide Modal
  const [isOpen, setIsOpen] = useState(false);

  const cartQuantity = cartItems.reduce(
    (quantity, item) => item.quantity + quantity,
    0
  );

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  function getItemQuantity(id: number) {
    return (
      cartItems.find((item) => item.id === id)?.quantity ||
      0
    );
  }

  function increaseCartQuantity(id: number) {
    setCartitems((currItems) => {
      if (
        currItems.find((item) => item.id === id) == null
      ) {
        return [...currItems, { id, quantity: 1 }];
      } else {
        return currItems.map((item) => {
          if (item.id === id) {
            return { ...item, quantity: item.quantity + 1 };
          } else {
            return item;
          }
        });
      }
    });
  }

  function decreaseCartQuantity(id: number) {
    setCartitems((currItems) => {
      if (
        currItems.find((item) => item.id === id)
          ?.quantity === 1
      ) {
        return currItems.filter((item) => item.id !== id);
      } else {
        return currItems.map((item) => {
          if (item.id === id) {
            return { ...item, quantity: item.quantity - 1 };
          } else {
            return item;
          }
        });
      }
    });
  }

  function removeFromCart(id: number) {
    setCartitems((currItems) => {
      return currItems.filter((item) => item.id !== id);
    });
  }
  // console.log("Component Re-render");
  return (
    <ShoppingCartContext.Provider
      value={{
        getItemQuantity,
        increaseCartQuantity,
        decreaseCartQuantity,
        removeFromCart,
        cartItems,
        cartQuantity,
        openCart,
        closeCart,
      }}
    >
      {children}
      <ShoppingCart isOpen={isOpen} />
    </ShoppingCartContext.Provider>
  );
}
