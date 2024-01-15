import * as elements from 'typed-html'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { AttributeValue, ScanCommand, ScanInput } from '@aws-sdk/client-dynamodb'
import { unmarshall } from '@aws-sdk/util-dynamodb'
import { TodoList } from '../elements'
import { Todo } from '../types'
import { ddb } from '../ddb'

type FilterExpression = ScanInput['FilterExpression']
type ExpressionAttributeValues = ScanInput['ExpressionAttributeValues']

export async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  const dueDate = event.queryStringParameters?.dueDate

  // TODO: validate date is valid

  let filterExpression: FilterExpression = 'completed = :completed'
  let expresionAttributeValues: ExpressionAttributeValues = { ':completed': { BOOL: false }, }

  if (dueDate) {
    filterExpression += ' AND dueDate = :dueDate'
    expresionAttributeValues[':dueDate'] = { S: dueDate }
  }

  const command = new ScanCommand({
    TableName: 'todos',
    FilterExpression: filterExpression,
    ExpressionAttributeValues: expresionAttributeValues,
  })

  let items: Record<string, AttributeValue>[] = []

  try {
    const results = await ddb.send(command);
    if (results.Items) items = results.Items
  } catch (err) {
    console.error(err);
    // TODO: handle error
  }

  const todos: Todo[] = items.map((item) => unmarshall(item) as Todo)

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
    body: <TodoList items={todos} />,
  }
}
