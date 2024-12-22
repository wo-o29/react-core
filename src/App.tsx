// import Header from "./components/Header";
import { useState } from "./hooks";

function App() {
  const [state, setState] = useState(1);
  const [state1, setState1] = useState(10);
  const [state2, setState2] = useState(100);

  return (
    <>
      <div>
        <div>{state}</div>
        <button onClick={() => setState((prev) => prev + 1)}>버튼</button>
      </div>
      <div>
        <div>{state1}</div>
        <button onClick={() => setState1((prev) => prev + 1)}>버튼</button>
      </div>
      <div>
        <div>{state2}</div>
        <button onClick={() => setState2((prev) => prev + 1)}>버튼</button>
      </div>
    </>
  );
}

export default App;
