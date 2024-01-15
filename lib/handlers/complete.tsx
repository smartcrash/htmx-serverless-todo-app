import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb'
import { marshall} from '@aws-sdk/util-dynamodb'

const client = new DynamoDBClient({});

export async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  const id = event.pathParameters?.id;

  if (!id) {
    // TODO: handle error
  }

  // TODO: handle non existent todo

  const command = new PutItemCommand({
    TableName: 'todos',
    Item: marshall({
      id,
      completed: true
    })
  });

  try {
    await client.send(command);
  } catch (error) {
    console.error(error);
    // TODO: handle error
  }

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
    body: ''
  }
}
