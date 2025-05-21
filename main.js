// main.js
// Main application file that imports tools and utilities and handles initialization

import { 
  drawSquare, drawCircle, drawTriangle, drawWithBrush 
} from './tools.js'

import { 
  initCanvas, setCanvasBackground, clearCanvas, saveCanvasAsImage,
  setupColorButtons, setupColorPicker, setupToolButtons, setupSizeSlider
} from './utils.js'

// Constants
const DEFAULT_BRUSH_WIDTH = 5
const DEFAULT_COLOR = "#000"
const DEFAULT_TOOL = "brush"

// DOM elements
const canvas = document.querySelector("canvas")
const toolBtns = document.querySelectorAll(".tool")
const fillColor = document.querySelector("#fill-color")
const sizeSlider = document.querySelector("#size-slider")
const colorBtns = document.querySelectorAll(".colors .option")
const colorPicker = document.querySelector("#color-picker")
const clearCanvasBtn = document.querySelector(".clear-canvas")
const saveImgBtn = document.querySelector(".save-img")

// Initialize context
const ctx = canvas.getContext("2d")

// Application state
let state = {
  isDrawing: false,
  selectedTool: DEFAULT_TOOL,
  brushWidth: DEFAULT_BRUSH_WIDTH,
  selectedColor: DEFAULT_COLOR,
  prevMouseX: 0,
  prevMouseY: 0,
  snapshot: null
}

// Initialize the canvas when the window loads
window.addEventListener("load", () => {
  initCanvas(canvas, ctx)
})

// Helper functions
const updateSelectedTool = (tool) => {
  state.selectedTool = tool
  console.log(state.selectedTool)
}

const updateBrushWidth = (width) => {
  state.brushWidth = width
}

const updateSelectedColor = (color) => {
  state.selectedColor = color
}

const setActiveColorClass = (element) => {
  document.querySelector(".options .selected").classList.remove("selected")
  element.classList.add("selected")
}

// Helper function to set active tool class
function setActiveToolClass(element) {
  document.querySelector(".options .active").classList.remove("active")
  element.classList.add("active")
}

// Event handling functions
function startDrawing(e) {
  state.isDrawing = true
  state.prevMouseX = e.offsetX
  state.prevMouseY = e.offsetY
  ctx.beginPath()
  ctx.lineWidth = state.brushWidth
  ctx.strokeStyle = state.selectedColor
  ctx.fillStyle = state.selectedColor
  
  // Take a snapshot of the canvas
  state.snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height)
}

function drawing(e) {
  if (!state.isDrawing) return
  
  // Restore the canvas to the snapshot
  ctx.putImageData(state.snapshot, 0, 0)

  // Handle different drawing tools
  if (state.selectedTool === "brush" || state.selectedTool === "eraser") {
    drawWithBrush(ctx, e, state.selectedTool, state.selectedColor)
  } else if (state.selectedTool === "square") {
    drawSquare(ctx, e, state.prevMouseX, state.prevMouseY, fillColor.checked)
  } else if (state.selectedTool === "circle") {
    drawCircle(ctx, e, state.prevMouseX, state.prevMouseY, fillColor.checked)
  } else if (state.selectedTool === "triangle") {
    drawTriangle(ctx, e, state.prevMouseX, state.prevMouseY, fillColor.checked)
  }
}

function stopDrawing() {
  state.isDrawing = false
}

// Set up tools
setupToolButtons(toolBtns, setActiveToolClass, updateSelectedTool)
setupSizeSlider(sizeSlider, updateBrushWidth)

// Set up colors
setupColorButtons(colorBtns, setActiveColorClass, updateSelectedColor)
setupColorPicker(colorPicker, (color) => {
  colorPicker.parentElement.style.background = color
}, () => colorPicker.parentElement.click())

// Button event listeners
clearCanvasBtn.addEventListener("click", () => {
  clearCanvas(ctx, canvas, state.selectedColor)
})

saveImgBtn.addEventListener("click", () => {
  saveCanvasAsImage(canvas)
})

// Canvas event listeners
canvas.addEventListener("mousedown", startDrawing)
canvas.addEventListener("mousemove", drawing)
canvas.addEventListener("mouseup", stopDrawing)