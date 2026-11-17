# Drawing App

A browser-based drawing app built with the HTML5 Canvas API and plain JavaScript. It works with a mouse, touch screen or stylus.

**Live demo:** https://sanjeet-saini.github.io/drawing_app/

## Features

- **Freehand tools:** pencil, brush and eraser
- **Shapes:** rectangle, circle, triangle, square and hexagon, with optional fill
- **Brush size** slider and a colour palette with a custom colour picker
- **Live shape preview** while dragging (uses canvas snapshots)
- **Clear canvas** and **save as image** (downloads a `.jpg`)
- Works on desktop and mobile using Pointer Events

## Tech stack

- HTML5 Canvas API
- JavaScript (ES6+)
- CSS3
- Font Awesome icons

## Run locally

No build step is needed. Clone the repo and open `index.html` in a browser:

```bash
git clone https://github.com/sanjeet-saini/drawing_app.git
cd drawing_app
```

## How it works

- `pointerdown` stores the start point and takes a snapshot of the canvas.
- `pointermove` draws a freehand line, or restores the snapshot and redraws the selected shape so it previews without leaving trails.
- **Save** converts the canvas to a JPEG with `canvas.toDataURL()` and downloads it.

## Author

**Sanjeet Saini** · [GitHub](https://github.com/sanjeet-saini) · [LinkedIn](https://www.linkedin.com/in/sanjeet-saini-880b1827a)
