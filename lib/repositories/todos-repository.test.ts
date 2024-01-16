import { mockClient } from "aws-sdk-client-mock";
import { TodosRepository } from './todos-repository';
import { DynamoDBClient, ScanCommand, PutItemCommand } from '@aws-sdk/client-dynamodb';
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

describe('create', () => {
  test('should create a new todo and return it', async () => {
    const data = {
      title: 'New Todo',
      description: 'This is a new todo',
      dueDate: '2029-12-31',
    };

    const expected = {
      id: expect.any(String),
      title: 'New Todo',
      description: 'This is a new todo',
      completed: false,
      createdAt: expect.any(String),
      dueDate: '2029-12-31',
    };

    clientMock.on(PutItemCommand).resolves({ $metadata: {} });

    const [errors, result] = await repository.create(data);

    expect(errors).toBeNull();
    expect(result).toEqual(expected);


    const commandCalls = clientMock.commandCalls(PutItemCommand);

    expect(commandCalls.length).toBe(1);

    const call = commandCalls[0].firstArg;

    expect(call.input.TableName).toBe('todos');
    expect(call.input.Item).toEqual({
      id: { S: expect.any(String) },
      title: { S: 'New Todo' },
      description: { S: 'This is a new todo' },
      completed: { BOOL: false },
      createdAt: { S: expect.any(String) },
      dueDate: { S: '2029-12-31' },
    })
  });

  test('should validate the data before creating a new todo', async () => {
    const data = {
      title: '',
      description: '',
      dueDate: '2021-12-31',
    };

    const expected = [
      'title is required',
      'dueDate must be a future date'
    ]

    clientMock.on(PutItemCommand).resolves({ $metadata: {} });

    const [errors, result] = await repository.create(data);

    expect(result).toBeNull()
    expect(errors).toEqual(expected);

    const commandCalls = clientMock.commandCalls(PutItemCommand);

    expect(commandCalls.length).toBe(0);
  });
});

describe('update', () => {
  test('should update a todo and return null', async () => {
    const id = '1';

    const data = {
      title: 'Updated Todo',
      completed: true,
    };

    const errors = await repository.update(id, data);

    expect(errors).toBeNull()

    const commandCalls = clientMock.commandCalls(PutItemCommand);

    expect(commandCalls.length).toBe(1);

    const call = commandCalls[0].firstArg;

    expect(call.input.TableName).toBe('todos');
    expect(call.input.Item).toEqual({
      id: { S: '1' },
      title: { S: 'Updated Todo' },
      completed: { BOOL: true },
    });
  });

  test('should validate the data before updating a todo', async () => {
    const id = '1';
    const data = {
      title: '',
      completed: true,
      dueDate: '2010-12-31',
    };

    const expected = ['title is required', 'dueDate must be a future date'];

    const errors = await repository.update(id, data);

    expect(errors).toEqual(expected);

    const commandCalls = clientMock.commandCalls(PutItemCommand);

    expect(commandCalls.length).toBe(0);
  });
});
