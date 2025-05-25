// canvas.js - Canvas setup and management

// Get the canvas element and its 2D context
export const canvas = document.querySelector("canvas")
export const ctx = canvas.getContext("2d")

// Currently selected drawing color
export let selectedColor = "#000"

// Fill the canvas with a white background and reset fillStyle
export const setCanvasBackground = () => {
  ctx.fillStyle = "#fff"
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.fillStyle = selectedColor
}

// Initialize canvas size and set background
export const initCanvas = () => {
  canvas.width = canvas.offsetWidth
  canvas.height = canvas.offsetHeight
  setCanvasBackground()
}

// Save current canvas image to localStorage
export const saveCanvasData = () => {
  try {
    localStorage.setItem('paintAppCanvas', canvas.toDataURL())
  } catch(e) {}
}

// Load canvas image from localStorage
export const loadCanvasData = () => {
  try {
    const saved = localStorage.getItem('paintAppCanvas')
    if (saved) {
      const img = new Image()
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(img, 0, 0)
      }
      img.src = saved
      return saved
    }
  } catch(e) {}
  return null
}

// Clear the canvas and reset background
export const clearCanvasData = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  setCanvasBackground()
}

// Update the selected drawing color
export const updateSelectedColor = (color) => {
  selectedColor = color
}