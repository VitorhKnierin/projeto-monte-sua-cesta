import { Link } from 'react-router-dom'
import routePaths from '../routes/routePaths'

function BuildBasketPage() {
  return (
    <main>
      <h1>Monte Sua Cesta</h1>
      <p>Pagina base para adicionar produtos na cesta.</p>
      <nav>
        <Link to={routePaths.selectBasket}>Voltar</Link>
        {' | '}
        <Link to={routePaths.delivery}>Continuar para Entrega</Link>
      </nav>
    </main>
  )
}

export default BuildBasketPage
