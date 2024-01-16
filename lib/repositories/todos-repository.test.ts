import { mockClient } from "aws-sdk-client-mock";
import { TodosRepository } from './todos-repository';
import { DynamoDBClient, ScanCommand } from '@aws-sdk/client-dynamodb';
import { marshall } from '@aws-sdk/util-dynamodb';

let repository: TodosRepository;
let clientMock: ReturnType<typeof mockClient>;

beforeEach(() => {
  clientMock = mockClient(DynamoDBClient);
  repository = new TodosRepository(clientMock as any);
});

afterEach(() => {
  clientMock.reset();
});

describe('findAll', () => {
  test('should return an array of todos from the DynamoDB table', async () => {
    const expencted = [
      { id: '1', title: 'Todo 1', completed: false },
      { id: '2', title: 'Todo 2', completed: true, dueDate: '2021-01-01' },
    ];

    clientMock.on(ScanCommand).resolves({
      Items: expencted.map((item) => marshall(item)),
    });

    const result = await repository.findAll({});

    expect(result).toEqual(expencted);
  });

  test('should filter todos by passed `where` argument', async () => {
    const where = {
      completed: true,
      dueDate: '2021-01-01',
    }

    clientMock.on(ScanCommand).resolves({ Items: [] });

    await repository.findAll(where);

    const commandCalls = clientMock.commandCalls(ScanCommand);

    expect(commandCalls.length).toBe(1);

    const expectedFilterExpression = 'completed = :completed AND dueDate = :dueDate';
    const expectedExpressionAttributeValues = {
      ':completed': { BOOL: true },
      ':dueDate': { S: '2021-01-01' },
    }

    const call = commandCalls[0].firstArg;

    expect(call.input.FilterExpression).toEqual(expectedFilterExpression);
    expect(call.input.ExpressionAttributeValues).toEqual(expectedExpressionAttributeValues);
  });
})
