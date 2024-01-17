import * as elements from 'typed-html'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { BaseHTML, TodoForm } from '../elements'

export async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  if (event.headers['Accept'] === 'application/json') {
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({ message: 'Hello, world!' }),
    }
  }

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
    body: <BaseHTML>
      <div>
        <h1 class="text-3xl font-bold">Todos</h1>
        <div class="my-4">
          <label for="dueDate" class="block text-sm font-medium leading-6 text-gray-900">Due date:</label>
          <input
            id="dueDate"
            type="date"
            name="dueDate"
            hx-get="/prod/todos"
            hx-trigger="change throttle:500ms"
            hx-target=".todo-list"
            hx-swap="outerHTML"
            class="block w-full rounded-md border-0 py-1 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset text-sm leading-6"
          />
        </div>
        <div
          hx-get="/prod/todos"
          hx-trigger="load"
          hx-swap="outerHTML"
        >
          <div class="htmx-indicator font-bold h-40 text-gray-500 flex items-center justify-center">
            <p class="text-center">Loading...</p>
          </div>
        </div>
        <TodoForm />
      </div>
    </BaseHTML>
  }
}
