import { CartProvider } from './context'
import { AppRoutes } from './routes'

function App() {
  return (
    <CartProvider>
      <AppRoutes />
    </CartProvider>
  )
}

export default App
