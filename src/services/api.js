export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000').replace(/\/+$/, '')

function sendJson(path, method, body) {
  return fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }).then(async (response) => {
    const data = await response.json()
    if (!response.ok) {
      const error = new Error(data.error || 'The request could not be completed.')
      error.status = response.status
      throw error
    }
    return data
  })
}

export const createOrder = (order) => sendJson('/orders', 'POST', order)
export const updateLesson = (id, attributes) => sendJson(`/lessons/${id}`, 'PUT', attributes)

export function getLessons() {
  return fetch(`${API_BASE_URL}/lessons`)
    .then((response) => {
      if (!response.ok) throw new Error('Unable to load lessons. Please try again.')
      return response.json()
    })
    .then((lessons) => {
      if (!Array.isArray(lessons)) throw new Error('Unexpected lesson response from the server.')
      return lessons
    })
}
