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

const makeSeedRow = (numColumns: number): string[] => {
  const seedRow = Array(numColumns).fill('0');
  const middleIndex = Math.round(numColumns / 2);
  seedRow[middleIndex] = '1';
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

export const produceAutomata = (wolframCode: string, gridSize: [number, number]): string[][] => {
  const [rows, columns] = gridSize;
  const stateLookup = makeStateLookup(wolframCode);
  const automataHistory = [makeSeedRow(columns)];
  
  for (let r = 1; r < rows; r++) {
    const lastRow = automataHistory[r-1];
    const newRow = Array(columns).fill('0');
    for (let c = 0; c < columns; c++) {
      const neighborhood = getNeighborhood(c, lastRow);
      const newCellValue = stateLookup[neighborhood];
      newRow[c] = newCellValue;
    }
    automataHistory.push(newRow);
  }
 
  return automataHistory;
}