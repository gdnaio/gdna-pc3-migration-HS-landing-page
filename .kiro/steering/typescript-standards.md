---
title: TypeScript Standards
inclusion: always
---

# TypeScript Standards

## Configuration

Always use strict mode in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "forceConsistentCasingInFileNames": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  }
}
```

## Naming Conventions

```tsx
// Types and Interfaces - PascalCase
type User = { id: string; name: string };
interface ProductProps { product: Product; }

// Variables and Functions - camelCase
const userName = 'John';
function fetchUser() {}

// Constants - SCREAMING_SNAKE_CASE
const API_BASE_URL = 'https://api.example.com';
const MAX_RETRY_COUNT = 3;

// Components - PascalCase
export function ProductCard() {}

// Files - kebab-case or PascalCase (match export)
// product-card.tsx or ProductCard.tsx
```

## Type vs Interface

Prefer `type` for most cases, use `interface` for extensible object shapes:

```tsx
// ✅ Good - Type for unions, intersections, primitives
type Status = 'pending' | 'active' | 'inactive';
type ID = string | number;
type UserWithRole = User & { role: Role };

// ✅ Good - Interface for object shapes that may be extended
interface User {
  id: string;
  name: string;
}

interface AdminUser extends User {
  permissions: string[];
}
```

## Avoid `any`

```tsx
// ❌ Bad
function processData(data: any) {
  return data.value;
}

// ✅ Good - Use unknown and type guard
function processData(data: unknown) {
  if (typeof data === 'object' && data !== null && 'value' in data) {
    return data.value;
  }
  throw new Error('Invalid data');
}

// ✅ Better - Use generic
function processData<T extends { value: string }>(data: T) {
  return data.value;
}
```

## Result/Either Pattern

Use for operations that can fail:

```tsx
type Result<T, E = Error> = 
  | { success: true; data: T }
  | { success: false; error: E };

async function fetchUser(id: string): Promise<Result<User>> {
  try {
    const response = await fetch(`/api/users/${id}`);
    if (!response.ok) {
      return { success: false, error: new Error('User not found') };
    }
    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error as Error };
  }
}

// Usage
const result = await fetchUser('123');
if (result.success) {
  console.log(result.data.name); // Type-safe access
} else {
  console.error(result.error.message);
}
```

## Zod for Runtime Validation

```tsx
import { z } from 'zod';

const userSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  email: z.string().email(),
  age: z.number().int().positive().optional(),
});

type User = z.infer<typeof userSchema>;

function validateUser(data: unknown): Result<User> {
  const result = userSchema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, error: new Error(result.error.message) };
}
```

## Utility Types

```tsx
// Partial - Make all properties optional
type PartialUser = Partial<User>;

// Required - Make all properties required
type RequiredUser = Required<User>;

// Pick - Select specific properties
type UserPreview = Pick<User, 'id' | 'name'>;

// Omit - Exclude specific properties
type UserWithoutEmail = Omit<User, 'email'>;

// Record - Create object type with specific keys
type UserRoles = Record<string, 'admin' | 'user' | 'guest'>;
```

## Generics

```tsx
// ✅ Good - Generic function
function first<T>(arr: T[]): T | undefined {
  return arr[0];
}

// ✅ Good - Generic component
interface ListProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
}

export function List<T>({ items, renderItem }: ListProps<T>) {
  return <ul>{items.map(renderItem)}</ul>;
}

// Usage
<List items={products} renderItem={(p) => <li key={p.id}>{p.name}</li>} />
```

## Type Guards

```tsx
function isUser(value: unknown): value is User {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'name' in value
  );
}

function processValue(value: unknown) {
  if (isUser(value)) {
    console.log(value.name); // Type-safe
  }
}
```

## Discriminated Unions

```tsx
type ApiResponse<T> =
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: string };

function handleResponse<T>(response: ApiResponse<T>) {
  switch (response.status) {
    case 'loading':
      return <Spinner />;
    case 'success':
      return <div>{response.data}</div>; // Type-safe access
    case 'error':
      return <Error message={response.error} />;
  }
}
```

## Anti-Patterns

❌ Don't use `any` (use `unknown` or proper types)
❌ Don't use `as` type assertions unless absolutely necessary
❌ Don't use `@ts-ignore` or `@ts-expect-error` without explanation
❌ Don't define types inline (extract to named types)
❌ Don't use `Function` type (use specific function signature)
❌ Don't use `object` type (use specific object shape)
❌ Don't use optional chaining (`?.`) as a band-aid for poor types
