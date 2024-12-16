import Header from "./components/Header";

function App() {
  return (
    <Fragment key="1">
      <Header />
      <div>{true}</div>
      <h1 id="title">
        react-<span>core</span>
      </h1>
    </Fragment>
  );
}

export default App;
