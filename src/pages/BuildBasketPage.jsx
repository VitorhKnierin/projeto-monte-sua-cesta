import { useEffect, useMemo, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useCart } from '../context'
import routePaths from '../routes/routePaths'
import { mockProducts } from '../services'
import { formatCurrency } from '../utils'
import './BuildBasketPage.css'
import emporiologo from '../assets/emporiologo.jpg'
import { ShoppingCart } from 'lucide-react'

const ALL_PRODUCTS_CATEGORY = 'Todos os produtos'

const checkoutSteps = [
  { id: 'basket', label: 'Escolha da cesta', icon: '01' },
  { id: 'products', label: 'Produtos', icon: '02' },
  { id: 'delivery', label: 'Entrega', icon: '03' },
]

function BuildBasketPage() {
  const navigate = useNavigate()
  const [activeCategory, setActiveCategory] = useState(ALL_PRODUCTS_CATEGORY)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [noticeMessage, setNoticeMessage] = useState('')
  const [isDeliveryConfirmOpen, setIsDeliveryConfirmOpen] = useState(false)

  const {
    cart,
    addItem,
    removeItem,
    totalItems,
    basketCapacity,
    remainingCapacity,
    orderTotal,
  } = useCart()

  const categories = useMemo(
    () => [ALL_PRODUCTS_CATEGORY, ...new Set(mockProducts.map((product) => product.category))],
    [],
  )

  const filteredProducts = useMemo(() => {
    if (activeCategory === ALL_PRODUCTS_CATEGORY) {
      return mockProducts
    }

    return mockProducts.filter((product) => product.category === activeCategory)
  }, [activeCategory])

  const productQuantities = useMemo(() => {
    return cart.items.reduce((acc, item) => {
      acc[item.id] = (acc[item.id] || 0) + 1
      return acc
    }, {})
  }, [cart.items])

  const groupedCartItems = useMemo(() => {
    return cart.items.reduce((acc, item) => {
      const existingItem = acc.find((entry) => entry.id === item.id)

      if (existingItem) {
        existingItem.quantity += 1
        existingItem.subtotal += item.price
        return acc
      }

      acc.push({
        ...item,
        quantity: 1,
        subtotal: item.price,
      })

      return acc
    }, [])
  }, [cart.items])

  useEffect(() => {
    if (!noticeMessage) {
      return undefined
    }

    const timeoutId = window.setTimeout(() => {
      setNoticeMessage('')
    }, 3200)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [noticeMessage])

  useEffect(() => {
    if (!isCartOpen && !isDeliveryConfirmOpen) {
      return undefined
    }

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setIsCartOpen(false)
        setIsDeliveryConfirmOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isCartOpen, isDeliveryConfirmOpen])

  if (!cart.selectedBasket) {
    return <Navigate to={routePaths.selectBasket} replace />
  }

  function handleStepNavigation(stepId) {
    if (stepId === 'basket') {
      navigate(routePaths.selectBasket)
      return
    }

    if (stepId !== 'delivery') {
      return
    }

    handleContinueToDelivery()
  }

  function handleContinueToDelivery() {
    if (totalItems === 0) {
      setNoticeMessage('Adicione ao menos 1 item antes de continuar para entrega.')
      return
    }

    if (remainingCapacity > 0) {
      setIsDeliveryConfirmOpen(true)
      return
    }

    navigate(routePaths.delivery)
  }

  function confirmDeliveryNavigation() {
    setIsDeliveryConfirmOpen(false)
    navigate(routePaths.delivery)
  }

  const capacityPercentage = basketCapacity
    ? Math.min((totalItems / basketCapacity) * 100, 100)
    : 0

  return (
    <main className="build-basket-page">
      <div className="build-basket-shell">
        <aside className="build-basket-sidebar" aria-label="Filtros de produtos">
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
              {categories.map((category) => (
                <button
                  type="button"
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={
                    category === activeCategory ? 'category-button active' : 'category-button'
                  }
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className="sidebar-bottom">
            <p className="sidebar-helper">
              Escolha os itens e acompanhe o espaco restante da cesta em tempo real.
            </p>

            <Link to={routePaths.selectBasket} className="change-basket-link secondary">
              Trocar cesta
            </Link>
          </div>
        </aside>

        <div className="build-basket-content">
          <header className="build-basket-topbar">
            <div className="topbar-heading">
              <span className="topbar-logo">Emporio Sobreiro</span>

              <div>
                <p className="topbar-eyebrow">Montagem personalizada</p>
                <h1>Monte sua cesta</h1>
              </div>
            </div>

            <ol className="checkout-stepper" aria-label="Etapas do pedido">
              {checkoutSteps.map((step, index) => {
                const stepClassName =
                  step.id === 'products'
                    ? 'checkout-step active'
                    : index < 1
                      ? 'checkout-step completed'
                      : 'checkout-step'
                const isClickable = step.id === 'basket' || step.id === 'delivery'

                return (
                  <li key={step.id} className={stepClassName}>
                    {isClickable ? (
                      <button
                        type="button"
                        className="checkout-step-trigger"
                        onClick={() => handleStepNavigation(step.id)}
                      >
                        <span className="checkout-step-icon" aria-hidden="true">
                          {step.icon}
                        </span>
                        <span className="checkout-step-label">{step.label}</span>
                      </button>
                    ) : (
                      <>
                        <span className="checkout-step-icon" aria-hidden="true">
                          {step.icon}
                        </span>
                        <span className="checkout-step-label">{step.label}</span>
                      </>
                    )}
                  </li>
                )
              })}
            </ol>
          </header>

          {noticeMessage && (
            <div className="build-basket-notice" role="status" aria-live="polite">
              {noticeMessage}
            </div>
          )}

          <section className="selected-basket-banner" aria-label="Resumo da cesta selecionada">
            <div className="selected-basket-copy">
              <p className="selected-basket-label">Cesta escolhida</p>
              <h2>{cart.selectedBasket.name}</h2>
              <p className="selected-basket-meta">
                {formatCurrency(cart.selectedBasket.price)} base + produtos selecionados
              </p>
            </div>

            <div className="selected-basket-capacity">
              <div className="capacity-heading">
                <span>Capacidade</span>
                <strong>
                  {totalItems}/{basketCapacity} itens
                </strong>
              </div>

              <div className="capacity-bar" aria-hidden="true">
                <span style={{ width: `${capacityPercentage}%` }} />
              </div>

              <p className="capacity-indicator">
                {remainingCapacity > 0
                  ? `${remainingCapacity} espacos disponiveis na cesta`
                  : 'Capacidade maxima atingida para esta cesta'}
              </p>
            </div>
          </section>

          <section className="products-section" aria-label="Lista de produtos">
            <div className="products-section-header">
              <div>
                <p className="products-section-label">Catalogo</p>
                <h2>Produtos para adicionar</h2>
              </div>

              <span className="products-count">
                {filteredProducts.length} itens em {activeCategory}
              </span>
            </div>

            <div className="products-grid">
              {filteredProducts.map((product) => {
                const quantity = productQuantities[product.id] || 0
                const isFull = remainingCapacity <= 0
                const isSelected = quantity > 0

                return (
                  <article
  className={`product-card ${isSelected ? 'product-card-selected' : ''}`}
  key={product.id}
>
                    <div className="product-image-wrap">
                      <img
                        src={product.image}
                        alt={`Imagem de ${product.name}`}
                        className="product-image"
                      />
                    </div>

                    <div className="product-info">
                      <p className="product-category">{product.category}</p>
                      <h3>{product.name}</h3>
                      <p className="product-price">{formatCurrency(product.price)}</p>
                    </div>

                    <div className="product-actions" aria-label={`Quantidade de ${product.name}`}>
                      <button
                        type="button"
                        onClick={() => removeItem(product.id)}
                        disabled={quantity === 0}
                        aria-label={`Remover uma unidade de ${product.name}`}
                      >
                        -
                      </button>

                      <span>{quantity}</span>

                      <button
                        type="button"
                        onClick={() => addItem(product)}
                        disabled={isFull}
                        aria-label={`Adicionar uma unidade de ${product.name}`}
                      >
                        +
                      </button>
                    </div>
                  </article>
                )
              })}
            </div>
          </section>
        </div>
      </div>

      <footer className="build-basket-summary">
        <div className="summary-space">
          <p className="summary-label">Espaco da cesta</p>
          <strong>
            {totalItems}/{basketCapacity} itens
          </strong>
          <span>{remainingCapacity} livres</span>
        </div>

        <div className="summary-total">
          <button
            type="button"
            className="summary-cart-button"
            onClick={() => setIsCartOpen(true)}
            aria-haspopup="dialog"
            aria-expanded={isCartOpen}
            aria-controls="build-basket-cart-drawer"
          >
           <span className="summary-cart-icon" aria-hidden="true">
  <ShoppingCart size={24} strokeWidth={2.2} />
</span>
            <span className="summary-cart-button-copy">
              <strong>Ver carrinho</strong>
              <small>Ajuste os itens sem sair desta tela</small>
            </span>
            <span className="summary-cart-count">{totalItems}</span>
          </button>

          <div>
            <p className="summary-label">Total</p>
            <strong>{formatCurrency(orderTotal)}</strong>
          </div>
        </div>

        {totalItems > 0 ? (
          <button type="button" className="summary-cta" onClick={handleContinueToDelivery}>
            Seguir para entrega
          </button>
        ) : (
          <span className="summary-cta disabled">Adicione ao menos 1 item</span>
        )}
      </footer>

      {isCartOpen && (
        <div className="cart-drawer-layer" role="presentation">
          <button
            type="button"
            className="cart-drawer-backdrop"
            aria-label="Fechar carrinho"
            onClick={() => setIsCartOpen(false)}
          />

          <aside
            id="build-basket-cart-drawer"
            className="cart-drawer"
            role="dialog"
            aria-modal="true"
            aria-labelledby="cart-drawer-title"
          >
            <div className="cart-drawer-header">
              <div>
                <p className="sidebar-section-label">Carrinho</p>
                <h2 id="cart-drawer-title">Resumo da sua cesta</h2>
              </div>

              <button
                type="button"
                className="cart-drawer-close"
                onClick={() => setIsCartOpen(false)}
                aria-label="Fechar carrinho"
              >
                x
              </button>
            </div>

            <div className="cart-drawer-body">
              {groupedCartItems.length > 0 ? (
                <div className="cart-items-list">
                  {groupedCartItems.map((item) => (
                    <article key={item.id} className="cart-item-card">
                      <div className="cart-item-main">
                        <div className="cart-item-copy">
                          <div className="cart-item-thumb">
                            <img src={item.image} alt={`Imagem de ${item.name}`} />
                          </div>

                          <div>
                            <h3>{item.name}</h3>
                            <p>{item.quantity} unidade(s)</p>
                          </div>
                        </div>

                        <div className="cart-item-controls" aria-label={`Ajustar ${item.name}`}>
                          <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            aria-label={`Remover uma unidade de ${item.name}`}
                          >
                            -
                          </button>
                          <span>{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => addItem(item)}
                            disabled={remainingCapacity <= 0}
                            aria-label={`Adicionar uma unidade de ${item.name}`}
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <div className="cart-item-pricing">
                        <span>Unitario: {formatCurrency(item.price)}</span>
                        <strong>Subtotal: {formatCurrency(item.subtotal)}</strong>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="cart-empty-state">
                  <p className="sidebar-section-label">Carrinho vazio</p>
                  <h3>Nenhum produto adicionado ainda</h3>
                  <p>Adicione itens na grade para montar a cesta antes de seguir para entrega.</p>
                </div>
              )}
            </div>

            <div className="cart-drawer-footer">
              <div className="cart-drawer-total">
                <span>Total final</span>
                <strong>{formatCurrency(orderTotal)}</strong>
              </div>

              <button
                type="button"
                className="cart-drawer-close-link"
                onClick={() => setIsCartOpen(false)}
              >
                Continuar montando
              </button>
            </div>
          </aside>
        </div>
      )}

      {isDeliveryConfirmOpen && (
        <div className="confirm-modal-layer" role="presentation">
          <button
            type="button"
            className="confirm-modal-backdrop"
            aria-label="Fechar confirmacao"
            onClick={() => setIsDeliveryConfirmOpen(false)}
          />

          <div
            className="confirm-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delivery-confirm-title"
          >
            <p className="sidebar-section-label">Continuar pedido</p>
            <h2 id="delivery-confirm-title">
              Seu carrinho nao esta cheio ainda. Tem certeza que quer continuar?
            </h2>
            <p className="confirm-modal-copy">
              Voce ainda pode aproveitar o espaco restante da cesta antes de seguir para entrega.
            </p>

            <div className="confirm-modal-actions">
              <button
                type="button"
                className="confirm-modal-secondary"
                onClick={() => setIsDeliveryConfirmOpen(false)}
              >
                Continuar montando
              </button>

              <button
                type="button"
                className="confirm-modal-primary"
                onClick={confirmDeliveryNavigation}
              >
                Sim, seguir para entrega
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

export default BuildBasketPage
