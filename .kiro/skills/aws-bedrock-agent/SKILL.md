# AWS Bedrock Agent Patterns

## When to Use
Building multi-agent systems on AWS using Bedrock, Step Functions,
or custom orchestration for g/d/n/a customer engagements.

See `agentic-ai-standards.md` steering doc for full standards.

## Architecture Patterns

### Pattern 1: Step Functions Orchestrator
Deterministic workflow, audit trail, human-in-the-loop checkpoints.

### Pattern 2: Event-Driven Agent Mesh
Async event reactions, fan-out processing, high throughput.

### Pattern 3: Bedrock Agents (Managed)
Simpler use case, AWS Bedrock adoption visibility.

## Common Anti-Patterns (Avoid)
- Single monolithic agent trying to do everything
- Synchronous chaining of LLM calls
- Storing conversation state in Lambda /tmp
- Hardcoding model IDs
- Skipping human-in-the-loop for high-stakes outputs
