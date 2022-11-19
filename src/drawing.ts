type Canvas = HTMLCanvasElement;

export const CELL_SIZE = 1;

const convertIndicesToCoordinates = (i: number, j: number): [number, number] => {
  return [
    i * CELL_SIZE,
    j * CELL_SIZE
  ];
}

export const fillCell = (c: Canvas, i: number, j: number) => {
  const [x, y] = convertIndicesToCoordinates(i, j);
  const ctx = c.getContext('2d');
  ctx?.fillRect(x, y, CELL_SIZE, CELL_SIZE);
}

/**
 * 
 * @param c the canvas to inspect
 * @returns The tuple contain the number of rows and columns the canvas
 * can draw, respectively.
 */
export const getGridSize = (c: Canvas): [number, number] => 
  [
    c.height / CELL_SIZE,
    c.width / CELL_SIZE,
  ]

export const clearCanvas = (c: Canvas) => {
  const ctx = c.getContext('2d');
  ctx?.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx!.fillStyle = "#FFFFFF";
  ctx?.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx!.fillStyle = "#000";
}

export const drawAutomata = (c: Canvas, automataHistory: string[][]) => {
  clearCanvas(c);
  for (let rIdx = 0; rIdx < automataHistory.length; rIdx ++) {
    const row = automataHistory[rIdx];
    for (let cIdx = 0; cIdx < row.length; cIdx++) {
      if (automataHistory[rIdx][cIdx] === '1') {
        fillCell(c, cIdx, rIdx);
      }
    }
  }
}