import * as elements from "typed-html";

export function TodoForm() {
  return (
    <form
      hx-post="/prod/todos"
      hx-trigger="submit"
      hx-target=".todo-list"
      hx-swap="beforeend"
      {...{ ['hx-on::after-request']: "this.reset()" }}
    >
      <input minlength="3" name="title" placeholder="Title" required="true" />
      <textarea name="description" placeholder="Description"></textarea>
      <input type="date" name="dueDate" />
      <button type="submit">Submit</button>
    </form>
  )
}
