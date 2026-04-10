import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const CartContext = createContext(null)
const CART_STORAGE_KEY = 'emporio-sobreiro:cart'

function getEmptyCart() {
  return {
    selectedBasket: null,
    items: [],
    delivery: null,
  }
}

function getInitialCart() {
  if (typeof window === 'undefined') {
    return getEmptyCart()
  }

  const storedCart = window.localStorage.getItem(CART_STORAGE_KEY)

  if (!storedCart) {
    return getEmptyCart()
  }

  try {
    return JSON.parse(storedCart)
  } catch {
    return getEmptyCart()
  }
}

function CartProvider({ children }) {
  const [cart, setCart] = useState(getInitialCart)

  useEffect(() => {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart))
  }, [cart])

  function selectBasket(basket) {
    setCart({
      selectedBasket: basket,
      items: [],
      delivery: null,
    })
  }

  function addItem(product) {
    let itemAdded = false

    setCart((previousCart) => {
      const basketCapacity = previousCart.selectedBasket?.capacity ?? 0
      const totalItems = previousCart.items.length

      if (!previousCart.selectedBasket || totalItems >= basketCapacity) {
        return previousCart
      }

      itemAdded = true

      return {
        ...previousCart,
        items: [...previousCart.items, product],
      }
    })

    return itemAdded
  }

  function removeItem(productId) {
    setCart((previousCart) => {
      const itemIndex = previousCart.items.findIndex((item) => item.id === productId)

      if (itemIndex === -1) {
        return previousCart
      }

      return {
        ...previousCart,
        items: previousCart.items.filter((_, index) => index !== itemIndex),
      }
    })
  }

  const basketCapacity = cart.selectedBasket?.capacity ?? 0
  const totalItems = cart.items.length
  const remainingCapacity = Math.max(basketCapacity - totalItems, 0)
  const itemsTotal = cart.items.reduce((total, item) => total + item.price, 0)
  const orderTotal = (cart.selectedBasket?.price ?? 0) + itemsTotal

  const value = useMemo(
    () => ({
      cart,
      setCart,
      selectBasket,
      addItem,
      removeItem,
      totalItems,
      basketCapacity,
      remainingCapacity,
      itemsTotal,
      orderTotal,
    }),
    [cart, totalItems, basketCapacity, remainingCapacity, itemsTotal, orderTotal],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

function useCart() {
  const context = useContext(CartContext)

  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }

  return context
}

export { CartContext, CartProvider, useCart }