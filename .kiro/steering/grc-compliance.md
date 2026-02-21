---
title: GRC Compliance Standards
inclusion: always
---

# GRC Compliance Standards

## Data Classification

All data MUST be classified according to sensitivity:

### Classification Levels

```typescript
enum DataClassification {
  PUBLIC = 'public',           // No restrictions
  INTERNAL = 'internal',       // Internal use only
  CONFIDENTIAL = 'confidential', // Sensitive business data
  RESTRICTED = 'restricted',   // PII, PHI, financial data
}
```

### Component-Level Declaration

```typescript
// components/UserProfile.tsx
/**
 * @dataClassification RESTRICTED
 * @reason Displays user PII (name, email, phone)
 * @controls Server-side rendering only, authenticated access required
 */
export async function UserProfile({ userId }: { userId: string }) {
  const user = await fetchUser(userId);
  return <div>{user.name}</div>;
}
```

## PII Handling

### Never Store PII Client-Side

```typescript
// ❌ Bad - PII in localStorage
localStorage.setItem('user', JSON.stringify({ name, email, ssn }));

// ❌ Bad - PII in client state
const [userData, setUserData] = useState({ name, email, ssn });

// ✅ Good - PII stays server-side
export async function UserProfile() {
  const user = await fetchUserServerSide(); // Server Component
  return <div>{user.name}</div>;
}
```

### PII Redaction in Logs

```typescript
import pino from 'pino';

const logger = pino({
  redact: {
    paths: [
      'email',
      'phone',
      'ssn',
      'creditCard',
      'password',
      'address',
      '*.email',
      '*.phone',
    ],
    remove: true,
  },
});

// Automatically redacts PII
logger.info({ user: { name: 'John', email: 'john@example.com' } });
// Output: { user: { name: 'John' } }
```

## Audit Logging

### User Action Tracking

```typescript
// lib/audit-log.ts
interface AuditEvent {
  userId: string;
  action: string;
  resource: string;
  resourceId: string;
  timestamp: Date;
  ipAddress: string;
  userAgent: string;
  result: 'success' | 'failure';
  metadata?: Record<string, unknown>;
}

export async function logAuditEvent(event: AuditEvent) {
  await db.auditLogs.create({
    ...event,
    timestamp: new Date(),
  });
}

// Usage in Server Action
export async function deleteUser(userId: string) {
  const session = await getServerSession();
  
  try {
    await db.users.delete({ where: { id: userId } });
    
    await logAuditEvent({
      userId: session.user.id,
      action: 'DELETE_USER',
      resource: 'user',
      resourceId: userId,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      result: 'success',
    });
  } catch (error) {
    await logAuditEvent({
      userId: session.user.id,
      action: 'DELETE_USER',
      resource: 'user',
      resourceId: userId,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      result: 'failure',
      metadata: { error: error.message },
    });
    throw error;
  }
}
```

### Required Audit Events

Log ALL of these actions:
- User authentication (login, logout, failed attempts)
- Data access (view, download)
- Data modification (create, update, delete)
- Permission changes
- Configuration changes
- Admin actions

## Access Control (RBAC)

```typescript
// lib/rbac.ts
enum Role {
  USER = 'user',
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin',
}

enum Permission {
  READ_USERS = 'read:users',
  WRITE_USERS = 'write:users',
  DELETE_USERS = 'delete:users',
  READ_REPORTS = 'read:reports',
  MANAGE_SETTINGS = 'manage:settings',
}

const rolePermissions: Record<Role, Permission[]> = {
  [Role.USER]: [Permission.READ_USERS],
  [Role.ADMIN]: [
    Permission.READ_USERS,
    Permission.WRITE_USERS,
    Permission.READ_REPORTS,
  ],
  [Role.SUPER_ADMIN]: Object.values(Permission),
};

export function hasPermission(role: Role, permission: Permission): boolean {
  return rolePermissions[role]?.includes(permission) || false;
}

// Middleware
export async function requirePermission(permission: Permission) {
  const session = await getServerSession();
  
  if (!session) {
    throw new Error('Unauthorized');
  }
  
  if (!hasPermission(session.user.role, permission)) {
    throw new Error('Forbidden');
  }
}

// Usage
export async function deleteUser(userId: string) {
  await requirePermission(Permission.DELETE_USERS);
  await db.users.delete({ where: { id: userId } });
}
```

## Data Retention

```typescript
// lib/data-retention.ts
interface RetentionPolicy {
  dataType: string;
  retentionDays: number;
  archiveAfterDays?: number;
}

const retentionPolicies: RetentionPolicy[] = [
  { dataType: 'audit_logs', retentionDays: 2555 }, // 7 years
  { dataType: 'user_sessions', retentionDays: 90 },
  { dataType: 'temp_files', retentionDays: 7 },
  { dataType: 'analytics', retentionDays: 365, archiveAfterDays: 90 },
];

export async function enforceRetentionPolicies() {
  for (const policy of retentionPolicies) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - policy.retentionDays);
    
    await db[policy.dataType].deleteMany({
      where: {
        createdAt: { lt: cutoffDate },
      },
    });
  }
}
```

## Consent Management

```typescript
// lib/consent.ts
interface ConsentRecord {
  userId: string;
  consentType: 'marketing' | 'analytics' | 'data_processing';
  granted: boolean;
  timestamp: Date;
  ipAddress: string;
  version: string; // Privacy policy version
}

export async function recordConsent(consent: ConsentRecord) {
  await db.consents.create(consent);
  
  await logAuditEvent({
    userId: consent.userId,
    action: 'CONSENT_UPDATED',
    resource: 'consent',
    resourceId: consent.consentType,
    result: 'success',
    metadata: { granted: consent.granted, version: consent.version },
  });
}

export async function hasConsent(
  userId: string,
  consentType: ConsentRecord['consentType']
): Promise<boolean> {
  const consent = await db.consents.findFirst({
    where: { userId, consentType },
    orderBy: { timestamp: 'desc' },
  });
  
  return consent?.granted || false;
}
```

## WCAG 2.1 AA Compliance

### Accessibility Requirements

```typescript
// ✅ Good - Accessible form
<form>
  <label htmlFor="email">Email Address</label>
  <input
    id="email"
    type="email"
    aria-required="true"
    aria-describedby="email-error"
  />
  <span id="email-error" role="alert">
    {errors.email}
  </span>
</form>

// ✅ Good - Keyboard navigation
<button
  onClick={handleClick}
  onKeyDown={(e) => e.key === 'Enter' && handleClick()}
>
  Submit
</button>

// ✅ Good - Screen reader support
<button aria-label="Close dialog">
  <XIcon aria-hidden="true" />
</button>
```

### Color Contrast

```css
/* ✅ Good - 4.5:1 contrast ratio for normal text */
.text {
  color: #333333; /* Dark gray */
  background: #ffffff; /* White */
}

/* ✅ Good - 3:1 for large text (18pt+) */
.heading {
  color: #666666;
  background: #ffffff;
  font-size: 18pt;
}
```

## SOC 2 Alignment

### Change Management

```typescript
// All infrastructure changes must be:
// 1. Reviewed (PR approval required)
// 2. Tested (CI/CD pipeline)
// 3. Documented (commit message, PR description)
// 4. Auditable (git history)

// Example PR template
/**
 * ## Change Description
 * Add user authentication system
 * 
 * ## Security Impact
 * - Introduces session management
 * - Adds password hashing
 * - Implements rate limiting
 * 
 * ## Testing
 * - Unit tests: 95% coverage
 * - Integration tests: All passing
 * - Security scan: No vulnerabilities
 * 
 * ## Rollback Plan
 * Revert commit abc123 if issues occur
 */
```

### Incident Response

```typescript
// lib/incident.ts
interface SecurityIncident {
  id: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  type: string;
  description: string;
  detectedAt: Date;
  detectedBy: string;
  status: 'open' | 'investigating' | 'resolved';
  affectedUsers?: string[];
  mitigationSteps: string[];
}

export async function reportIncident(incident: SecurityIncident) {
  await db.incidents.create(incident);
  
  // Alert security team
  if (incident.severity === 'critical') {
    await sendPagerDutyAlert(incident);
  }
  
  // Log for audit
  await logAuditEvent({
    userId: incident.detectedBy,
    action: 'INCIDENT_REPORTED',
    resource: 'security_incident',
    resourceId: incident.id,
    result: 'success',
    metadata: { severity: incident.severity, type: incident.type },
  });
}
```

## Encryption

### Data at Rest

```typescript
// Use AWS KMS for encryption at rest
import { KMSClient, EncryptCommand, DecryptCommand } from '@aws-sdk/client-kms';

const kms = new KMSClient({ region: 'us-east-1' });

export async function encryptData(data: string): Promise<string> {
  const command = new EncryptCommand({
    KeyId: process.env.KMS_KEY_ID,
    Plaintext: Buffer.from(data),
  });
  
  const response = await kms.send(command);
  return Buffer.from(response.CiphertextBlob!).toString('base64');
}

export async function decryptData(encrypted: string): Promise<string> {
  const command = new DecryptCommand({
    CiphertextBlob: Buffer.from(encrypted, 'base64'),
  });
  
  const response = await kms.send(command);
  return Buffer.from(response.Plaintext!).toString('utf-8');
}
```

### Data in Transit

```typescript
// Always use HTTPS
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
        ],
      },
    ];
  },
};
```

## Compliance Checklist

- [ ] All data classified by sensitivity level
- [ ] PII never stored client-side
- [ ] Audit logging for all sensitive actions
- [ ] RBAC implemented and enforced
- [ ] Data retention policies defined and automated
- [ ] Consent management system in place
- [ ] WCAG 2.1 AA compliance verified
- [ ] Security headers configured
- [ ] Encryption at rest and in transit
- [ ] Incident response plan documented
- [ ] Regular security audits scheduled
- [ ] Dependency scanning automated
- [ ] Access reviews conducted quarterly

## Anti-Patterns

❌ Don't store PII in client-side storage
❌ Don't skip audit logging for "minor" actions
❌ Don't implement custom encryption (use AWS KMS)
❌ Don't ignore accessibility requirements
❌ Don't grant broad permissions by default
❌ Don't retain data indefinitely
❌ Don't assume consent (explicit opt-in required)
