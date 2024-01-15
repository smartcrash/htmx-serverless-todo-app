import * as elements from 'typed-html'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { PutItemCommand, } from '@aws-sdk/client-dynamodb'
import { marshall } from '@aws-sdk/util-dynamodb'
import { Todo } from '../types'
import { TodoItem } from "../elements";
import { ddb } from '../ddb'


export async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  const body = new URLSearchParams(event.body || '')
  const title = body.get('title') || ''
  const description = body.get('description') || ''
  const dueDate = body.get('dueDate') || null

  const todo: Todo = {
    id: Math.random().toString(36).slice(2, 9),
    title,
    description,
    completed: false,
    createdAt: new Date().toISOString(),
    dueDate: dueDate ? new Date(dueDate).toISOString().slice(0, 10) : null,
  }

  const command = new PutItemCommand({ TableName: 'todos', Item: marshall(todo) })

  try {
    await ddb.send(command);
  } catch (err) {
    console.error(err);
    // TODO: handle error
  }

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
    body: <TodoItem {...todo} />,
  }
}
