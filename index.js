// Select the canvas element from the DOM
const canvas = document.querySelector("canvas")

toolBtns = document.querySelectorAll(".tool") // Select all elements with the class "tool"

fillColor = document.querySelector("#fill-color") // Select the fill color checkbox element

sizeSlider = document.querySelector("#size-slider") // Select the size slider element

colorBtns = document.querySelectorAll(".colors .option") // Select all elements with the class "option" inside the "colors" class

colorPicker = document.querySelector("#color-picker") // Select the color picker element

// Get the 2D rendering context for the canvas
ctx = canvas.getContext("2d") // Get the 2D rendering context for the canvas

// Initialize variables
let prevMouseX, prevMouseY, snapshot, // Variables to store previous mouse position and canvas snapshot
isDrawing = false, // Flag to check if the user is drawing
selectedTool = "brush", // Default selected tool
brushWidth = 5 // Set the default brush width
selectedColor = "#000" // Set the default selected color

// Set canvas dimensions to match its offset dimensions when the window loads
window.addEventListener("load", () => {
  canvas.width = canvas.offsetWidth // Set canvas width to match its offset width
  canvas.height = canvas.offsetHeight // Set canvas height to match its offset height
})

// Function to draw a square
const drawSquare = (e) => {
  if(!fillColor.checked) { // Check if the fill color checkbox is not checked
    return ctx.strokeRect(
      e.offsetX,
      e.offsetY,
      prevMouseX - e.offsetX, // Calculate width of the square
      prevMouseY - e.offsetY  // Calculate height of the square
    )
  }
  ctx.fillRect(
    e.offsetX,
    e.offsetY,
    prevMouseX - e.offsetX, // Calculate width of the square
    prevMouseY - e.offsetY  // Calculate height of the square
  )
}

// Function to draw a circle
const drawCircle = (e) => {
  ctx.beginPath() // Begin a new path for the circle
  let radius = Math.sqrt(
    Math.pow((prevMouseX - e.offsetX), 2) + Math.pow((prevMouseY - e.offsetY), 2)
  ) // Calculate the radius of the circle using the distance formula
  ctx.arc(
    prevMouseX, // X-coordinate of the circle's center
    prevMouseY, // Y-coordinate of the circle's center
    radius, // Radius of the circle
    0, // Starting angle (0 radians)
    2 * Math.PI // Ending angle (2π radians for a full circle)
  )
  fillColor.checked ? ctx.fill() : ctx.stroke() // Fill the circle if the fill color checkbox is checked, otherwise just stroke
}

// Function to draw a triangle
const drawTriangle = (e) => {
  ctx.beginPath() // Begin a new path for the triangle
  ctx.moveTo(prevMouseX, prevMouseY) // Move to the starting point of the triangle
  ctx.lineTo(e.offsetX, e.offsetY) // Draw a line to the current mouse position
  ctx.lineTo(prevMouseX * 2 - e.offsetX, e.offsetY) // Draw a line to the mirrored position on the X-axis
  ctx.closePath() // Close the path to form a triangle
  ctx.stroke() // Stroke the triangle outline
  fillColor.checked ? ctx.fill() : ctx.stroke() // Fill the triangle if the fill color checkbox is checked, otherwise just stroke
}

// Function to start drawing
const startDrawing = (e) => {
  isDrawing = true // Set the drawing flag to true
  prevMouseX = e.offsetX // Store the current mouse X position
  prevMouseY = e.offsetY // Store the current mouse Y position
  ctx.beginPath() // Begin a new path for drawing
  ctx.lineWidth = brushWidth // Set the brush width for the path
  ctx.strokeStyle = selectedColor // Set the stroke color for the path
  ctx.fillStyle = selectedColor // Set the fill color for the path
  snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height) // Take a snapshot of the canvas
}

// Function to draw on the canvas
const drawing = (e) => {
  if (!isDrawing) return // If not drawing, exit the function
  ctx.putImageData(snapshot, 0, 0) // Restore the canvas to the snapshot

  if (selectedTool === "brush" || "eraser") { // Check if the selected tool is the brush or eraser
    ctx.strokeStyle = selectedTool === "eraser" ? "#fff" : selectedColor // Set the stroke color based on the selected tool
    ctx.lineTo(e.offsetX, e.offsetY) // Draw a line to the current mouse position
    ctx.stroke() // Render the line
  } else if (selectedTool === "square") { // Check if the selected tool is the square
    drawSquare(e) // Call the drawSquare function
  } else if (selectedTool === "circle") { // Check if the selected tool is the circle
    drawCircle(e) // Call the drawCircle function
  } else (selectedTool === "triangle")
}

// Add event listeners to tool buttons
toolBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelector(".options .active").classList.remove("active") // Remove active class from the previously selected tool
    btn.classList.add("active") // Add active class to the clicked tool
    selectedTool = btn.id // Update the selected tool based on the button's ID
    console.log(selectedTool) // Log the selected tool to the console
  })
})

// Add event listener to the fill color checkbox
sizeSlider.addEventListener("change", () => brushWidth = sizeSlider.value) // Update the brush width based on the slider value

// Add event listeners to color buttons
colorBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelector(".options .selected").classList.remove("selected") // Remove selected class from the previously selected color button
    btn.classList.add("selected") // Add selected class to the clicked color button
    selectedColor = window.getComputedStyle(btn).getPropertyValue("background-color") // Get the background color of the clicked button
  })
})

// Add event listener to the color picker
colorPicker.addEventListener("change", () => {
  colorPicker.parentElement.style.background = colorPicker.value // Update the background color of the color picker element
  colorPicker.parentElement.click() // Trigger a click event on the color picker element
})

// Add event listeners for mouse actions
canvas.addEventListener("mousedown", startDrawing) // Start drawing on mouse down
canvas.addEventListener("mousemove", drawing) // Draw as the mouse moves
canvas.addEventListener("mouseup", () => isDrawing = false) // Stop drawing on mouse up
