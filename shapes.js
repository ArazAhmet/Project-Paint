// shapes.js - All shape drawing functions
import { ctx } from './canvas.js'

// Get the fill color checkbox element
const fillColor = document.querySelector("#fill-color")

// Draw a rectangle based on mouse positions
export const drawRect = (e, prevMouseX, prevMouseY) => {
  // Choose fill or stroke method based on checkbox
  const method = fillColor.checked ? 'fillRect' : 'strokeRect'
  ctx[method](e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY)
}

// Draw a circle based on mouse positions
export const drawCircle = (e, prevMouseX, prevMouseY) => {
  ctx.beginPath()
  // Calculate radius using distance formula
  const radius = Math.sqrt((prevMouseX - e.offsetX) ** 2 + (prevMouseY - e.offsetY) ** 2)
  ctx.arc(prevMouseX, prevMouseY, radius, 0, 2 * Math.PI)
  // Fill or stroke the circle
  fillColor.checked ? ctx.fill() : ctx.stroke()
}

// Draw a triangle based on mouse positions
export const drawTriangle = (e, prevMouseX, prevMouseY) => {
  ctx.beginPath()
  ctx.moveTo(prevMouseX, prevMouseY) // Start at initial mouse position
  ctx.lineTo(e.offsetX, e.offsetY) // Draw to current mouse position
  ctx.lineTo(prevMouseX * 2 - e.offsetX, e.offsetY) // Draw to mirrored point
  ctx.closePath()
  // Fill or stroke the triangle
  fillColor.checked ? ctx.fill() : ctx.stroke()
}

// Export drawing actions for each shape
export const drawingActions = { 
  square: drawRect, 
  circle: drawCircle, 
  triangle: drawTriangle 
}