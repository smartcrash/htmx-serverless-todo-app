import * as elements from "typed-html";

export function TodoForm() {
  const minDate = new Date().toISOString().split("T")[0];

  return (
    <form
      hx-post="/prod/todos"
      hx-trigger="submit"
      hx-target=".todo-list"
      hx-swap="beforeend"
      class="space-y-2 mt-5"
      {...{ ['hx-on::after-request']: "this.reset()" }}
    >

    <input type="text" minlength="3" name="title" placeholder="Title" required="true"
      class="block w-full rounded-md border-0 py-1 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset text-sm leading-6"/>
    <textarea name="description" placeholder="Description"
      class="block w-full rounded-md border-0 py-1 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset text-sm leading-6"></textarea>

    <input min={minDate} type="date" name="dueDate" 
      class="block w-full rounded-md border-0 py-1 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset text-sm leading-6"/>

    <button
      class="block w-full text-center flex justify-center rounded-lg bg-pink-500 py-3 px-6 font-sans text-xs font-bold uppercase text-white shadow-md shadow-pink-500/20 transition-all hover:shadow-lg hover:shadow-pink-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
      type="submit">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-send-fill"
        viewBox="0 0 16 16">
        <path
          d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471z" />
      </svg>
    </button>
    </form>
  )
}
