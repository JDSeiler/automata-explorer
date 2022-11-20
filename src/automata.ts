const makeStateLookup = (wolframCode: string): Record<string, string> => {
  const possibleStates = [
    "111",
    "110",
    "101",
    "100",
    "011",
    "010",
    "001",
    "000"
  ];
  const outcomes = wolframCode.split("");
  const lookupTable: Record<string, string> = {};
  for (let i = 0; i < possibleStates.length; i++) {
    const state = possibleStates[i];
    const outcome = outcomes[i];
    lookupTable[state] = outcome;
  }
  return lookupTable
}

type SeedType = 'centered' | 'random';

const makeSeedRow = (numColumns: number, seedType: SeedType): string[] => {
  const seedRow = Array(numColumns).fill('0');
  if (seedType === 'centered') {
    const middleIndex = Math.round(numColumns / 2);
    seedRow[middleIndex] = '1';
  } else if (seedType === 'random') {
    for (let i = 0; i < seedRow.length; i++) {
      if (Math.random() < 0.08) {
        seedRow[i] = '1';
      }
    }
  }
  return seedRow;
}

const getNeighborhood = (idx: number, row: string[]): string => {
  if (idx === 0) {
    return '0' + row[idx] + row[idx+1];
  } else if (idx === row.length - 1) {
    return row[idx-1] + row[idx] + '0'
  } else {
    return row[idx-1] + row[idx] + row[idx+1];
  }
}

type AutomataResults = {
  automataHistory: string[][];
  automataImage: ImageData;
}

const setImageDataPixel = (data: Uint8ClampedArray, i: number, grayScaleValue: number) => {
  // Each pixel takes up 4 slots in our array. So the "ith" pixel starts at the i*4th
  // slot in the array!
  const pixelIdx = i * 4;
  data[pixelIdx] = grayScaleValue;
  data[pixelIdx+1] = grayScaleValue;
  data[pixelIdx+2] = grayScaleValue;
  data[pixelIdx+3] = 255;
}

export const produceAutomata = (wolframCode: string, seedType: SeedType, gridSize: [number, number]): AutomataResults => {
  // Prep
  const [rows, columns] = gridSize;
  const stateLookup = makeStateLookup(wolframCode);
  const seedRow = makeSeedRow(columns, seedType);

  /*
  We track two representations:
  1. A 2D array: automataHistory, where each row is the state of the
     automata at a certain point `t`. The first row of the array is t=0.
  2. A Uint8ClampedArray: imageData. We keep this alternate representation
     because we want to draw the entire picture of the automata at once using
     putImageData. This is much faster than repeated `fillRect` calls. But we
     are limited to single-pixels as our cell size.
  */ 
  const automataHistory = [seedRow];
  // 4 values for RGBA
  const imageData = new Uint8ClampedArray(rows * columns * 4);

  // We need to copy of the seedRow to the image data.
  for (let i = 0; i < seedRow.length; i++) {
    if (seedRow[i] === '1') {
      // "1" means filled, which is black in our image.
      setImageDataPixel(imageData, i, 255);
    }
  }
  
  for (let r = 1; r < rows; r++) {
    const lastRow = automataHistory[r-1];
    const newRow = Array(columns).fill('0');
    for (let c = 0; c < columns; c++) {
      const neighborhood = getNeighborhood(c, lastRow);
      const newCellValue = stateLookup[neighborhood];
      newRow[c] = newCellValue;

      // While we fill out the automata history, also fill out the
      // raw image data we want to display.
      const cellGrayScale = newCellValue === '1' ? 0 : 255;
      setImageDataPixel(imageData, (c + (r*columns)), cellGrayScale)
    }
    automataHistory.push(newRow);
  }
 
  return {
    automataHistory,
    automataImage: new ImageData(imageData, columns, rows)
  }
}
