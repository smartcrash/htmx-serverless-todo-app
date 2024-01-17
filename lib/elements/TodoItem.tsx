import * as elements from "typed-html";
import sanitizeHtml from 'sanitize-html';
import { Todo } from "../types";

const escapeHtml = (unsafe: string) => sanitizeHtml(unsafe, { disallowedTagsMode: 'recursiveEscape' });

function DueDate({ dueDate }: { dueDate: string }) {
  return <div class="flex space-x-1 items-center">
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
      class="bi bi-calendar-event" viewBox="0 0 16 16">
      <path d="M11 6.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5z" />
      <path
        d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5M1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4z" />
    </svg>
    <p class="text-gray-600 text-xs">{escapeHtml(dueDate)}</p>
  </div>
}

export function TodoItem({ id, title, description, dueDate, completed }: Todo) {
  return (
    <li class="flex">
      <input
        type="checkbox"
        checked={completed ? true : false}
        hx-patch={`/prod/todos/${id}/complete`}
        hx-target={'closest li'}
        hx-swap="outerHTML"
      />

      <div class="ml-3 py-2">
        <h2 class="font-bold text-md">{escapeHtml(title)}</h2>
        <p class="text-xs mb-1">{escapeHtml(description)}</p>
        {dueDate ? <DueDate dueDate={dueDate} /> : null}
      </div>
    </li>
  )
}


