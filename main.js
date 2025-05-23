// Select the canvas element from the DOM
const canvas = document.querySelector("canvas")

// Select all tools
const toolBtns = document.querySelectorAll(".tool")
const fillColor = document.querySelector("#fill-color")
const colorBtns = document.querySelectorAll(".colors .option")
const sizeSlider = document.querySelector("#size-slider")
const clearCanvas = document.querySelector(".clear-canvas")
const saveImg = document.querySelector(".save-img")

// Get the 2D rendering context for the canvas
const ctx = canvas.getContext("2d")

// Initialize variables
let prevMouseX, prevMouseY, snapshot
let isDrawing = false
let selectedTool = "brush"
let brushWidth = 5
let selectedColor = "#000" // Default to black

// Set canvas background to white
const setCanvasBackground = () => {
  ctx.fillStyle = "#fff"
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.fillStyle = selectedColor // Reset fillStyle to selected color
}

// Save canvas data to localStorage
const saveCanvasData = () => {
  try {
    const canvasData = canvas.toDataURL()
    localStorage.setItem('paintAppCanvas', canvasData)
    console.log('Canvas data saved')
  } catch (error) {
    console.error('Failed to save canvas data:', error)
  }
}

// Load canvas data from localStorage
const loadCanvasData = () => {
  try {
    const savedData = localStorage.getItem('paintAppCanvas')
    if (savedData) {
      const img = new Image()
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(img, 0, 0)
        console.log('Canvas data loaded')
      }
      img.src = savedData
    }
  } catch (error) {
    console.error('Failed to load canvas data:', error)
  }
}

// Clear saved canvas data from localStorage
const clearSavedData = () => {
  try {
    localStorage.removeItem('paintAppCanvas')
    console.log('Saved canvas data cleared')
  } catch (error) {
    console.error('Failed to clear saved data:', error)
  }
}

// Initialize canvas when window loads
window.addEventListener("load", () => {
  // Set canvas dimensions
  canvas.width = canvas.offsetWidth
  canvas.height = canvas.offsetHeight
  setCanvasBackground()
  
  // Initialize brush width from slider's current value
  brushWidth = parseInt(sizeSlider.value)
  console.log("Initial brush width set to:", brushWidth)
  
  // Load saved canvas data
  loadCanvasData()
})

// Drawing functions

// Draw rectangle
const drawRect = (e) => {
  if (!fillColor.checked) {
    // Only stroke rectangle with border
    return ctx.strokeRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY)
  }
  // Draw filled rectangle
  ctx.fillRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY)
}

// Draw circle
const drawCircle = (e) => {
  ctx.beginPath()
  let radius = Math.sqrt(Math.pow((prevMouseX - e.offsetX), 2) + Math.pow((prevMouseY - e.offsetY), 2))
  ctx.arc(prevMouseX, prevMouseY, radius, 0, 2 * Math.PI)
  fillColor.checked ? ctx.fill() : ctx.stroke()
}

// Draw triangle
const drawTriangle = (e) => {
  ctx.beginPath()
  ctx.moveTo(prevMouseX, prevMouseY)
  ctx.lineTo(e.offsetX, e.offsetY)
  ctx.lineTo(prevMouseX * 2 - e.offsetX, e.offsetY)
  ctx.closePath()
  fillColor.checked ? ctx.fill() : ctx.stroke()
}

// Start drawing
const startDraw = (e) => {
  isDrawing = true
  prevMouseX = e.offsetX
  prevMouseY = e.offsetY
  ctx.beginPath() // Begin a new path
  ctx.lineWidth = brushWidth
  ctx.strokeStyle = selectedColor // Set line color to selected color
  ctx.fillStyle = selectedColor // Set fill color to selected color
  // Take snapshot of current canvas state
  snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height)
}

// Drawing
const drawing = (e) => {
  if (!isDrawing) return
  
  // Restore snapshot to avoid drawing over previous drawing
  ctx.putImageData(snapshot, 0, 0)

  if (selectedTool === "brush" || selectedTool === "eraser") {
    ctx.strokeStyle = selectedTool === "eraser" ? "#fff" : selectedColor
    ctx.lineTo(e.offsetX, e.offsetY)
    ctx.stroke()
  } else if (selectedTool === "square") {
    drawRect(e)
  } else if (selectedTool === "circle") {
    drawCircle(e)
  } else {
    drawTriangle(e)
  }
}

// Tool selection
toolBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    // Remove active class from current tool
    document.querySelector(".options .active").classList.remove("active")
    btn.classList.add("active")
    selectedTool = btn.id
    console.log("Selected tool:", selectedTool)
  })
})

// Size slider functionality
sizeSlider.addEventListener("input", () => {
  brushWidth = parseInt(sizeSlider.value)
  console.log("Brush width changed to:", brushWidth)
})

// Color buttons
colorBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    // Remove selected class from current color
    document.querySelector(".options .selected").classList.remove("selected")
    btn.classList.add("selected")
    
    // Extract background color from the selected color button
    selectedColor = window.getComputedStyle(btn).getPropertyValue("background-color")
    console.log("Selected color:", selectedColor)
  })
})

// Clear canvas
clearCanvas.addEventListener("click", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  setCanvasBackground()
  // Clear saved data when clearing canvas
  clearSavedData()
})

// Save image
saveImg.addEventListener("click", () => {
  const link = document.createElement("a")
  link.download = `${Date.now()}.jpg`
  link.href = canvas.toDataURL()
  link.click()
})

// Canvas event listeners
canvas.addEventListener("mousedown", startDraw)
canvas.addEventListener("mousemove", drawing)
canvas.addEventListener("mouseup", () => {
  isDrawing = false
  // Save canvas data after drawing
  if (prevMouseX !== undefined && prevMouseY !== undefined) {
    saveCanvasData()
  }
})

// Stop drawing when mouse leaves canvas
canvas.addEventListener("mouseleave", () => {
  isDrawing = false
  // Save canvas data when mouse leaves while drawing
  if (prevMouseX !== undefined && prevMouseY !== undefined) {
    saveCanvasData()
  }
})

// Also listen for mouseup on the entire document to catch mouseup outside canvas
document.addEventListener("mouseup", () => {
  if (isDrawing) {
    isDrawing = false
    // Save canvas data when mouse up outside canvas
    saveCanvasData()
  }
})

// Add touch support for mobile devices
canvas.addEventListener("touchstart", (e) => {
  e.preventDefault() // Prevent scrolling
  const touch = e.touches[0]
  const mouseEvent = new MouseEvent("mousedown", {
    clientX: touch.clientX,
    clientY: touch.clientY
  })
  canvas.dispatchEvent(mouseEvent)
})

canvas.addEventListener("touchmove", (e) => {
  e.preventDefault() // Prevent scrolling
  const touch = e.touches[0]
  const mouseEvent = new MouseEvent("mousemove", {
    clientX: touch.clientX,
    clientY: touch.clientY
  })
  canvas.dispatchEvent(mouseEvent)
})

canvas.addEventListener("touchend", () => {
  const mouseEvent = new MouseEvent("mouseup", {})
  canvas.dispatchEvent(mouseEvent)
})

// Add logging to debug color selection
console.log("Initial color:", selectedColor)