// Select the canvas element from the DOM
const canvas = document.querySelector("canvas");
// Get the 2D rendering context for the canvas
ctx = canvas.getContext("2d");

// Initialize variables
let isDrwaing = false; // Flag to check if the user is drawing
brushWidth = 3; // Set the brush width

// Set canvas dimensions to match its offset dimensions when the window loads
window.addEventListener("load", () => {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
});

// Function to start drawing
const startDrawing = () => {
  isDrwaing = true; // Set the drawing flag to true
  ctx.beginPath(); // Begin a new path for drawing
  ctx.lineWidth = brushWidth; // Set the brush width for the path
}

// Function to draw on the canvas
const drawing = (e) => {
  if (!isDrwaing) return; // If not drawing, exit the function
  ctx.lineTo(e.offsetX, e.offsetY); // Draw a line to the current mouse position
  ctx.stroke(); // Render the line
}

// Add event listeners for mouse actions
canvas.addEventListener("mousedown", startDrawing); // Start drawing on mouse down
canvas.addEventListener("mousemove", drawing); // Draw as the mouse moves
canvas.addEventListener("mouseup", () => isDrwaing = false); // Stop drawing on mouse up
