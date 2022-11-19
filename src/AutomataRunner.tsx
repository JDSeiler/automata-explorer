import { useMemo, useState, useEffect } from "react";
import styled from "styled-components";

const Header = styled.div`
  background: #ebebeb;
  padding: 0.5rem;
  display: flex;
  flex-direction: row;
  margin-bottom: 1rem;
`;

const toB = (n: number): string => Number(n).toString(2);

const AutomataRunner = () => {
  const range = useMemo(() => {
    const numbers = [];
    for (let i = 0; i < 256; i++) {
      numbers.push(i);
    }
    return numbers;
  }, []);

  const [selectedAutomata, setSelectedAutomata] = useState<string>(toB(0));

  useEffect(() => {
    const canvas = document.getElementById('automata-drawing-area');
    const width = window.innerWidth;

    const unscaledWidth = Math.round(width * .90);
    const scaledWidth = unscaledWidth - (unscaledWidth % 3);
    const scaledHeight = scaledWidth / 3;

    canvas!.setAttribute('width', scaledWidth+"px");    
    canvas!.setAttribute('height', scaledHeight+"px");
    console.log(`Canvas size set to : ${scaledWidth} x ${scaledHeight}`);
  }, []);

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
            const ruleName = `Rule ${i+1}`;
            return (
              <option value={binaryValue}>{ruleName}</option>
            );
          })}
        </select>
      </Header>
      <div style={{display: 'flex', justifyContent: 'center'}}>
        <canvas id="automata-drawing-area" width="1500" height="500" style={{border: "1px solid black"}}>
          A diagram of the selected automata's behavior over time.
        </canvas>
      </div>
    </div>
  )
};

export default AutomataRunner;
