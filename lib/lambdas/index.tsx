import * as elements from 'typed-html'
import { BaseHTML, TodoForm } from './elements'

export async function handler() {
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
    body: <BaseHTML>
      <input
        type="date"
        name="dueDate"
        hx-get="/prod/todos"
        hx-trigger="change throttle:500ms"
        hx-target=".todo-list"
        hx-swap="outerHTML"
      />
      <div
        hx-get="/prod/todos"
        hx-trigger="load"
        hx-swap="outerHTML"
      ></div>
      <TodoForm />
    </BaseHTML>,
  }
}
