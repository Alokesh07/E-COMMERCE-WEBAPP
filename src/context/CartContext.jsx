import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(
    JSON.parse(localStorage.getItem("cart")) || []
  );

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((p) => p.id === product.id);
      if (existing) {
        return prev.map((p) =>
          p.id === product.id ? { ...p, qty: p.qty + 1 } : p
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
    try { (async () => { (await import('../utils/logger')).sendLog('info', `addToCart: ${product.id} - ${product.name}`); })(); } catch(e){}
  };

  const updateQty = (id, qty) => {
    if (qty <= 0) {
      setCart((prev) => prev.filter((p) => p.id !== id));
      try { (async () => { (await import('../utils/logger')).sendLog('info', `removeFromCart: ${id}`); })(); } catch(e){}
    } else {
      setCart((prev) => prev.map((p) => (p.id === id ? { ...p, qty } : p)));
      try { (async () => { (await import('../utils/logger')).sendLog('info', `updateQty: ${id} -> ${qty}`); })(); } catch(e){}
    }
  };

  const clearCart = () => setCart([]);
  // log clearing
  const clearCartLogged = () => { clearCart(); try { (async () => { (await import('../utils/logger')).sendLog('info', `clearCart`); })(); } catch(e){} };

  return (
    <CartContext.Provider value={{ cart, addToCart, updateQty, clearCart: clearCartLogged }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
