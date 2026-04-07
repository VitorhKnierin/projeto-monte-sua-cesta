import { Link } from 'react-router-dom'
import routePaths from '../routes/routePaths'

function SelectBasketPage() {
  return (
    <main>
      <h1>Selecione a Cesta</h1>
      <p>Pagina base para escolha do modelo de cesta.</p>
      <Link to={routePaths.buildBasket}>Continuar para Montagem</Link>
    </main>
  )
}

export default SelectBasketPage
