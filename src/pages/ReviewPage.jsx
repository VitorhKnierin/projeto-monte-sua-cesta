import { useMemo, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useCart } from '../context'
import routePaths from '../routes/routePaths'
import { createOrder } from '../services'
import { formatCurrency } from '../utils'

function getProductCode(product) {
  return product.code ?? product.codigo ?? product.id
}

function getDeliveryTime(deliveryPeriod) {
  if (deliveryPeriod?.startsWith('Tarde')) {
    return '14:00:00'
  }

  if (deliveryPeriod?.startsWith('Noite')) {
    return '19:00:00'
  }

  return '09:00:00'
}

function buildAddress(delivery) {
  return [
    delivery.street,
    delivery.number,
    delivery.complement,
    delivery.neighborhood,
    delivery.city,
    delivery.state,
    delivery.cep,
  ]
    .filter(Boolean)
    .join(', ')
}

function ReviewPage() {
  const navigate = useNavigate()
  const { cart, setCart, itemsTotal, orderTotal } = useCart()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

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

  if (!cart.selectedBasket) {
    return <Navigate to={routePaths.selectBasket} replace />
  }

  if (cart.items.length === 0) {
    return <Navigate to={routePaths.buildBasket} replace />
  }

  if (!cart.delivery) {
    return <Navigate to={routePaths.delivery} replace />
  }

  async function handleSubmitOrder() {
    if (isSubmitting || hasSubmitted) {
      return
    }

    setIsSubmitting(true)
    setErrorMessage('')

    const productCodes = [
      getProductCode(cart.selectedBasket),
      ...cart.items.map((item) => getProductCode(item)),
    ]

    const orderPayload = {
      cliente_nome: cart.delivery.senderName,
      cliente_cpf_cnpj: cart.delivery.senderDocument,
      cliente_telefone: cart.delivery.senderPhone || cart.delivery.recipientPhone,
      lista_codigos_produtos: productCodes.join(','),
      preco_total: Number(orderTotal.toFixed(2)),
      entrega_destinatario_nome: cart.delivery.recipientName,
      entrega_destinatario_endereco: buildAddress(cart.delivery),
      entrega_data_horario: `${cart.delivery.deliveryDate} ${getDeliveryTime(cart.delivery.deliveryPeriod)}`,
    }

    try {
      await createOrder(orderPayload)
      setHasSubmitted(true)
      setCart({
        selectedBasket: null,
        items: [],
        delivery: null,
      })
      navigate(routePaths.success, { replace: true })
    } catch {
      setErrorMessage('Nao foi possivel cadastrar o pedido. Tente novamente.')
      setIsSubmitting(false)
    }
  }

  return (
    <main>
      <h1>Revisao do Pedido</h1>
      <p>Confira os dados antes de finalizar o pedido.</p>

      {errorMessage && <p role="alert">{errorMessage}</p>}

      <section aria-label="Resumo dos valores">
        <h2>Resumo</h2>
        <p>Cesta: {formatCurrency(cart.selectedBasket.price)}</p>
        <p>Produtos: {formatCurrency(itemsTotal)}</p>
        <p>Total: {formatCurrency(orderTotal)}</p>
      </section>

      <section aria-label="Itens escolhidos">
        <h2>Itens</h2>
        <p>{cart.selectedBasket.name}</p>

        {groupedCartItems.map((item) => (
          <p key={item.id}>
            {item.name} - {item.quantity} unidade(s) - {formatCurrency(item.subtotal)}
          </p>
        ))}
      </section>

      <section aria-label="Dados de entrega">
        <h2>Entrega</h2>
        <p>Cliente: {cart.delivery.senderName}</p>
        <p>Destinatario: {cart.delivery.recipientName}</p>
        <p>Endereco: {buildAddress(cart.delivery)}</p>
        <p>
          Data: {cart.delivery.deliveryDate} - {cart.delivery.deliveryPeriod}
        </p>
      </section>

      <nav>
        <Link to={routePaths.delivery}>Voltar</Link>
        {' | '}
        <button type="button" onClick={handleSubmitOrder} disabled={isSubmitting || hasSubmitted}>
          {isSubmitting ? 'Enviando...' : 'Finalizar Pedido'}
        </button>
      </nav>
    </main>
  )
}

export default ReviewPage
