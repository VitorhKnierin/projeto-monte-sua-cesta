import { createContext, useMemo, useState } from 'react'

const CartContext = createContext(null)

function CartProvider({ children }) {
  const [cart, setCart] = useState({
    selectedBasket: null,
    items: [],
    delivery: null,
  })

  const value = useMemo(() => ({ cart, setCart }), [cart])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export { CartContext, CartProvider }
