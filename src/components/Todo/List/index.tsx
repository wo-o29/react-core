import { Todo } from "../..";
import TodoItem from "../Item";

interface TodoListProps {
  todoList: Todo[];
  onDelete: (id: number) => void;
  onToggle: (id: number) => void;
}

function TodoList({ todoList, onDelete, onToggle }: TodoListProps) {
  if (todoList.length === 0) {
    return <p>등록된 TODO가 없습니다.</p>;
  }

  return (
    <ul>
      {todoList.map((todo) => (
        <TodoItem todo={todo} onDelete={onDelete} onToggle={onToggle} />
      ))}
    </ul>
  );
}

export default TodoList;
