import * as elements from "typed-html";
import { Todo } from "../types";

export function TodoItem({ title, description }: Todo) {
  return (
    <li>
      <h2>{title}</h2>
      <p>{description}</p>
    </li>
  )
}
