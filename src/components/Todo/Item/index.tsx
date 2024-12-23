import { Todo } from "../..";

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  const { id, text, isDone } = todo;

  return (
    <li
      style={{
        width: "200px",
        height: "50px",
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <input type="checkbox" checked={isDone} onClick={() => onToggle(id)} />
      <p
        style={{
          textDecoration: isDone ? "line-through" : "none",
        }}
      >
        {text}
      </p>

      <button type="button" onClick={() => onDelete(id)}>
        삭제
      </button>
    </li>
  );
}

export default TodoItem;
