import * as elements from 'typed-html'

export function BaseHTML({ children }: elements.Children) {
  return `
<!DOCTYPE html> 
<html lang="en">
  <head>
  <meta charset="UTF-8">
  <meta name="viewport" content = "width=device-width, initial-scale=1.0">
  <title>HTMX Serverless Todo App</title>
</head>
<body>
  ${children}
</body>
</html>`
}
