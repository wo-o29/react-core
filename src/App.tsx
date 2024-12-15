import Header from "./components/Header";

function App() {
  const handleButtonClick = () => {
    console.log("클릭");
  };

  return (
    <Fragment key="1">
      <Header />
      <h1 id="title">react-core</h1>
      <p>
        초기 <span>설정</span>
      </p>
      <button id="button" class="A" onClick={handleButtonClick.toString()}>
        버튼
      </button>
    </Fragment>
  );
}

export default App;
