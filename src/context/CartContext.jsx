import { createContext, useContext, useEffect, useMemo, useState } from 'react';
const CartContext = createContext();
export const money = n => `₦${n.toLocaleString('en-NG')}`;
export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem('naijaTasteCart') || '[]'));
  useEffect(() => localStorage.setItem('naijaTasteCart', JSON.stringify(cart)), [cart]);
  const addToCart = item => setCart(old => { const found = old.find(x => x.id === item.id); return found ? old.map(x => x.id === item.id ? {...x, qty:x.qty+1} : x) : [...old, {...item, qty:1}]; });
  const updateQty = (id, qty) => setCart(old => qty < 1 ? old.filter(x => x.id !== id) : old.map(x => x.id === id ? {...x, qty} : x));
  const remove = id => setCart(old => old.filter(x => x.id !== id));
  const subtotal = cart.reduce((sum, x) => sum + x.price*x.qty, 0);
  const count = cart.reduce((sum, x) => sum+x.qty, 0);
  const value = useMemo(() => ({cart, addToCart, updateQty, remove, subtotal, count}), [cart, subtotal, count]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
export const useCart = () => useContext(CartContext);
