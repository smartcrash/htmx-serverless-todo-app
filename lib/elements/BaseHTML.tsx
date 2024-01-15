import * as elements from 'typed-html'

export function BaseHTML({ children }: elements.Children) {
  return `
<!DOCTYPE html> 
<html lang="en">
  <head>
  <meta charset="UTF-8">
  <meta name="viewport" content = "width=device-width, initial-scale=1.0">
  <title>HTMX Serverless Todo App</title>
  <script src="https://unpkg.com/htmx.org@1.9.10" defer></script>
</head>
<body hx-boost="true">
  ${children}
</body>
</html>`
}
