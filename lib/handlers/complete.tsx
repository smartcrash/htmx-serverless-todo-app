import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { ddb } from '../ddb'
import { TodosRepository } from '../repositories'


export async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  const id = event.pathParameters?.id;

  if (id) {
    const repository = new TodosRepository(ddb)
    await repository.update(id, { completed: true })
  }

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
    body: ''
  }
}
