import { useEffect, useMemo, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useCart } from '../context'
import routePaths from '../routes/routePaths'
import { formatCurrency } from '../utils'
import './DeliveryPage.css'
import emporiologo from '../assets/emporiologo.jpg'

const checkoutSteps = [
  { id: 'basket', label: 'Escolha da cesta', icon: '01' },
  { id: 'products', label: 'Produtos', icon: '02' },
  { id: 'delivery', label: 'Entrega', icon: '03' },
  { id: 'review', label: 'Revisao', icon: '04' },
]

const deliveryPeriods = [
  'Manha (08h as 12h)',
  'Tarde (12h as 18h)',
  'Noite (18h as 21h)',
]

const initialDeliveryForm = {
  recipientName: '',
  recipientPhone: '',
  senderName: '',
  senderPhone: '',
  cep: '',
  street: '',
  number: '',
  complement: '',
  neighborhood: '',
  city: '',
  state: '',
  deliveryDate: '',
  deliveryPeriod: deliveryPeriods[0],
  cardMessage: '',
  observations: '',
}

function DeliveryPage() {
  const navigate = useNavigate()
  const { cart, setCart, totalItems, basketCapacity, remainingCapacity, itemsTotal, orderTotal } =
    useCart()

  const [formData, setFormData] = useState(() => ({
    ...initialDeliveryForm,
    ...(cart.delivery ?? {}),
  }))
  const [noticeMessage, setNoticeMessage] = useState('')

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

  const requiredFields = [
    formData.recipientName,
    formData.recipientPhone,
    formData.senderName,
    formData.cep,
    formData.street,
    formData.number,
    formData.neighborhood,
    formData.city,
    formData.state,
    formData.deliveryDate,
    formData.deliveryPeriod,
  ]

  const isFormValid = requiredFields.every((value) => value.trim().length > 0)

  useEffect(() => {
    setCart((previousCart) => ({
      ...previousCart,
      delivery: formData,
    }))
  }, [formData, setCart])

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

  if (!cart.selectedBasket) {
    return <Navigate to={routePaths.selectBasket} replace />
  }

  if (totalItems === 0) {
    return <Navigate to={routePaths.buildBasket} replace />
  }

  function handleFieldChange(event) {
    const { name, value } = event.target

    setFormData((previousFormData) => ({
      ...previousFormData,
      [name]: value,
    }))
  }

  function handleStepNavigation(stepId) {
    if (stepId === 'basket') {
      navigate(routePaths.selectBasket)
      return
    }

    if (stepId === 'products') {
      navigate(routePaths.buildBasket)
      return
    }

    if (stepId === 'review') {
      handleContinueToReview()
    }
  }

  function handleContinueToReview() {
    if (!isFormValid) {
      setNoticeMessage('Preencha os campos obrigatorios de entrega antes de continuar.')
      return
    }

    navigate(routePaths.review)
  }

  return (
    <main className="delivery-page">
      <div className="delivery-shell">
        <aside className="delivery-sidebar" aria-label="Resumo da etapa de entrega">
          <div className="delivery-sidebar-brand">
            <div className="delivery-sidebar-brand-logo-wrap">
              <img
                src={emporiologo}
                alt="Logo do Emporio Sobreiro"
                className="delivery-sidebar-brand-logo"
              />
            </div>
          </div>

          <div className="delivery-sidebar-copy">
            <p className="delivery-sidebar-label">Etapa de entrega</p>
            <h2>Finalize os dados para envio</h2>
            <p className="delivery-sidebar-text">
              Confirme contato, endereco e preferencia de horario para seguirmos com a
              revisao do pedido.
            </p>
          </div>

          <div className="delivery-sidebar-highlight">
            <span className="delivery-sidebar-highlight-label">Cesta selecionada</span>
            <strong>{cart.selectedBasket.name}</strong>
            <p>
              {totalItems} de {basketCapacity} itens escolhidos
            </p>
          </div>
        </aside>

        <div className="delivery-content">
          <header className="delivery-topbar">
            <div className="delivery-topbar-heading">
              <span className="delivery-topbar-logo">Emporio Sobreiro</span>

              <div>
                <p className="delivery-topbar-eyebrow">Fluxo principal</p>
                <h1>Dados de entrega</h1>
                <p className="delivery-topbar-description">
                  Preencha as informacoes essenciais para entrega e siga para a revisao
                  final do pedido.
                </p>
              </div>
            </div>

            <ol className="delivery-checkout-stepper" aria-label="Etapas do pedido">
              {checkoutSteps.map((step, index) => {
                const stepClassName =
                  step.id === 'delivery'
                    ? 'delivery-checkout-step active'
                    : index < 2
                      ? 'delivery-checkout-step completed'
                      : 'delivery-checkout-step'
                const isClickable = step.id !== 'delivery'

                return (
                  <li key={step.id} className={stepClassName}>
                    {isClickable ? (
                      <button
                        type="button"
                        className="delivery-checkout-step-trigger"
                        onClick={() => handleStepNavigation(step.id)}
                      >
                        <span className="delivery-checkout-step-icon" aria-hidden="true">
                          {step.icon}
                        </span>
                        <span className="delivery-checkout-step-label">{step.label}</span>
                      </button>
                    ) : (
                      <>
                        <span className="delivery-checkout-step-icon" aria-hidden="true">
                          {step.icon}
                        </span>
                        <span className="delivery-checkout-step-label">{step.label}</span>
                      </>
                    )}
                  </li>
                )
              })}
            </ol>
          </header>

          {noticeMessage && (
            <div className="delivery-notice" role="status" aria-live="polite">
              {noticeMessage}
            </div>
          )}

          <section className="delivery-hero" aria-label="Resumo do pedido antes da entrega">
            <div className="delivery-hero-copy">
              <p className="delivery-hero-label">Pedido em andamento</p>
              <h2>Seu presente ja esta quase pronto para envio</h2>
              <p className="delivery-hero-text">
                O pedido continua salvo temporariamente enquanto voce preenche esta etapa.
              </p>
            </div>

            <div className="delivery-hero-summary">
              <span>Total parcial</span>
              <strong>{formatCurrency(orderTotal)}</strong>
              <p>
                {remainingCapacity > 0
                  ? `${remainingCapacity} espacos ainda disponiveis na cesta`
                  : 'Capacidade maxima da cesta preenchida'}
              </p>
            </div>
          </section>

          <div className="delivery-layout">
            <section className="delivery-form-panel" aria-label="Formulario de entrega">
              <div className="delivery-section-header">
                <div>
                  <p className="delivery-section-label">Informacoes</p>
                  <h2>Preencha os dados da entrega</h2>
                </div>

                <span className="delivery-section-badge">Campos obrigatorios marcados com *</span>
              </div>

              <div className="delivery-form-sections">
                <div className="delivery-form-group">
                  <div className="delivery-form-group-header">
                    <p className="delivery-form-group-label">Contato</p>
                    <h3>Quem recebe e quem envia</h3>
                  </div>

                  <div className="delivery-form-grid">
                    <label className="delivery-field">
                      <span>Nome de quem recebe *</span>
                      <input
                        type="text"
                        name="recipientName"
                        value={formData.recipientName}
                        onChange={handleFieldChange}
                        placeholder="Ex.: Maria Oliveira"
                      />
                    </label>

                    <label className="delivery-field">
                      <span>Telefone de quem recebe *</span>
                      <input
                        type="tel"
                        name="recipientPhone"
                        value={formData.recipientPhone}
                        onChange={handleFieldChange}
                        placeholder="(11) 99999-9999"
                      />
                    </label>

                    <label className="delivery-field">
                      <span>Nome de quem envia *</span>
                      <input
                        type="text"
                        name="senderName"
                        value={formData.senderName}
                        onChange={handleFieldChange}
                        placeholder="Ex.: Joao Souza"
                      />
                    </label>

                    <label className="delivery-field">
                      <span>Telefone de quem envia</span>
                      <input
                        type="tel"
                        name="senderPhone"
                        value={formData.senderPhone}
                        onChange={handleFieldChange}
                        placeholder="(11) 98888-8888"
                      />
                    </label>
                  </div>
                </div>

                <div className="delivery-form-group">
                  <div className="delivery-form-group-header">
                    <p className="delivery-form-group-label">Endereco</p>
                    <h3>Local de entrega</h3>
                  </div>

                  <div className="delivery-form-grid">
                    <label className="delivery-field">
                      <span>CEP *</span>
                      <input
                        type="text"
                        name="cep"
                        value={formData.cep}
                        onChange={handleFieldChange}
                        placeholder="00000-000"
                      />
                    </label>

                    <label className="delivery-field delivery-field-span-2">
                      <span>Rua ou avenida *</span>
                      <input
                        type="text"
                        name="street"
                        value={formData.street}
                        onChange={handleFieldChange}
                        placeholder="Ex.: Rua das Oliveiras"
                      />
                    </label>

                    <label className="delivery-field">
                      <span>Numero *</span>
                      <input
                        type="text"
                        name="number"
                        value={formData.number}
                        onChange={handleFieldChange}
                        placeholder="123"
                      />
                    </label>

                    <label className="delivery-field">
                      <span>Complemento</span>
                      <input
                        type="text"
                        name="complement"
                        value={formData.complement}
                        onChange={handleFieldChange}
                        placeholder="Apto, bloco, referencia"
                      />
                    </label>

                    <label className="delivery-field">
                      <span>Bairro *</span>
                      <input
                        type="text"
                        name="neighborhood"
                        value={formData.neighborhood}
                        onChange={handleFieldChange}
                        placeholder="Ex.: Centro"
                      />
                    </label>

                    <label className="delivery-field">
                      <span>Cidade *</span>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleFieldChange}
                        placeholder="Ex.: Sao Paulo"
                      />
                    </label>

                    <label className="delivery-field">
                      <span>Estado *</span>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleFieldChange}
                        placeholder="SP"
                        maxLength={2}
                      />
                    </label>
                  </div>
                </div>

                <div className="delivery-form-group">
                  <div className="delivery-form-group-header">
                    <p className="delivery-form-group-label">Agendamento</p>
                    <h3>Preferencias da entrega</h3>
                  </div>

                  <div className="delivery-form-grid">
                    <label className="delivery-field">
                      <span>Data desejada *</span>
                      <input
                        type="date"
                        name="deliveryDate"
                        value={formData.deliveryDate}
                        onChange={handleFieldChange}
                      />
                    </label>

                    <label className="delivery-field">
                      <span>Periodo *</span>
                      <select
                        name="deliveryPeriod"
                        value={formData.deliveryPeriod}
                        onChange={handleFieldChange}
                      >
                        {deliveryPeriods.map((period) => (
                          <option key={period} value={period}>
                            {period}
                          </option>
                        ))}
                      </select>
                    </label>

                    <label className="delivery-field delivery-field-span-2">
                      <span>Mensagem para cartao</span>
                      <textarea
                        name="cardMessage"
                        value={formData.cardMessage}
                        onChange={handleFieldChange}
                        rows="4"
                        placeholder="Escreva uma dedicacao curta para acompanhar a cesta."
                      />
                    </label>

                    <label className="delivery-field delivery-field-span-2">
                      <span>Observacoes adicionais</span>
                      <textarea
                        name="observations"
                        value={formData.observations}
                        onChange={handleFieldChange}
                        rows="4"
                        placeholder="Referencia do local, restricao de horario ou instrucoes extras."
                      />
                    </label>
                  </div>
                </div>
              </div>
            </section>

            <aside className="delivery-summary-panel" aria-label="Resumo do pedido">
              <div className="delivery-section-header delivery-section-header-compact">
                <div>
                  <p className="delivery-section-label">Resumo</p>
                  <h2>Sua composicao atual</h2>
                </div>

                <span className="delivery-section-badge">{groupedCartItems.length} produtos</span>
              </div>

              <div className="delivery-summary-card">
                <div className="delivery-summary-row">
                  <span>Cesta base</span>
                  <strong>{formatCurrency(cart.selectedBasket.price)}</strong>
                </div>

                <div className="delivery-summary-row">
                  <span>Produtos</span>
                  <strong>{formatCurrency(itemsTotal)}</strong>
                </div>

                <div className="delivery-summary-row total">
                  <span>Total</span>
                  <strong>{formatCurrency(orderTotal)}</strong>
                </div>
              </div>

              <div className="delivery-items-list">
                {groupedCartItems.map((item) => (
                  <article key={item.id} className="delivery-item-card">
                    <div className="delivery-item-copy">
                      <h3>{item.name}</h3>
                      <p>{item.quantity} unidade(s)</p>
                    </div>

                    <strong>{formatCurrency(item.subtotal)}</strong>
                  </article>
                ))}
              </div>

              <div className="delivery-summary-actions">
                <Link to={routePaths.buildBasket} className="delivery-secondary-link">
                  Voltar para montagem
                </Link>

                <button
                  type="button"
                  className={`delivery-primary-button ${isFormValid ? '' : 'disabled'}`.trim()}
                  onClick={handleContinueToReview}
                >
                  Continuar para revisao
                </button>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </main>
  )
}

export default DeliveryPage
