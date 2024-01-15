import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { PutItemCommand } from '@aws-sdk/client-dynamodb'
import { ddb } from '../ddb'
import { marshall} from '@aws-sdk/util-dynamodb'


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
    await ddb.send(command);
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
