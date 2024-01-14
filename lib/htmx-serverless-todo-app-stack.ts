import { join } from 'node:path';
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
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
      entry: join(__dirname, 'lambdas', 'index.ts'),
    })

    const api = new RestApi(this, 'Api', {})

    api.root.addMethod('GET', new LambdaIntegration(indexHandlerFunction))
  }
}
