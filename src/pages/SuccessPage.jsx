import { Link } from 'react-router-dom'
import routePaths from '../routes/routePaths'

function SuccessPage() {
  return (
    <main>
      <h1>Pedido Confirmado</h1>
      <p>Pagina base de sucesso apos a finalizacao da compra.</p>
      <Link to={routePaths.selectBasket}>Criar Nova Cesta</Link>
    </main>
  )
}

export default SuccessPage
