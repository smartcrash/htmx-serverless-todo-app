import * as elements from 'typed-html'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { TodoItem } from "../elements";
import { ddb } from '../ddb'
import { TodosRepository } from '../repositories'


export async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  const body = event.body || ''
  let title = ''
  let description = ''
  let dueDate = null

  if (event.headers['Content-Type'] === 'application/json') {
    const data = JSON.parse(body)
    title = data.title
    description = data.description
    dueDate = data.dueDate
  } else {
    const searchParams = new URLSearchParams(body)
    title = searchParams.get('title') || ''
    description = searchParams.get('description') || ''
    dueDate = searchParams.get('dueDate') || null
  }

  const repository = new TodosRepository(ddb)
  const [errors, todo] = await repository.create({
    title,
    description,
    dueDate,
  })


  if (errors) {
    return {
      statusCode: 400,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify({ errors }),
    }
  }

  if (event.headers['Accept'] === 'application/json') {
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify(todo),
    }
  }

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
    body: <TodoItem {...todo!} />,
  }
}
