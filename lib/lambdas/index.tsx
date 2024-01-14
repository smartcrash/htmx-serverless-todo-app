import * as elements from 'typed-html'
import { BaseHTML } from './elements'

export async function handler() {
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
    body: <BaseHTML>
      <div
        hx-get="/prod/todos"
        hx-trigger="load"
        hx-swap="outerHTML"
      ></div>
    </BaseHTML>,
  }
}
