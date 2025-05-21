// utils.js
// Contains utilities for canvas management, color handling, and tool selection

// Canvas functions
/**
 * Initialize the canvas by setting its dimensions
 * @param {HTMLCanvasElement} canvas - The canvas element
 * @param {CanvasRenderingContext2D} ctx - The canvas context
 */
export function initCanvas(canvas, ctx) {
  // Set canvas dimensions to match its offset dimensions
  canvas.width = canvas.offsetWidth
  canvas.height = canvas.offsetHeight
  
  // Set the canvas background
  setCanvasBackground(ctx, canvas)
}

/**
 * Set the canvas background color
 * @param {CanvasRenderingContext2D} ctx - The canvas context
 * @param {HTMLCanvasElement} canvas - The canvas element
 * @param {string} selectedColor - Current selected color (for ctx.fillStyle after setting bg)
 */
export function setCanvasBackground(ctx, canvas, selectedColor = null) {
  // Set the canvas background color to white
  ctx.fillStyle = "#fff"
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  
  // Restore the selected fill color if provided
  if (selectedColor) {
    ctx.fillStyle = selectedColor
  }
}

/**
 * Clear the canvas
 * @param {CanvasRenderingContext2D} ctx - The canvas context
 * @param {HTMLCanvasElement} canvas - The canvas element
 * @param {string} selectedColor - Current selected color
 */
export function clearCanvas(ctx, canvas, selectedColor) {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  setCanvasBackground(ctx, canvas, selectedColor)
}

/**
 * Save the canvas as an image
 * @param {HTMLCanvasElement} canvas - The canvas element
 */
export function saveCanvasAsImage(canvas) {
  const link = document.createElement("a")
  link.download = `${Date.now()}.jpg`
  link.href = canvas.toDataURL()
  link.click()
}

// Color Tool functions
/**
 * Set up color buttons by adding event listeners
 * @param {NodeList} colorBtns - Collection of color option elements
 * @param {function} setActiveColorClass - Function to update the active color class
 * @param {function} updateSelectedColor - Function to update the selected color
 */
export function setupColorButtons(colorBtns, setActiveColorClass, updateSelectedColor) {
  colorBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      // Update the selected class
      setActiveColorClass(btn)
      
      // Get the background color of the clicked button
      const computedStyle = window.getComputedStyle(btn)
      const bgColor = computedStyle.getPropertyValue("background-color")
      
      // Update the selected color
      updateSelectedColor(bgColor)
    })
  })
}

/**
 * Set up the color picker
 * @param {HTMLElement} colorPicker - The color picker element
 * @param {function} updateParentBackground - Function to update parent element background
 * @param {function} triggerClick - Function to trigger click event
 */
export function setupColorPicker(colorPicker, updateParentBackground, triggerClick) {
  colorPicker.addEventListener("change", () => {
    // Update the background color of the parent element
    updateParentBackground(colorPicker.value)
    
    // Trigger a click event on the parent element
    triggerClick()
  })
}

// Tool Selection functions
/**
 * Set up tool buttons by adding event listeners
 * @param {NodeList} toolBtns - Collection of tool buttons
 * @param {function} setActiveToolClass - Function to update the active tool class
 * @param {function} updateSelectedTool - Function to update the selected tool
 */
export function setupToolButtons(toolBtns, setActiveToolClass, updateSelectedTool) {
  toolBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      // Remove active class from previously selected tool
      document.querySelector(".options .active").classList.remove("active")
      
      // Add active class to the clicked tool
      btn.classList.add("active")
      
      // Update the selected tool
      updateSelectedTool(btn.id)
    })
  })
}

/**
 * Set up the size slider
 * @param {HTMLElement} sizeSlider - The size slider element
 * @param {function} updateBrushWidth - Function to update the brush width
 */
export function setupSizeSlider(sizeSlider, updateBrushWidth) {
  sizeSlider.addEventListener("change", () => {
    updateBrushWidth(sizeSlider.value)
  })
}