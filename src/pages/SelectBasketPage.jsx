import { useNavigate } from 'react-router-dom'
import { useCart } from '../context'
import routePaths from '../routes/routePaths'
import { mockBaskets } from '../services'
import { formatCurrency } from '../utils'
import './SelectBasketPage.css'
import emporiologo from '../assets/emporiologo.jpg'

const checkoutSteps = [
  { id: 'basket', label: 'Escolha da cesta', icon: '01' },
  { id: 'products', label: 'Produtos', icon: '02' },
  { id: 'delivery', label: 'Entrega', icon: '03' },
]

function SelectBasketPage() {
  const navigate = useNavigate()
  const { cart, selectBasket } = useCart()

  function handleSelectBasket(basket) {
    selectBasket(basket)
    navigate(routePaths.buildBasket)
  }

  return (
    <main className="select-basket-page">
      <div className="select-basket-shell">
        <aside className="select-basket-sidebar" aria-label="Apresentacao da etapa">
          <div className="select-sidebar-brand">
            <div className="select-sidebar-brand-logo-wrap">
              <img
                src={emporiologo}
                alt="Logo do Emporio Sobreiro"
                className="select-sidebar-brand-logo"
              />
            </div>
          </div>

          <div className="select-sidebar-copy">
            <p className="select-sidebar-label">Montagem personalizada</p>
            <h2>Comece pela cesta perfeita</h2>
            <p className="select-sidebar-text">
              Escolha a base do presente para definir a capacidade e seguir para a selecao
              dos produtos.
            </p>
          </div>

          <div className="select-sidebar-highlight">
            <span className="select-sidebar-highlight-label">Curadoria premium</span>
            <strong>Modelos elegantes para presentes sob medida</strong>
          </div>
        </aside>

        <div className="select-basket-content">
          <header className="select-basket-topbar">
            <div className="select-topbar-heading">
              <span className="select-topbar-logo">Emporio Sobreiro</span>

              <div>
                <p className="select-topbar-eyebrow">Etapa inicial</p>
                <h1>Escolha sua cesta</h1>
                <p className="select-topbar-description">
                  Selecione o modelo ideal para iniciar a montagem do presente.
                </p>
              </div>
            </div>

            <ol className="select-checkout-stepper" aria-label="Etapas do pedido">
              {checkoutSteps.map((step) => (
                <li
                  key={step.id}
                  className={
                    step.id === 'basket'
                      ? 'select-checkout-step active'
                      : 'select-checkout-step'
                  }
                >
                  <span className="select-checkout-step-icon" aria-hidden="true">
                    {step.icon}
                  </span>
                  <span className="select-checkout-step-label">{step.label}</span>
                </li>
              ))}
            </ol>
          </header>

          <section className="select-basket-hero" aria-label="Resumo da etapa atual">
            <div className="select-basket-hero-copy">
              <p className="select-basket-hero-label">Escolha da base</p>
              <h2>Defina o estilo e a capacidade da cesta</h2>
              <p className="select-basket-hero-text">
                O valor total do pedido sera calculado com base no preco da cesta mais os
                produtos adicionados na proxima etapa.
              </p>
            </div>

            <div className="select-basket-hero-summary">
              <span>Cestas disponiveis</span>
              <strong>{mockBaskets.length}</strong>
              <p>Selecione uma opcao para continuar para a montagem.</p>
            </div>
          </section>

          <section className="select-basket-section" aria-label="Opcoes de cestas">
            <div className="select-basket-section-header">
              <div>
                <p className="select-basket-section-label">Modelos disponiveis</p>
                <h2>Escolha a composicao ideal</h2>
              </div>

              <span className="select-basket-count">{mockBaskets.length} opcoes</span>
            </div>

            <div className="basket-grid">
              {mockBaskets.map((basket) => {
                const isSelected = cart.selectedBasket?.id === basket.id

                return (
                  <article
                    key={basket.id}
                    className={`basket-card ${isSelected ? 'basket-card-selected' : ''}`}
                  >
                    <div className="basket-card-image-wrap">
                      <img
                        src={basket.image}
                        alt={`Imagem da ${basket.name}`}
                        className="basket-card-image"
                      />
                    </div>

                    <div className="basket-card-copy">
                      <p className="basket-card-kicker">Cesta selecionavel</p>
                      <h3>{basket.name}</h3>
                      <p className="basket-card-capacity">Capacidade de ate {basket.capacity} itens</p>
                    </div>

                    <div className="basket-card-footer">
                      <div className="basket-card-price-block">
                        <span>Preco base</span>
                        <strong className="basket-card-price">{formatCurrency(basket.price)}</strong>
                      </div>

                      <button
                        type="button"
                        className="basket-card-button"
                        onClick={() => handleSelectBasket(basket)}
                        aria-label={`Selecionar ${basket.name} e continuar`}
                      >
                        Selecionar e continuar
                      </button>
                    </div>
                  </article>
                )
              })}
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}

export default SelectBasketPage
