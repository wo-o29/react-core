import Header from "./components/Header";

const tempList = ["react", "core", "render", "root"];

function App() {
  const handleButtonClick = () => {
    console.log("button click!");
  };

  const handleSpanClick = (e: MouseEvent) => {
    console.log("span click");
    e.stopPropagation();
  };

  const handleListMouseOver = (value: any) => {
    console.log(value);
  };

  return (
    <Fragment key="1">
      <Header />
      <h1 id="title" style={{ color: "red", fontSize: "50px" }}>
        react-
        <span onClick={handleSpanClick}>core</span>
      </h1>
      <ul
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          fontSize: "20px",
        }}
      >
        {tempList.map((value) => (
          <li onMouseOver={() => handleListMouseOver(value)}>{value}</li>
        ))}
      </ul>
      <button className="button" type="button" onClick={handleButtonClick}>
        버튼
      </button>
    </Fragment>
  );
}

export default App;
