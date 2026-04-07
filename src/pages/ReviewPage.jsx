import { Link } from 'react-router-dom'
import routePaths from '../routes/routePaths'

function ReviewPage() {
  return (
    <main>
      <h1>Revisao do Pedido</h1>
      <p>Pagina base para revisar itens e dados da compra.</p>
      <nav>
        <Link to={routePaths.delivery}>Voltar</Link>
        {' | '}
        <Link to={routePaths.success}>Finalizar Pedido</Link>
      </nav>
    </main>
  )
}

export default ReviewPage
