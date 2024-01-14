import * as elements from 'typed-html'
import { AttributeValue, DynamoDBClient, ScanCommand } from '@aws-sdk/client-dynamodb'
import { TodoList } from './elements'
import { Todo } from './types'

const client = new DynamoDBClient({});

export async function handler() {
  const command = new ScanCommand({ TableName: 'todos' })
  let items: Record<string, AttributeValue>[] = []

  try {
    const results = await client.send(command);
    if (results.Items) items = results.Items
  } catch (err) {
    console.error(err);
    // TODO: handle error
  }

  const todos: Todo[] = items.map(item => ({
    id: item.id.S!,
    title: item.title.S || '',
    description: item.description.S || '',
    date: item.date.S || null,
    createdAt: item.createdAt.S!,
  }))

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
    body: <TodoList items={todos} />,
  }
}
