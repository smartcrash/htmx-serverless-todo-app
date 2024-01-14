import * as elements from "typed-html";
import { TodoItem } from "./TodoItem";
import { Todo } from "../types";

export function TodoList({ items }: { items: Todo[] }) {
  return <ul class="todo-list">{items.map(item => <TodoItem {...item} />)}</ul>
}
