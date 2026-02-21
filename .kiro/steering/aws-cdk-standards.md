---
title: AWS CDK Standards
inclusion: always
---

# AWS CDK Standards

## Project Structure

```
infrastructure/
├── bin/
│   └── app.ts              # CDK app entry point
├── lib/
│   ├── stacks/
│   │   ├── api-stack.ts
│   │   ├── database-stack.ts
│   │   └── frontend-stack.ts
│   └── constructs/
│       ├── lambda-function.ts
│       └── api-gateway.ts
├── test/
│   └── stacks/
│       └── api-stack.test.ts
├── cdk.json
├── tsconfig.json
└── package.json
```

## Stack Organization

```typescript
// bin/app.ts
import * as cdk from 'aws-cdk-lib';
import { ApiStack } from '../lib/stacks/api-stack';
import { DatabaseStack } from '../lib/stacks/database-stack';

const app = new cdk.App();

const env = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION || 'us-east-1',
};

const databaseStack = new DatabaseStack(app, 'DatabaseStack', { env });
const apiStack = new ApiStack(app, 'ApiStack', {
  env,
  table: databaseStack.table,
});

app.synth();
```

## L2/L3 Constructs Preferred

```typescript
import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';

export class ApiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    
    // ✅ Good - L2 construct with sensible defaults
    const table = new dynamodb.Table(this, 'ProductsTable', {
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY, // Only for dev
      pointInTimeRecovery: true,
    });
    
    // ✅ Good - L2 Lambda function
    const handler = new lambda.Function(this, 'ProductHandler', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset('lambda'),
      environment: {
        TABLE_NAME: table.tableName,
      },
      timeout: cdk.Duration.seconds(30),
      memorySize: 512,
    });
    
    table.grantReadWriteData(handler);
  }
}
```

## Custom Constructs

```typescript
// lib/constructs/api-lambda.ts
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as logs from 'aws-cdk-lib/aws-logs';
import { Duration } from 'aws-cdk-lib';

export interface ApiLambdaProps {
  handler: string;
  environment?: Record<string, string>;
  timeout?: Duration;
}

export class ApiLambda extends Construct {
  public readonly function: lambda.Function;
  
  constructor(scope: Construct, id: string, props: ApiLambdaProps) {
    super(scope, id);
    
    this.function = new lambda.Function(this, 'Function', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: props.handler,
      code: lambda.Code.fromAsset('lambda'),
      environment: props.environment,
      timeout: props.timeout || Duration.seconds(30),
      logRetention: logs.RetentionDays.ONE_WEEK,
      tracing: lambda.Tracing.ACTIVE,
    });
  }
}
```

## Environment-Specific Configuration

```typescript
// lib/config.ts
export interface EnvironmentConfig {
  stage: string;
  logRetention: logs.RetentionDays;
  removalPolicy: cdk.RemovalPolicy;
  enableBackups: boolean;
}

export function getConfig(stage: string): EnvironmentConfig {
  const configs: Record<string, EnvironmentConfig> = {
    dev: {
      stage: 'dev',
      logRetention: logs.RetentionDays.ONE_WEEK,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      enableBackups: false,
    },
    prod: {
      stage: 'prod',
      logRetention: logs.RetentionDays.ONE_MONTH,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
      enableBackups: true,
    },
  };
  
  return configs[stage] || configs.dev;
}

// Usage in stack
const config = getConfig(this.node.tryGetContext('stage') || 'dev');
```

## Tagging

```typescript
import * as cdk from 'aws-cdk-lib';

const app = new cdk.App();

const stack = new ApiStack(app, 'ApiStack');

// Apply tags to all resources in stack
cdk.Tags.of(stack).add('Environment', 'production');
cdk.Tags.of(stack).add('Project', 'product-api');
cdk.Tags.of(stack).add('ManagedBy', 'CDK');
cdk.Tags.of(stack).add('CostCenter', 'engineering');
```

## Testing

```typescript
// test/stacks/api-stack.test.ts
import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { ApiStack } from '../../lib/stacks/api-stack';

describe('ApiStack', () => {
  test('creates DynamoDB table', () => {
    const app = new cdk.App();
    const stack = new ApiStack(app, 'TestStack');
    const template = Template.fromStack(stack);
    
    template.hasResourceProperties('AWS::DynamoDB::Table', {
      BillingMode: 'PAY_PER_REQUEST',
      PointInTimeRecoverySpecification: {
        PointInTimeRecoveryEnabled: true,
      },
    });
  });
  
  test('Lambda has correct environment variables', () => {
    const app = new cdk.App();
    const stack = new ApiStack(app, 'TestStack');
    const template = Template.fromStack(stack);
    
    template.hasResourceProperties('AWS::Lambda::Function', {
      Environment: {
        Variables: {
          TABLE_NAME: { Ref: cdk.Match.anyValue() },
        },
      },
    });
  });
  
  test('Lambda has IAM permissions for DynamoDB', () => {
    const app = new cdk.App();
    const stack = new ApiStack(app, 'TestStack');
    const template = Template.fromStack(stack);
    
    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: cdk.Match.arrayWith([
          cdk.Match.objectLike({
            Action: cdk.Match.arrayWith([
              'dynamodb:PutItem',
              'dynamodb:GetItem',
              'dynamodb:Query',
            ]),
          }),
        ]),
      },
    });
  });
});
```

## Outputs

```typescript
export class ApiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    
    const api = new apigateway.RestApi(this, 'Api');
    
    new cdk.CfnOutput(this, 'ApiUrl', {
      value: api.url,
      description: 'API Gateway URL',
      exportName: `${this.stackName}-ApiUrl`,
    });
    
    new cdk.CfnOutput(this, 'TableName', {
      value: table.tableName,
      description: 'DynamoDB table name',
    });
  }
}
```

## Cross-Stack References

```typescript
// database-stack.ts
export class DatabaseStack extends cdk.Stack {
  public readonly table: dynamodb.Table;
  
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    
    this.table = new dynamodb.Table(this, 'Table', {
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
    });
  }
}

// api-stack.ts
interface ApiStackProps extends cdk.StackProps {
  table: dynamodb.Table;
}

export class ApiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: ApiStackProps) {
    super(scope, id, props);
    
    const handler = new lambda.Function(this, 'Handler', {
      // ...
      environment: {
        TABLE_NAME: props.table.tableName,
      },
    });
    
    props.table.grantReadWriteData(handler);
  }
}
```

## CDK vs Terraform Decision

Use CDK when:
- Team is TypeScript/Python proficient
- AWS-only infrastructure
- Need type safety and IDE support
- Want to use L2/L3 constructs

Use Terraform when:
- Multi-cloud infrastructure
- Team prefers HCL
- Need Terraform ecosystem tools
- Existing Terraform infrastructure

## Common Commands

```bash
# Install dependencies
npm install

# Synthesize CloudFormation
cdk synth

# Deploy stack
cdk deploy ApiStack

# Deploy all stacks
cdk deploy --all

# Diff against deployed stack
cdk diff

# Destroy stack
cdk destroy ApiStack

# List stacks
cdk list

# Run tests
npm test
```

## Anti-Patterns

❌ Don't use L1 (Cfn) constructs unless necessary
❌ Don't hardcode values (use context or environment variables)
❌ Don't skip tagging
❌ Don't ignore removal policies (data loss risk)
❌ Don't create circular dependencies between stacks
❌ Don't use `cdk.RemovalPolicy.DESTROY` in production
❌ Don't skip testing infrastructure code
