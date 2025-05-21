// tools.js
// Contains all drawing tools functionality (shapes and brush tools)

/**
 * Draws a square on the canvas
 * @param {CanvasRenderingContext2D} ctx - The canvas context
 * @param {Event} e - The mouse event
 * @param {number} prevMouseX - Previous mouse X position
 * @param {number} prevMouseY - Previous mouse Y position
 * @param {boolean} fillShape - Whether to fill the shape
 */
export function drawSquare(ctx, e, prevMouseX, prevMouseY, fillShape) {
  if (!fillShape) {
    return ctx.strokeRect(
      e.offsetX,
      e.offsetY,
      prevMouseX - e.offsetX,
      prevMouseY - e.offsetY
    )
  }
  ctx.fillRect(
    e.offsetX,
    e.offsetY,
    prevMouseX - e.offsetX,
    prevMouseY - e.offsetY
  )
}

/**
 * Draws a circle on the canvas
 * @param {CanvasRenderingContext2D} ctx - The canvas context
 * @param {Event} e - The mouse event
 * @param {number} prevMouseX - Previous mouse X position
 * @param {number} prevMouseY - Previous mouse Y position
 * @param {boolean} fillShape - Whether to fill the shape
 */
export function drawCircle(ctx, e, prevMouseX, prevMouseY, fillShape) {
  ctx.beginPath()
  let radius = Math.sqrt(
    Math.pow(prevMouseX - e.offsetX, 2) + Math.pow(prevMouseY - e.offsetY, 2)
  )
  ctx.arc(
    prevMouseX,
    prevMouseY,
    radius,
    0,
    2 * Math.PI
  )
  fillShape ? ctx.fill() : ctx.stroke()
}

/**
 * Draws a triangle on the canvas
 * @param {CanvasRenderingContext2D} ctx - The canvas context
 * @param {Event} e - The mouse event
 * @param {number} prevMouseX - Previous mouse X position
 * @param {number} prevMouseY - Previous mouse Y position
 * @param {boolean} fillShape - Whether to fill the shape
 */
export function drawTriangle(ctx, e, prevMouseX, prevMouseY, fillShape) {
  ctx.beginPath()
  ctx.moveTo(prevMouseX, prevMouseY)
  ctx.lineTo(e.offsetX, e.offsetY)
  ctx.lineTo(prevMouseX * 2 - e.offsetX, e.offsetY)
  ctx.closePath()
  fillShape ? ctx.fill() : ctx.stroke()
}

/**
 * Draw with the brush or eraser
 * @param {CanvasRenderingContext2D} ctx - The canvas context
 * @param {Event} e - The mouse event
 * @param {string} selectedTool - Currently selected tool
 * @param {string} selectedColor - Selected color
 */
export function drawWithBrush(ctx, e, selectedTool, selectedColor) {
  // Set the stroke color based on the selected tool
  ctx.strokeStyle = selectedTool === "eraser" ? "#fff" : selectedColor
  
  // Draw the line to the current mouse position
  ctx.lineTo(e.offsetX, e.offsetY)
  ctx.stroke()
}