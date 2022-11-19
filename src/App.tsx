import styled from "styled-components";
import AutomataRunner from "./AutomataRunner";

const CenteringContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 5%;
  max-width: 90%;
`;

const Divider = styled.div`
  border: 1px solid #333;
  margin-bottom: 1rem;
`;

const App = () => {
  return (
    <CenteringContainer>
      <h1 style={{flexGrow: 0, marginBottom: "0.5rem"}}>Elementary Automata Explorer</h1>
      <Divider />
      <AutomataRunner />
    </CenteringContainer>
  );
};

export default App;
