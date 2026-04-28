const BASE_URL = import.meta.env.VITE_API_BASE_URL

export async function apiGet(path) {
  const response = await fetch(`${BASE_URL}${path}`)

  if (!response.ok) {
    throw new Error(`Erro ${response.status}`)
  }

  return response.json()
}

export async function apiPost(path, body) {
  const response = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    throw new Error(`Erro ${response.status}`)
  }

  return response.json()
}

const httpClient = {
  get: apiGet,
  post: apiPost,
}

export default httpClient
