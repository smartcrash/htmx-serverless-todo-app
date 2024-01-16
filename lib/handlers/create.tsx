import * as elements from 'typed-html'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { TodoItem } from "../elements";
import { ddb } from '../ddb'
import { TodosRepository } from '../repositories'


export async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  const body = new URLSearchParams(event.body || '')
  const title = body.get('title') || ''
  const description = body.get('description') || ''
  const dueDate = body.get('dueDate') || null

  const repository = new TodosRepository(ddb)
  const [errors, todo] = await repository.create({
    title,
    description,
    dueDate,
  })

  if (errors) {
    // TODO: render errors
  }

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
    body: <TodoItem {...todo!} />,
  }
}
