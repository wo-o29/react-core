import { useState } from "../hooks";
import TodoCount from "./Todo/Count";
import TodoForm from "./Todo/Form";
import TodoList from "./Todo/List";

export interface Todo {
  id: number;
  text: string;
  isDone: boolean;
}

let todoId = 0;
function Todo() {
  const [todoList, setTodoList] = useState<Todo[]>([]);

  const handleAddTodo = (text: string) => {
    setTodoList((prev) => [
      ...prev,
      {
        id: ++todoId,
        text,
        isDone: false,
      },
    ]);
  };

  const handleDeleteTodo = (id: number) => {
    setTodoList((prev) => prev.filter((todo) => todo.id !== id));
  };

  const handleToggleTodo = (id: number) => {
    setTodoList((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, done: !todo.isDone } : todo
      )
    );
  };

  return (
    <>
      <h1>TODO</h1>
      <TodoCount count={todoList.length} />
      <TodoForm onAdd={handleAddTodo} />
      <TodoList
        todoList={todoList}
        onDelete={handleDeleteTodo}
        onToggle={handleToggleTodo}
      />
    </>
  );
}

export default Todo;
