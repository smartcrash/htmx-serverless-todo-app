import { AttributeValue, ScanCommand, ScanInput } from '@aws-sdk/client-dynamodb'
import { unmarshall, marshall } from '@aws-sdk/util-dynamodb'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { Todo } from '../types'

type FilterExpression = ScanInput['FilterExpression']

export class TodosRepository {
  constructor(private readonly client: DynamoDBClient) { }

  async findAll(where: Partial<Todo>): Promise<Todo[]> {
    let filterExpression: FilterExpression = ''
    let expressionAttributeValues: Record<string, AttributeValue> = {}

    const entries = Object.entries(where)

    entries.forEach(([key, value], index) => {
      if (value === undefined) return

      filterExpression += `${key} = :${key}`
      if (index < entries.length - 1) filterExpression += ' AND '

      expressionAttributeValues[`:${key}`] = marshall(value) as any
    })

    const command = new ScanCommand({
      TableName: 'todos',
      FilterExpression: filterExpression,
      ExpressionAttributeValues: expressionAttributeValues,
    })

    const { Items: items } = await this.client.send(command);
    if (!items) return []
    return items.map((item) => unmarshall(item) as Todo)
  }

  // async create(todo: Todo): Promise<Todo> {
  // }
  //
  // async update(todo: Todo): Promise<void> {
  // }
}
