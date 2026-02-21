# Security Baseline (FTR-Aligned)

## When to Use
Every g/d/n/a project. No exceptions.

See `security-standards.md` and `grc-compliance.md` for full standards.

## Quick Reference
- One IAM role per service/function with least privilege
- No wildcard Actions or Resources in production
- S3: SSE-S3 minimum, SSE-KMS for sensitive data
- All endpoints: TLS 1.2+ enforced
- Secrets: AWS Secrets Manager with automatic rotation
- CloudTrail, GuardDuty, Security Hub enabled
