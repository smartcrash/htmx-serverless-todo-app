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

  async create(data: Partial<Omit<Todo, 'id' | 'createdAt' | 'completed'>>): Promise<[string[] | null, Todo | null]> {
    const [errors, validated] = this.validate(data)

    if (errors.length) return [errors, null]

    const { title, description, dueDate } = validated

    const todo: Todo = {
      id: this.randomId(),
      title: title || '',
      description: description || '',
      completed: false,
      createdAt: new Date().toISOString(),
      dueDate: dueDate ? new Date(dueDate).toISOString().slice(0, 10) : null,
    }

    const command = new PutItemCommand({ TableName: 'todos', Item: marshall(todo) })

    await this.client.send(command);

    return [null, todo]
  }

  async update(id: string, data: Partial<Omit<Todo, 'id' | 'createdAt'>>): Promise<string[] | null> {
    const [errors, validated] = this.validate(data)

    if (errors.length) return errors

    const command = new PutItemCommand({
      TableName: 'todos',
      Item: marshall({
        id,
        ...validated,
      })
    });

    await this.client.send(command);

    return null
  }

  private randomId = (): string => Math.random().toString(36).slice(2, 9)

  private validate(data: Partial<Todo>): [string[], Partial<Todo>] {
    const errors: string[] = []

    if (data.hasOwnProperty('title')) {
      if (!data.title) errors.push('title is required')
      else if (data.title.length < 3) errors.push('title must be at least 3 characters long')
    }

    if (data.hasOwnProperty('dueDate') && data.dueDate) {
      if (!this.isValidDate(data.dueDate)) errors.push('dueDate must be a valid date')
      else if (new Date(data.dueDate) < new Date()) errors.push('dueDate must be a future date')
    }

    return [errors, data]
  }

  private isValidDate(dateStr: string): boolean {
    return !isNaN(new Date(dateStr).valueOf());
  }
}
