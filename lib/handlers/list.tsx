import * as elements from 'typed-html'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { TodoList } from '../elements'
import { TodosRepository } from '../repositories'
import { ddb } from '../ddb'

export async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  const repository = new TodosRepository(ddb)

  const dueDate = event.queryStringParameters?.dueDate

  const todos = await repository.findAll({
    completed: false,
    ...(dueDate && { dueDate }),
  })

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
    body: <TodoList items={todos} />,
  }
}
