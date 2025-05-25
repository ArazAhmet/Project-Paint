// undoRedo.js - Undo/Redo with 30 steps but smart storage

import { canvas, ctx, saveCanvasData } from './canvas.js'
import { saveToStorage, loadFromStorage } from './storage.js'

// Keep full 30 undo history in memory, but limit storage saves
let undoStack = []
let redoStack = []
const MAX_HISTORY = 30 // Full 30 undos as requested
const STORAGE_LIMIT = 3 // Only save 3 states to storage to avoid overflow

// Load minimal undo data from storage (session restore)
export const loadUndoRedoData = () => {
  try {
    const data = loadFromStorage('paintAppUndoRedo')
    if (data && data.undoStack && data.undoStack.length > 0) {
      // Only load a few states from storage
      undoStack = data.undoStack.slice(-STORAGE_LIMIT)
      redoStack = [] // Don't restore redo from storage
      return true
    }
  } catch (e) {
    console.warn('Could not load undo/redo data, starting fresh')
  }
  return false
}

// Save current canvas state to undo stack
export const saveState = () => {
  try {
    // Remove oldest state if we're at the 30 limit
    if (undoStack.length >= MAX_HISTORY) {
      undoStack.shift() // Remove oldest
    }
    
    // Save current state to memory
    undoStack.push(canvas.toDataURL())
    
    // Clear redo stack when new action is performed
    redoStack = []
    
    // Save to storage much less frequently to avoid overflow
    // Only save every 5th state, and only keep 3 in storage
    if (undoStack.length % 5 === 0) {
      try {
        const statesToSave = undoStack.slice(-STORAGE_LIMIT) // Only last 3 states
        saveToStorage('paintAppUndoRedo', { 
          undoStack: statesToSave
        })
      } catch (storageError) {
        // Storage failed, but continue working - undo/redo still works for session
        console.warn('Storage full, continuing without saving history to storage')
      }
    }
    
  } catch (e) {
    console.warn('Could not save undo state to memory')
  }
}

// Restore canvas from a data URL
const restoreCanvas = (dataURL) => {
  const img = new Image()
  img.onload = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(img, 0, 0)
    saveCanvasData() // Save to main canvas storage
  }
  img.onerror = () => {
    console.warn('Could not restore canvas state')
  }
  img.src = dataURL
}

// Undo the last action
export const undo = () => {
  if (undoStack.length > 1) {
    // Move current state to redo stack
    const currentState = undoStack.pop()
    redoStack.push(currentState)
    
    // Restore previous state
    const previousState = undoStack[undoStack.length - 1]
    restoreCanvas(previousState)
    
    console.log(`Undo: ${undoStack.length} undo states, ${redoStack.length} redo states`)
  } else {
    console.log('No more undo states available')
  }
}

// Redo the last undone action
export const redo = () => {
  if (redoStack.length > 0) {
    // Move redo state back to undo stack
    const redoState = redoStack.pop()
    undoStack.push(redoState)
    
    // Restore the redo state
    restoreCanvas(redoState)
    
    console.log(`Redo: ${undoStack.length} undo states, ${redoStack.length} redo states`)
  } else {
    console.log('No more redo states available')
  }
}

// Clear both stacks
export const clearUndoRedo = () => {
  undoStack = []
  redoStack = []
  console.log('Undo/Redo history cleared')
}