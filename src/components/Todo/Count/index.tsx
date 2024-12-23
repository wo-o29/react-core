interface TodoCountProps {
  count: number;
}

function TodoCount({ count }: TodoCountProps) {
  return <p>개수 : {count}</p>;
}

export default TodoCount;
