import { join } from 'node:path';
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { Table, AttributeType, BillingMode } from 'aws-cdk-lib/aws-dynamodb';
import { NodejsFunction, NodejsFunctionProps } from 'aws-cdk-lib/aws-lambda-nodejs';
import { LambdaIntegration, RestApi } from 'aws-cdk-lib/aws-apigateway';

export class HtmxServerlessTodoAppStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const defaultNodejsFunctionProps: NodejsFunctionProps = {
      runtime: Runtime.NODEJS_20_X,
    }

    const indexHandlerFunction = new NodejsFunction(this, 'IndexHandler', {
      ...defaultNodejsFunctionProps,
      entry: join(__dirname, 'lambdas', 'index.tsx'),
    })

    const listTodosHandlerFunction = new NodejsFunction(this, 'ListTodosHandler', {
      ...defaultNodejsFunctionProps,
      entry: join(__dirname, 'lambdas', 'list.tsx'),
    })

    const createTodoHandlerFunction = new NodejsFunction(this, 'CreateTodoHandler', {
      ...defaultNodejsFunctionProps,
      entry: join(__dirname, 'lambdas', 'create.tsx'),
    })

    const completeTodoHandlerFunction = new NodejsFunction(this, 'CompleteTodoHandler', {
      ...defaultNodejsFunctionProps,
      entry: join(__dirname, 'lambdas', 'complete.tsx'),
    })

    const table = new Table(this, 'Todos', {
      partitionKey: {
        name: 'id',
        type: AttributeType.STRING,
      },
      tableName: 'todos',
      billingMode: BillingMode.PAY_PER_REQUEST,
      /**
       *  The default removal policy is RETAIN, which means that cdk destroy will not attempt to delete
       * the new table, and it will remain in your account until manually deleted. By setting the policy to
       * DESTROY, cdk destroy will delete the table (even if it has data in it)
       */
      removalPolicy: cdk.RemovalPolicy.DESTROY, // NOT recommended for production code
    })

    table.grantReadData(listTodosHandlerFunction)
    table.grantWriteData(createTodoHandlerFunction)
    table.grantWriteData(completeTodoHandlerFunction)

    const api = new RestApi(this, 'Api', {})

    api.root.addMethod('GET', new LambdaIntegration(indexHandlerFunction))

    const todos = api.root.addResource('todos')

    todos.addMethod('GET', new LambdaIntegration(listTodosHandlerFunction))
    todos.addMethod('POST', new LambdaIntegration(createTodoHandlerFunction))

    const todo = todos.addResource('{id}')

    todo.addResource('complete').addMethod('PATCH', new LambdaIntegration(completeTodoHandlerFunction))
  }
}
