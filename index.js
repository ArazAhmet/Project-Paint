// Select the canvas element from the DOM
const canvas = document.querySelector("canvas");

// Select all tool buttons
toolBtns = document.querySelectorAll(".tool");

// Get the 2D rendering context for the canvas
ctx = canvas.getContext("2d");

// Initialize variables
let prevMouseX, prevMouseY, snapshot, // Variables to store previous mouse position and canvas snapshot
isDrawing = false, // Flag to check if the user is drawing
selectedTool = "brush", // Default selected tool
brushWidth = 3; // Set the default brush width

// Set canvas dimensions to match its offset dimensions when the window loads
window.addEventListener("load", () => {
  canvas.width = canvas.offsetWidth; // Set canvas width
  canvas.height = canvas.offsetHeight; // Set canvas height
});

// Function to draw a square
const drawSquare = (e) => {
  ctx.strokeRect(
    e.offsetX, 
    e.offsetY, 
    prevMouseX - e.offsetX, // Calculate width of the square
    prevMouseY - e.offsetY  // Calculate height of the square
  ); 
}

// Function to start drawing
const startDrawing = (e) => {
  isDrawing = true; // Set the drawing flag to true
  prevMouseX = e.offsetX; // Store the current mouse X position
  prevMouseY = e.offsetY; // Store the current mouse Y position
  ctx.beginPath(); // Begin a new path for drawing
  ctx.lineWidth = brushWidth; // Set the brush width for the path
  snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height); // Take a snapshot of the canvas
}

// Function to draw on the canvas
const drawing = (e) => {
  if (!isDrawing) return; // If not drawing, exit the function
  ctx.putImageData(snapshot, 0, 0); // Restore the canvas to the snapshot

  if (selectedTool === "brush") {
    ctx.lineTo(e.offsetX, e.offsetY); // Draw a line to the current mouse position
    ctx.stroke(); // Render the line
  } else if (selectedTool === "square") {
    drawSquare(e); // Call the drawSquare function
  }
}

// Add event listeners to tool buttons
toolBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelector(".options .active").classList.remove("active"); // Remove active class from the previously selected tool
    btn.classList.add("active"); // Add active class to the clicked tool
    selectedTool = btn.id; // Update the selected tool
    console.log(selectedTool); // Log the selected tool to the console
  });
});

// Add event listeners for mouse actions
canvas.addEventListener("mousedown", startDrawing); // Start drawing on mouse down
canvas.addEventListener("mousemove", drawing); // Draw as the mouse moves
canvas.addEventListener("mouseup", () => isDrawing = false); // Stop drawing on mouse up
