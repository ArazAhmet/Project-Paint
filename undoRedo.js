// undoRedo.js - Undo/Redo functionality

import { canvas, ctx, saveCanvasData } from './canvas.js'
import { saveToStorage, loadFromStorage } from './storage.js'

// Stacks to keep track of undo and redo states
let undoStack = []
let redoStack = []
const maxUndoSteps = 30 // Maximum number of undo steps to keep

// Save undo/redo stacks to storage (limit undoStack to 10 for storage)
const saveUndoRedoData = () => {
  if (undoStack.length > 10) {
    undoStack = undoStack.slice(-10)
    redoStack = []
  }
  saveToStorage('paintAppUndoRedo', { undoStack, redoStack })
}

// Load undo/redo stacks from storage
export const loadUndoRedoData = () => {
  const data = loadFromStorage('paintAppUndoRedo')
  if (data) {
    undoStack = data.undoStack || []
    redoStack = data.redoStack || []
    return true
  }
  return false
}

// Save current canvas state to undo stack
export const saveState = () => {
  if (undoStack.length >= maxUndoSteps) undoStack.shift()
  undoStack.push(canvas.toDataURL())
  redoStack = []
  saveUndoRedoData()
}

// Restore canvas state from a dataURL
const restoreState = (dataURL) => {
  const img = new Image()
  img.onload = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(img, 0, 0)
    saveCanvasData()
  }
  img.src = dataURL
}

// Undo the last action
export const undo = () => {
  if (undoStack.length > 1) {
    const currentState = undoStack[undoStack.length - 1]
    const previousState = undoStack[undoStack.length - 2]
    
    if (currentState !== previousState) {
      redoStack.push(undoStack.pop())
      restoreState(undoStack[undoStack.length - 1])
      saveUndoRedoData()
    }
  }
}

// Redo the last undone action
export const redo = () => {
  if (redoStack.length > 0) {
    const redoState = redoStack.pop()
    const currentState = undoStack[undoStack.length - 1]
    
    if (redoState !== currentState) {
      undoStack.push(redoState)
      restoreState(redoState)
      saveUndoRedoData()
    }
  }
}

// Clear both undo and redo stacks
export const clearUndoRedo = () => {
  undoStack = []
  redoStack = []
}