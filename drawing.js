// drawing.js - Main drawing functionality

// Import dependencies and shared state
import { canvas, ctx, selectedColor, saveCanvasData } from './canvas.js'
import { selectedTool, brushWidth } from './ui.js'
import { drawingActions } from './shapes.js'
import { saveState } from './undoRedo.js'

// Drawing state variables
let prevMouseX, prevMouseY, snapshot, isDrawing = false

// Start drawing: record initial mouse position and save canvas snapshot
export const startDraw = (e) => {
  isDrawing = true
  prevMouseX = e.offsetX
  prevMouseY = e.offsetY
  ctx.beginPath()
  ctx.lineWidth = brushWidth
  ctx.strokeStyle = ctx.fillStyle = selectedColor
  snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height)
}

// Handle drawing as mouse moves
export const drawing = (e) => {
  if (!isDrawing) return
  ctx.putImageData(snapshot, 0, 0) // Restore snapshot before drawing

  // Draw with brush or eraser
  if (selectedTool === "brush" || selectedTool === "eraser") {
    ctx.strokeStyle = selectedTool === "eraser" ? "#fff" : selectedColor
    ctx.lineTo(e.offsetX, e.offsetY)
    ctx.stroke()
  // Draw shapes using the selected tool
  } else if (drawingActions[selectedTool]) {
    drawingActions[selectedTool](e, prevMouseX, prevMouseY)
  }
}

// Stop drawing and save state
export const stopDraw = () => {
  if (isDrawing) {
    isDrawing = false
    saveState()        // Save for undo/redo
    saveCanvasData()   // Save canvas to storage
  }
}

// Setup mouse and touch event listeners for drawing
export const setupDrawingEvents = () => {
  // Mouse events
  canvas.addEventListener("mousedown", startDraw)
  canvas.addEventListener("mousemove", drawing)
  canvas.addEventListener("mouseup", stopDraw)
  canvas.addEventListener("mouseleave", stopDraw)
  document.addEventListener("mouseup", stopDraw)

  // Touch events: convert touch to mouse events for compatibility
  canvas.addEventListener("touchstart", (e) => {
    e.preventDefault()
    const touch = e.touches[0]
    canvas.dispatchEvent(new MouseEvent("mousedown", {
      clientX: touch.clientX, clientY: touch.clientY
    }))
  })

  canvas.addEventListener("touchmove", (e) => {
    e.preventDefault()
    const touch = e.touches[0]
    canvas.dispatchEvent(new MouseEvent("mousemove", {
      clientX: touch.clientX, clientY: touch.clientY
    }))
  })

  canvas.addEventListener("touchend", () => {
    canvas.dispatchEvent(new MouseEvent("mouseup", {}))
  })
}