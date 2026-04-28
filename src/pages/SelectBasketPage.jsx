import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context'
import routePaths from '../routes/routePaths'
import { mockBaskets } from '../services'
import { formatCurrency } from '../utils'
import './SelectBasketPage.css'
import emporiologo from '../assets/emporiologo.jpg'

const ALL_CAPACITIES_FILTER = 'Todos os tamanhos'

const checkoutSteps = [
  { id: 'basket', label: 'Escolha da cesta', icon: '01' },
  { id: 'products', label: 'Produtos', icon: '02' },
  { id: 'delivery', label: 'Entrega', icon: '03' },
]

function SelectBasketPage() {
  const navigate = useNavigate()
  const { cart, selectBasket } = useCart()
  const [activeCapacity, setActiveCapacity] = useState(ALL_CAPACITIES_FILTER)

  const capacityFilters = useMemo(() => {
    const capacities = [...new Set(mockBaskets.map((basket) => basket.capacity))]

    return [ALL_CAPACITIES_FILTER, ...capacities.map((capacity) => `${capacity} itens`)]
  }, [])

  const filteredBaskets = useMemo(() => {
    if (activeCapacity === ALL_CAPACITIES_FILTER) {
      return mockBaskets
    }

    const selectedCapacity = Number(activeCapacity.replace(/\D/g, ''))

    return mockBaskets.filter((basket) => basket.capacity === selectedCapacity)
  }, [activeCapacity])

  function handleSelectBasket(basket) {
    selectBasket(basket)
    navigate(routePaths.buildBasket)
  }

  return (
    <main className="select-basket-page">
      <div className="select-basket-shell">
        <aside className="select-basket-sidebar" aria-label="Filtros de tamanho da cesta">
          <div className="sidebar-brand">
            <div className="sidebar-brand-logo-wrap">
              <img
                src={emporiologo}
                alt="Logo do Emporio Sobreiro"
                className="sidebar-brand-logo"
              />
            </div>
          </div>

          <div className="sidebar-section">
            <p className="sidebar-section-label">Filtros</p>

            <div className="category-filter">
              {capacityFilters.map((capacityFilter) => (
                <button
                  type="button"
                  key={capacityFilter}
                  onClick={() => setActiveCapacity(capacityFilter)}
                  className={
                    capacityFilter === activeCapacity
                      ? 'category-button active'
                      : 'category-button'
                  }
                >
                  {capacityFilter}
                </button>
              ))}
            </div>
          </div>

          <div className="sidebar-bottom">
            <p className="sidebar-helper">
              Escolha a base ideal para definir o espaco disponivel da cesta antes de
              selecionar os produtos.
            </p>

            <div className="select-sidebar-highlight">
              <p className="sidebar-section-label">Curadoria premium</p>
              <strong>{mockBaskets.length} modelos para presentes sob medida</strong>
              <p className="sidebar-helper">
                O total do pedido sera calculado com o preco da cesta mais os itens da
                proxima etapa.
              </p>
            </div>
          </div>
        </aside>

        <div className="build-basket-content">
          <header className="build-basket-topbar">
            <div className="topbar-heading">
              <span className="topbar-logo">Emporio Sobreiro</span>

              <div>
                <p className="topbar-eyebrow">Etapa inicial</p>
                <h1>Monte sua cesta</h1>
                <p className="select-topbar-description">
                  Escolha o modelo de cesta ideal para iniciar a montagem do presente.
                </p>
              </div>
            </div>

            <ol className="checkout-stepper" aria-label="Etapas do pedido">
              {checkoutSteps.map((step) => (
                <li
                  key={step.id}
                  className={step.id === 'basket' ? 'checkout-step active' : 'checkout-step'}
                >
                  <span className="checkout-step-icon" aria-hidden="true">
                    {step.icon}
                  </span>
                  <span className="checkout-step-label">{step.label}</span>
                </li>
              ))}
            </ol>
          </header>

          <section className="selected-basket-banner" aria-label="Resumo da etapa atual">
            <div className="selected-basket-copy">
              <p className="selected-basket-label">Escolha da cesta</p>
              <h2>Defina a base do presente</h2>
              <p className="selected-basket-meta">
                Selecione a cesta que melhor combina com a ocasiao e com a quantidade de
                itens que voce deseja montar.
              </p>
            </div>

            <div className="selected-basket-capacity">
              <div className="capacity-heading">
                <span>Modelos visiveis</span>
                <strong>{filteredBaskets.length}</strong>
              </div>

              <div className="capacity-bar" aria-hidden="true">
                <span
                  style={{
                    width: `${Math.max((filteredBaskets.length / mockBaskets.length) * 100, 12)}%`,
                  }}
                />
              </div>

              <p className="capacity-indicator">
                {activeCapacity === ALL_CAPACITIES_FILTER
                  ? 'Visualize todos os tamanhos disponiveis antes de escolher.'
                  : `Filtro ativo: ${activeCapacity}.`}
              </p>
            </div>
          </section>

          <section className="products-section" aria-label="Lista de cestas">
            <div className="products-section-header">
              <div>
                <p className="products-section-label">Catalogo</p>
                <h2>Cestas para selecionar</h2>
              </div>

              <span className="products-count">
                {filteredBaskets.length} opcao{filteredBaskets.length === 1 ? '' : 'oes'} em{' '}
                {activeCapacity}
              </span>
            </div>

            <div className="products-grid basket-products-grid">
              {filteredBaskets.map((basket) => {
                const isSelected = cart.selectedBasket?.id === basket.id

                return (
                  <article
                    className={`product-card basket-card ${isSelected ? 'product-card-selected' : ''}`}
                    key={basket.id}
                  >
                    <div className="product-image-wrap basket-card-image-wrap">
                      <img
                        src={basket.image}
                        alt={`Imagem da ${basket.name}`}
                        className="product-image basket-card-image"
                      />
                    </div>

                    <div className="product-info basket-card-info">
                      <p className="product-category">Cesta selecionavel</p>
                      <h3>{basket.name}</h3>
                      <p className="basket-card-capacity">
                        Capacidade maxima de {basket.capacity} itens
                      </p>
                      <p className="product-price">{formatCurrency(basket.price)}</p>
                    </div>

                    <button
                      type="button"
                      className="basket-card-button"
                      onClick={() => handleSelectBasket(basket)}
                      aria-label={`Selecionar ${basket.name} e continuar`}
                    >
                      {isSelected ? 'Selecionada - continuar' : 'Selecionar e continuar'}
                    </button>
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
