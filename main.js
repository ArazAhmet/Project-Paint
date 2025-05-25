// main.js - Main entry point that orchestrates everything
import { initCanvas, loadCanvasData, clearCanvasData, saveCanvasData } from './canvas.js'
import { loadUndoRedoData, saveState, undo, redo, clearUndoRedo } from './undoRedo.js'
import { loadUIState, saveUIState, resetUIToDefaults, setupUIEvents } from './ui.js'
import { setupDrawingEvents } from './drawing.js'
import { clearFromStorage } from './storage.js'

// Initialize the application
const init = () => {
  // Setup canvas
  initCanvas()
  
  // Load saved states
  loadUIState()
  const savedCanvas = loadCanvasData()
  
  // Setup undo/redo
  if (savedCanvas) {
    if (!loadUndoRedoData()) {
      // No undo data, create initial state from saved canvas
      saveState()
    }
  } else {
    // No saved canvas, load any existing undo data and save initial blank state
    loadUndoRedoData()
    saveState()
  }
  
  // Setup all event listeners
  setupUIEvents()
  setupDrawingEvents()
  setupAppEvents()
}

// Application-level events
const setupAppEvents = () => {
  // Undo/Redo buttons
  document.querySelector("#undo-btn").addEventListener("click", undo)
  document.querySelector("#redo-btn").addEventListener("click", redo)

  // Keyboard shortcuts
  document.addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.key === 'z' && !e.shiftKey) { e.preventDefault(); undo() }
    if (e.ctrlKey && (e.key === 'y' || (e.shiftKey && e.key === 'z'))) { e.preventDefault(); redo() }
  })

  // Clear canvas
  document.querySelector(".clear-canvas").addEventListener("click", () => {
    clearCanvasData()
    resetUIToDefaults()
    clearUndoRedo()
    clearFromStorage('paintAppCanvas')
    clearFromStorage('paintAppUndoRedo')
    saveState()
    saveUIState()
  })

  // Save image
  document.querySelector(".save-img").addEventListener("click", () => {
    const canvas = document.querySelector("canvas")
    const link = document.createElement("a")
    link.download = `${Date.now()}.jpg`
    link.href = canvas.toDataURL()
    link.click()
  })
}

// Start the application when page loads
window.addEventListener("load", init)