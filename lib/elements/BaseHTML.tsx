import * as elements from 'typed-html'

export function BaseHTML({ children }: elements.Children) {
  return `
<!DOCTYPE html> 
<html lang="en">
  <head>
  <meta charset="UTF-8">
  <meta name="viewport" content = "width=device-width, initial-scale=1.0">
  <title>HTMX Serverless Todo App</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://unpkg.com/htmx.org@1.9.10" defer></script>
</head>
<body hx-boost="true" class="mx-auto w-full px-5 sm:w-96 pt-5">
  ${children}
</body>
</html>`
}
