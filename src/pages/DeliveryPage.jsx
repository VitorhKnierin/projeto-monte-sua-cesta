import { Link } from 'react-router-dom'
import routePaths from '../routes/routePaths'

function DeliveryPage() {
  return (
    <main>
      <h1>Entrega</h1>
      <p>Pagina base para dados de entrega.</p>
      <nav>
        <Link to={routePaths.buildBasket}>Voltar</Link>
        {' | '}
        <Link to={routePaths.review}>Continuar para Revisao</Link>
      </nav>
    </main>
  )
}

export default DeliveryPage
