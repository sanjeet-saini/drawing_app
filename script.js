const canvas = document.querySelector("canvas"),
  toolBtns = document.querySelectorAll(".tool"),
  fillColor = document.querySelector("#fill-color"),
  sizeSlider = document.querySelector("#size-slider"),
  colorBtns = document.querySelectorAll(".colors .option"),
  colorPicker = document.querySelector("#color-picker"),
  clearCanvas = document.querySelector(".clear-canvas"),
  saveImage = document.querySelector(".save-img"),
  ctx = canvas.getContext("2d");

// Global variables with default values
let prevX,
  prevY,
  snapshot,
  isDrawing = false,
  selectedTool = "brush",
  brushWidth = Number(sizeSlider.value),
  selectedColor = "#000";

// Fill the canvas with white so saved images don't have a transparent background
const setCanvasBackground = () => {
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = selectedColor;
};

// Match the canvas drawing size to its on-screen size,
// keeping the current drawing when the window is resized.
const resizeCanvas = () => {
  const previous = canvas.width && canvas.height ? ctx.getImageData(0, 0, canvas.width, canvas.height) : null;
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  setCanvasBackground();
  if (previous) ctx.putImageData(previous, 0, 0);
};

window.addEventListener("load", resizeCanvas);
window.addEventListener("resize", resizeCanvas);

// Pointer position relative to the canvas (works for mouse, touch and stylus)
const getPoint = (e) => {
  const rect = canvas.getBoundingClientRect();
  return { x: e.clientX - rect.left, y: e.clientY - rect.top };
};

const finishShape = () => (fillColor.checked ? ctx.fill() : ctx.stroke());

const drawRect = ({ x, y }) => {
  const width = prevX - x;
  const height = prevY - y;
  fillColor.checked ? ctx.fillRect(x, y, width, height) : ctx.strokeRect(x, y, width, height);
};

const drawCircle = ({ x, y }) => {
  ctx.beginPath();
  const radius = Math.hypot(prevX - x, prevY - y);
  ctx.arc(prevX, prevY, radius, 0, 2 * Math.PI);
  finishShape();
};

const drawTriangle = ({ x, y }) => {
  ctx.beginPath();
  ctx.moveTo(prevX, prevY);
  ctx.lineTo(x, y);
  ctx.lineTo(prevX * 2 - x, y);
  ctx.closePath();
  finishShape();
};

const drawSquare = ({ x, y }) => {
  const side = Math.max(Math.abs(prevX - x), Math.abs(prevY - y));
  const startX = x < prevX ? prevX - side : prevX;
  const startY = y < prevY ? prevY - side : prevY;
  ctx.beginPath();
  ctx.rect(startX, startY, side, side);
  finishShape();
};

// Regular hexagon centred on the start point
const drawHexagon = ({ x, y }) => {
  const radius = Math.hypot(prevX - x, prevY - y);
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const angle = ((2 * Math.PI) / 6) * i;
    ctx.lineTo(prevX + radius * Math.cos(angle), prevY + radius * Math.sin(angle));
  }
  ctx.closePath();
  finishShape();
};

const shapes = {
  rectangle: drawRect,
  circle: drawCircle,
  triangle: drawTriangle,
  square: drawSquare,
  hexagon: drawHexagon,
};

const startDraw = (e) => {
  isDrawing = true;
  canvas.setPointerCapture(e.pointerId);
  const { x, y } = getPoint(e);
  prevX = x;
  prevY = y;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineWidth = brushWidth;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.strokeStyle = selectedTool === "eraser" ? "#fff" : selectedColor;
  ctx.fillStyle = selectedColor;
  // Snapshot lets shapes preview while dragging without leaving trails
  snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
};

const drawing = (e) => {
  if (!isDrawing) return;
  const point = getPoint(e);

  if (shapes[selectedTool]) {
    ctx.putImageData(snapshot, 0, 0);
    shapes[selectedTool](point);
    return;
  }

  // Pencil, brush and eraser draw freehand lines
  ctx.lineTo(point.x, point.y);
  ctx.stroke();
};

const stopDraw = () => {
  isDrawing = false;
};

toolBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelector(".options .active").classList.remove("active");
    btn.classList.add("active");
    selectedTool = btn.id;
  });
});

sizeSlider.addEventListener("input", () => {
  brushWidth = Number(sizeSlider.value);
});

colorBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelector(".options .selected").classList.remove("selected");
    btn.classList.add("selected");
    selectedColor = window.getComputedStyle(btn).getPropertyValue("background-color");
  });
});

colorPicker.addEventListener("change", () => {
  colorPicker.parentElement.style.background = colorPicker.value;
  colorPicker.parentElement.click();
});

clearCanvas.addEventListener("click", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  setCanvasBackground();
});

saveImage.addEventListener("click", () => {
  const link = document.createElement("a");
  link.download = `drawing-${Date.now()}.jpg`;
  link.href = canvas.toDataURL("image/jpeg", 0.95);
  link.click();
});

// Pointer events cover mouse, touch and pen with one set of handlers
canvas.addEventListener("pointerdown", startDraw);
canvas.addEventListener("pointermove", drawing);
canvas.addEventListener("pointerup", stopDraw);
canvas.addEventListener("pointercancel", stopDraw);
