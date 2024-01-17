<!-- @format -->

# HTMX Serverless Todo App

This is a simple todo app that uses [HTMX](https://htmx.org/) to make a serverless todo app with AWS Lambda and DynamoDB.

Live demo: https://raohdxk0l3.execute-api.eu-west-1.amazonaws.com/prod/

### Getting Started

1. Install the dependencies

```bash
pnpm install
```

2. Deploy the stack

```bash
AWS_PROFILE=your-profile npx cdk deploy
```

3. Navigate to the URL outputted by the CDK deploy command

## Useful commands

- `npm run build` compile typescript to js
- `npm run watch` watch for changes and compile
- `npm run test` perform the jest unit tests
- `npx cdk deploy` deploy this stack to your default AWS account/region
- `npx cdk diff` compare deployed stack with current state
- `npx cdk synth` emits the synthesized CloudFormation template
