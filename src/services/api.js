export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000').replace(/\/+$/, '')

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
