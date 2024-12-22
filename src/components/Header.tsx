import { useState } from "../hooks";

function Header() {
  const [isShow, setIsShow] = useState(false);

  const handleToggleButtonClick = () => {
    setIsShow((prev) => !prev);
  };

  return (
    <header id="header">
      Header
      <button type="button" onClick={handleToggleButtonClick}>
        토글 버튼
      </button>
      {isShow && <span>리액트</span>}
    </header>
  );
}

export default Header;
