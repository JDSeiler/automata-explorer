import { useMemo, useState, useEffect, useRef } from "react";
import { CELL_SIZE, drawAutomata, fillCell, getGridSize } from "./drawing";
import styled from "styled-components";
import { produceAutomata } from "./automata";

const Header = styled.div`
  background: #ebebeb;
  padding: 0.5rem;
  display: flex;
  flex-direction: row;
  margin-bottom: 1rem;
`;

const toB = (n: number): string => Number(n).toString(2).padStart(8, '0');

const AutomataRunner = () => {
  const range = useMemo(() => {
    const numbers = [];
    for (let i = 0; i < 256; i++) {
      numbers.push(i);
    }
    return numbers;
  }, []);

  const [selectedAutomata, setSelectedAutomata] = useState<string>(toB(0));

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const width = window.innerWidth;

    // We want the width to be about 90% of the viewport width
    const unscaledWidth = Math.round(width * .90);
    // Here we make the width divisible by the cell size.
    const scaledWidth = unscaledWidth - (unscaledWidth % CELL_SIZE);
    // We want the aspect ratio of the canvas to be roughly 3:1,
    // but we ALSO want both dimensions to be divisible by the cell size.
    // We do this by first converting the width from pixels to cells, then
    // we divide it by 3 to get our height in cells. We round this to a whole
    // number and multiply by the cell size again to go back to pixels.
    // The result is a width and height that are as close to 3:1 as possible
    // while both being divisible by the cell size.
    const scaledHeight = Math.round((scaledWidth / CELL_SIZE) / 2) * CELL_SIZE;

    canvas.setAttribute('width', scaledWidth+"px");    
    canvas.setAttribute('height', scaledHeight+"px");
    console.log(`Canvas size set to : ${scaledWidth} x ${scaledHeight}`);
  }, [canvasRef]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const gridSize = getGridSize(canvas);
    const automataHistory = produceAutomata(selectedAutomata, gridSize);
    // fillCell(canvas, 94, 0);
    drawAutomata(canvas, automataHistory);
  }, [selectedAutomata, canvasRef]);

  return (
    <div>
      <p style={{marginTop: 0}}>
        Best viewed on a widescreen monitor. Refresh the page to rescale the canvas to your window size.
      </p>
      <Header>
        <label htmlFor="automata">Select an automata to view:</label>
        <select
          name="automata"
          id="automata-select"
          value={selectedAutomata}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
            setSelectedAutomata(e.target.value);
          }}
          style={{

            fontFamily: 'inherit',
            marginLeft: '0.25rem'
          }}
        >
          {range.map((i) => {
            const binaryValue = toB(i);
            const ruleName = `Rule ${i}`;
            return (
              <option value={binaryValue} key={binaryValue}>{ruleName}</option>
            );
          })}
        </select>
      </Header>
      <div style={{display: 'flex', justifyContent: 'center'}}>
        <canvas ref={canvasRef} id="automata-drawing-area" width="1500" height="500" style={{border: "1px solid black"}}>
          A diagram of the selected automata's behavior over time.
        </canvas>
      </div>
    </div>
  )
};

export default AutomataRunner;
