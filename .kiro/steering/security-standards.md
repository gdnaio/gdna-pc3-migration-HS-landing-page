---
title: Security Standards
inclusion: always
---

# Security Standards

## Authentication

### Auth.js (NextAuth.js) - Server-Side Sessions Only

```typescript
// app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: 'jwt', // Server-side JWT, never exposed to client
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
```

### Protected Routes

```typescript
// middleware.ts
import { withAuth } from 'next-auth/middleware';

export default withAuth({
  callbacks: {
    authorized: ({ token, req }) => {
      // Require authentication for /dashboard routes
      if (req.nextUrl.pathname.startsWith('/dashboard')) {
        return !!token;
      }
      // Require admin role for /admin routes
      if (req.nextUrl.pathname.startsWith('/admin')) {
        return token?.role === 'admin';
      }
      return true;
    },
  },
});

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*'],
};
```

### Server Actions with Auth

```typescript
// app/actions/products.ts
'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { revalidatePath } from 'next/cache';

export async function createProduct(formData: FormData) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    throw new Error('Unauthorized');
  }
  
  if (session.user.role !== 'admin') {
    throw new Error('Forbidden');
  }
  
  // Create product
  await db.products.create({
    name: formData.get('name') as string,
    createdBy: session.user.id,
  });
  
  revalidatePath('/products');
}
```

## Secret Management

### Environment Variables

```bash
# .env.local (NEVER commit this file)
DATABASE_URL="postgresql://user:password@localhost:5432/db"
GOOGLE_CLIENT_ID="your-client-id"
GOOGLE_CLIENT_SECRET="your-client-secret"
API_KEY="your-api-key"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
NEXTAUTH_URL="http://localhost:3000"
```

### AWS Secrets Manager (Production)

```typescript
// lib/secrets.ts
import { SecretsManagerClient, GetSecretValueCommand } from '@aws-sdk/client-secrets-manager';

const client = new SecretsManagerClient({ region: 'us-east-1' });

export async function getSecret(secretName: string): Promise<string> {
  const command = new GetSecretValueCommand({ SecretId: secretName });
  const response = await client.send(command);
  return response.SecretString || '';
}

// Usage in Lambda
const dbPassword = await getSecret('prod/database/password');
```

### Never Hardcode Secrets

```typescript
// ❌ Bad - Hardcoded secret
const apiKey = 'sk_live_abc123xyz';

// ✅ Good - Environment variable
const apiKey = process.env.API_KEY;

// ✅ Good - AWS Secrets Manager
const apiKey = await getSecret('prod/api-key');
```

## Input Validation

### Zod Validation

```typescript
import { z } from 'zod';

const productSchema = z.object({
  name: z.string().min(1).max(100),
  price: z.number().positive().max(1000000),
  email: z.string().email(),
  url: z.string().url().optional(),
});

export async function createProduct(data: unknown) {
  // Validate and sanitize input
  const validated = productSchema.parse(data);
  
  // Safe to use validated data
  await db.products.create(validated);
}
```

### SQL Injection Prevention

```typescript
// ❌ Bad - SQL injection vulnerability
const userId = req.query.id;
const query = `SELECT * FROM users WHERE id = '${userId}'`;

// ✅ Good - Parameterized query
const userId = req.query.id;
const query = 'SELECT * FROM users WHERE id = $1';
const result = await db.query(query, [userId]);

// ✅ Good - ORM (Prisma)
const user = await prisma.user.findUnique({
  where: { id: userId },
});
```

## XSS Prevention

```typescript
// ✅ Good - React automatically escapes
function UserProfile({ user }) {
  return <div>{user.name}</div>; // Safe
}

// ⚠️ Dangerous - Only use when absolutely necessary
function RichContent({ html }) {
  return <div dangerouslySetInnerHTML={{ __html: html }} />; // Sanitize first!
}

// ✅ Good - Sanitize HTML
import DOMPurify from 'isomorphic-dompurify';

function RichContent({ html }) {
  const clean = DOMPurify.sanitize(html);
  return <div dangerouslySetInnerHTML={{ __html: clean }} />;
}
```

## CSRF Protection

```typescript
// Next.js Server Actions have built-in CSRF protection
// No additional configuration needed

// For API routes, use csrf library
import { createCsrfProtect } from '@edge-csrf/nextjs';

const csrfProtect = createCsrfProtect({
  cookie: {
    secure: process.env.NODE_ENV === 'production',
  },
});

export async function POST(req: Request) {
  await csrfProtect(req);
  // Handle request
}
```

## Content Security Policy

```typescript
// next.config.js
const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "font-src 'self' data:",
      "connect-src 'self' https://api.example.com",
      "frame-ancestors 'none'",
    ].join('; '),
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()',
  },
];

module.exports = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
};
```

## Rate Limiting

```typescript
// lib/rate-limit.ts
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL!,
  token: process.env.UPSTASH_REDIS_TOKEN!,
});

export const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '10 s'), // 10 requests per 10 seconds
});

// Usage in API route
export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for') || 'anonymous';
  const { success } = await ratelimit.limit(ip);
  
  if (!success) {
    return new Response('Too many requests', { status: 429 });
  }
  
  // Handle request
}
```

## Dependency Scanning

```json
// package.json
{
  "scripts": {
    "audit": "npm audit",
    "audit:fix": "npm audit fix",
    "audit:production": "npm audit --production"
  }
}
```

```yaml
# .github/workflows/security.yml
name: Security Scan

on: [push, pull_request]

jobs:
  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm audit --production
      - uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
```

## Secure Headers

```typescript
// middleware.ts
import { NextResponse } from 'next/server';

export function middleware(request: Request) {
  const response = NextResponse.next();
  
  // Security headers
  response.headers.set('X-DNS-Prefetch-Control', 'on');
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  return response;
}
```

## Password Hashing

```typescript
import bcrypt from 'bcryptjs';

// Hash password
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
}

// Verify password
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// Usage
const hashedPassword = await hashPassword(userPassword);
await db.users.create({ email, password: hashedPassword });

// Login
const user = await db.users.findByEmail(email);
const isValid = await verifyPassword(password, user.password);
```

## API Key Management

```typescript
// lib/api-keys.ts
import crypto from 'crypto';

export function generateApiKey(): string {
  return `sk_${crypto.randomBytes(32).toString('hex')}`;
}

export function hashApiKey(apiKey: string): string {
  return crypto.createHash('sha256').update(apiKey).digest('hex');
}

// Store hashed version in database
const apiKey = generateApiKey();
const hashedKey = hashApiKey(apiKey);
await db.apiKeys.create({ userId, key: hashedKey });

// Return unhashed key to user ONCE
return { apiKey }; // User must save this

// Verify API key
const hashedInput = hashApiKey(providedKey);
const keyRecord = await db.apiKeys.findByHash(hashedInput);
```

## Logging and Monitoring

```typescript
// lib/logger.ts
import pino from 'pino';

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  redact: {
    paths: ['password', 'apiKey', 'token', 'secret'],
    remove: true,
  },
});

// Usage
logger.info({ userId: user.id }, 'User logged in');
logger.error({ err, userId }, 'Failed to process payment');

// ❌ Bad - Logging sensitive data
logger.info({ password: user.password }, 'User created');

// ✅ Good - Redacted automatically
logger.info({ userId: user.id }, 'User created');
```

## Anti-Patterns

❌ Don't store tokens in localStorage (use httpOnly cookies)
❌ Don't expose API keys in client-side code
❌ Don't use weak password hashing (MD5, SHA1)
❌ Don't trust user input (always validate)
❌ Don't commit secrets to version control
❌ Don't use `eval()` or `Function()` constructor
❌ Don't disable security features for convenience
❌ Don't ignore security warnings from npm audit
