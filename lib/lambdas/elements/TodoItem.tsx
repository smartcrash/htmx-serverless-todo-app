import * as elements from "typed-html";
import { Todo } from "../types";

export function TodoItem({ id, title, description, dueDate, completed }: Todo) {
  return (
    <li>
      <input
        type="checkbox"
        checked={completed ? true : false}
        hx-patch={`/prod/todos/${id}/complete`}
        hx-target={'closest li'}
        hx-swap="outerHTML"
      />
      <h2>{title}</h2>
      <p>{description}</p>
      {dueDate ? <p>{dueDate}</p> : null}
    </li>
  )
}
