import { AttributeValue, ScanCommand, ScanInput, PutItemCommand } from '@aws-sdk/client-dynamodb'
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

  async create(data: Partial<Todo>): Promise<[string[] | null, Todo | null]> {
    const [errors, validated] = this.validate(data)

    if (errors.length) return [errors, null]

    const { title, description, dueDate } = validated

    const todo: Todo = {
      id: this.randomId(),
      title,
      description,
      completed: false,
      createdAt: new Date().toISOString(),
      dueDate: dueDate ? new Date(dueDate).toISOString().slice(0, 10) : null,
    }

    const command = new PutItemCommand({ TableName: 'todos', Item: marshall(todo) })

    await this.client.send(command);

    return [null, todo]
  }

  private randomId = (): string => Math.random().toString(36).slice(2, 9)

  private validate(data: Partial<Todo>): [string[], { title: string, description: string, dueDate: string | null }] {
    const title = data.title || ''
    const description = data.description || ''
    const dueDate = data.dueDate || null

    const errors: string[] = []

    if (!title) errors.push('title is required')
    else if(title.length < 3) errors.push('title must be at least 3 characters long')

    if (dueDate) {
      if (!this.isValidDate(dueDate)) errors.push('dueDate must be a valid date')
      if (new Date(dueDate) < new Date()) errors.push('dueDate must be a future date')
    }

    return [errors, { title, description, dueDate }]
  }

  private isValidDate(dateStr: string): boolean {
    return !isNaN(new Date(dateStr).valueOf());
  }

  // async update(todo: Todo): Promise<void> {
  // }
}
