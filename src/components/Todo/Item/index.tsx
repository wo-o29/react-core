import { Todo } from "../..";

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  const { id, text, isDone } = todo;

  return (
    <div
      style={{
        width: "200px",
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <input type="checkbox" checked={isDone} onClick={() => onToggle(id)} />
      <p>{text}</p>

      <button type="button" onClick={() => onDelete(id)}>
        삭제
      </button>
    </div>
  );
}

export default TodoItem;
