// ui.js - UI state management and controls
import { updateSelectedColor } from './canvas.js'
import { saveToStorage, loadFromStorage, clearFromStorage } from './storage.js'

// UI elements
const toolBtns = document.querySelectorAll(".tool")
const fillColor = document.querySelector("#fill-color")
const colorBtns = document.querySelectorAll(".colors .option")
const sizeSlider = document.querySelector("#size-slider")

// UI state
export let selectedTool = "brush"
export let brushWidth = 5

export const saveUIState = () => saveToStorage('paintAppUIState', {
  selectedTool, brushWidth,
  fillColorChecked: fillColor.checked,
  selectedColorIndex: Array.from(colorBtns).findIndex(btn => btn.classList.contains('selected'))
})

export const loadUIState = () => {
  const state = loadFromStorage('paintAppUIState')
  if (!state) return false
  
  selectedTool = state.selectedTool || "brush"
  brushWidth = state.brushWidth || 5
  
  // Update UI elements
  toolBtns.forEach(btn => btn.classList.remove('active'))
  document.querySelector(`#${selectedTool}`)?.classList.add('active')
  
  sizeSlider.value = brushWidth
  fillColor.checked = state.fillColorChecked || false
  
  if (state.selectedColorIndex >= 0) {
    colorBtns.forEach(btn => btn.classList.remove('selected'))
    colorBtns[state.selectedColorIndex]?.classList.add('selected')
    
    // Update the selected color
    const selectedBtn = colorBtns[state.selectedColorIndex]
    if (selectedBtn) {
      updateSelectedColor(window.getComputedStyle(selectedBtn).backgroundColor)
    }
  }
  return true
}

export const resetUIToDefaults = () => {
  selectedTool = "brush"
  brushWidth = 5
  fillColor.checked = false
  sizeSlider.value = 5
  
  toolBtns.forEach(btn => btn.classList.remove('active'))
  document.querySelector("#brush").classList.add('active')
  colorBtns.forEach(btn => btn.classList.remove('selected'))
  colorBtns[1].classList.add('selected')
  
  updateSelectedColor("#000")
  clearFromStorage('paintAppUIState')
}

export const setupUIEvents = () => {
  // Tool selection
  toolBtns.forEach(btn => btn.addEventListener("click", () => {
    document.querySelector(".options .active").classList.remove("active")
    btn.classList.add("active")
    selectedTool = btn.id
    saveUIState()
  }))

  // Size control
  sizeSlider.addEventListener("input", () => {
    brushWidth = parseInt(sizeSlider.value)
    saveUIState()
  })

  // Color selection
  colorBtns.forEach(btn => btn.addEventListener("click", () => {
    document.querySelector(".options .selected").classList.remove("selected")
    btn.classList.add("selected")
    updateSelectedColor(window.getComputedStyle(btn).backgroundColor)
    saveUIState()
  }))

  // Fill color toggle
  fillColor.addEventListener("change", saveUIState)
}