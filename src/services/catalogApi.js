import heroImage from '../assets/hero.png'
import { apiGet, apiPost } from './httpClient'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

const BASKET_CAPACITY_BY_CODE = {
  1: 6,
  2: 10,
  3: 14,
}

const PRODUCT_CATEGORIES = [
  {
    path: '/produtos/categoria/item_comestivel',
    label: 'Itens comestiveis',
  },
  {
    path: '/produtos/categoria/bebida',
    label: 'Bebidas',
  },
  {
    path: '/produtos/categoria/cartao_de_mensagem',
    label: 'Cartoes de mensagem',
  },
  {
    path: '/produtos/categoria/presente_tematico',
    label: 'Presentes tematicos',
  },
  {
    path: '/produtos/categoria/decoracao_cesta',
    label: 'Decoracao da cesta',
  },
]

function buildImageUrl(photo) {
  if (!photo) {
    return heroImage
  }

  if (photo.startsWith('http://') || photo.startsWith('https://')) {
    return photo
  }

  if (photo.startsWith('/')) {
    return `${API_BASE_URL}${photo}`
  }

  return `${API_BASE_URL}/imgs/${photo}`
}

function normalizePrice(price) {
  const normalizedPrice = Number(price)

  return Number.isNaN(normalizedPrice) ? 0 : normalizedPrice
}

function normalizeProduct(product, categoryLabel) {
  const code = String(product.codigo)

  return {
    id: code,
    code,
    codigo: product.codigo,
    category: categoryLabel ?? product.categoria,
    image: buildImageUrl(product.foto),
    name: product.nome,
    description: product.descricao,
    stockQuantity: product.quantidade_estoque,
    price: normalizePrice(product.preco),
    raw: product,
  }
}

function getListFromResponse(response) {
  if (Array.isArray(response)) {
    return response
  }

  if (Array.isArray(response?.data)) {
    return response.data
  }

  if (Array.isArray(response?.produtos)) {
    return response.produtos
  }

  return []
}

function normalizeBasket(product) {
  const basket = normalizeProduct(product, 'Cesta selecionavel')

  return {
    ...basket,
    capacity: BASKET_CAPACITY_BY_CODE[product.codigo] ?? 10,
  }
}

export async function getBaskets() {
  const baskets = await apiGet('/produtos/categoria/cesta')

  return getListFromResponse(baskets).map(normalizeBasket)
}

export async function getProductsByCategories() {
  const categoryResults = await Promise.all(
    PRODUCT_CATEGORIES.map(async (category) => {
      const products = await apiGet(category.path)

      return getListFromResponse(products).map((product) => normalizeProduct(product, category.label))
    }),
  )

  return categoryResults.flat()
}

export async function createOrder(orderPayload) {
  return apiPost('/pedidos/cadastrar', orderPayload)
}

export { PRODUCT_CATEGORIES }
