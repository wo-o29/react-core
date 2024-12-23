import { useState } from "../../../hooks";

interface TodoFormProps {
  onAdd: (text: string) => void;
}

function TodoForm({ onAdd }: TodoFormProps) {
  const [value, setValue] = useState("");

  const addTodoAndInputControl = (e: any) => {
    e.preventDefault();
    onAdd(value);
    setValue("");
  };

  return (
    <form>
      <input
        type="text"
        value={value}
        onChange={(e: any) => setValue(e.target.value)}
      />
      <button type="submit" onClick={addTodoAndInputControl}>
        추가
      </button>
    </form>
  );
}

export default TodoForm;
