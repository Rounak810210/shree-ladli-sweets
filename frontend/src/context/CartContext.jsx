import {
  createContext,
  useContext,
  useState,
} from "react";

const CartContext = createContext();

export function CartProvider({ children }) {

  // Load cart from localStorage when app starts
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem("shreeLadliCart");

    return savedCart
      ? JSON.parse(savedCart)
      : [];
  });


  // Save cart to localStorage
  const saveCart = (items) => {
    setCartItems(items);

    localStorage.setItem(
      "shreeLadliCart",
      JSON.stringify(items)
    );
  };


  // Add product
  const addToCart = (product) => {

    const existingItem = cartItems.find(
      (item) => item._id === product._id
    );

    if (existingItem) {

      const updatedItems = cartItems.map((item) =>
        item._id === product._id
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item
      );

      saveCart(updatedItems);

    } else {

      const updatedItems = [
        ...cartItems,
        {
          ...product,
          quantity: 1,
        },
      ];

      saveCart(updatedItems);
    }
  };


  // Increase quantity
  const increaseQuantity = (productId) => {

    const updatedItems = cartItems.map((item) =>
      item._id === productId
        ? {
            ...item,
            quantity: item.quantity + 1,
          }
        : item
    );

    saveCart(updatedItems);
  };


  // Decrease quantity
  const decreaseQuantity = (productId) => {

    const updatedItems = cartItems
      .map((item) =>
        item._id === productId
          ? {
              ...item,
              quantity: item.quantity - 1,
            }
          : item
      )
      .filter((item) => item.quantity > 0);

    saveCart(updatedItems);
  };


  // Remove item
  const removeFromCart = (productId) => {

    const updatedItems = cartItems.filter(
      (item) => item._id !== productId
    );

    saveCart(updatedItems);
  };


  // Clear cart
  const clearCart = () => {

    setCartItems([]);

    localStorage.removeItem("shreeLadliCart");
  };


  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        increaseQuantity,
        decreaseQuantity,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}


export function useCart() {
  return useContext(CartContext);
}