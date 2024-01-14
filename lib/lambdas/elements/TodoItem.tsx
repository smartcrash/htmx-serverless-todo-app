import * as elements from "typed-html";
import { Todo } from "../types";

export function TodoItem({ title, description, date }: Todo) {
  return (
    <li>
      <h2>{title}</h2>
      <p>{description}</p>
      {date ? <p>{date}</p> : null}
    </li>
  )
}
