import * as elements from 'typed-html'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { DynamoDBClient, PutItemCommand, } from '@aws-sdk/client-dynamodb'
import { marshall } from '@aws-sdk/util-dynamodb'
import { Todo } from './types'
import { TodoItem } from "./elements";

const client = new DynamoDBClient({});

export async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  const body = new URLSearchParams(event.body || '')
  const title = body.get('title') || ''
  const description = body.get('description') || ''
  const date = body.get('date') || null

  const todo: Todo = {
    id: Math.random().toString(36).slice(2, 9),
    title,
    description,
    createdAt: new Date().toISOString(),
    date: date ? new Date(date).toISOString().slice(0, 10) : null,
  }

  const command = new PutItemCommand({ TableName: 'todos', Item: marshall(todo) })

  try {
    await client.send(command);
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
