// storage.js - All localStorage operations
export const saveToStorage = (key, data) => {
  try { localStorage.setItem(key, JSON.stringify(data)) } catch(e) {}
}

export const loadFromStorage = (key) => {
  try { return JSON.parse(localStorage.getItem(key)) } catch(e) { return null }
}

export const clearFromStorage = (key) => {
  try { localStorage.removeItem(key) } catch(e) {}
}