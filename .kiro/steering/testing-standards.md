---
title: Testing Standards
inclusion: always
---

# Testing Standards

## Testing Pyramid

```
        /\
       /  \      E2E Tests (Few)
      /____\     - Critical user flows
     /      \    - Playwright
    /________\   Integration Tests (Some)
   /          \  - API endpoints
  /____________\ - Component interactions
 /              \ Unit Tests (Many)
/______________\ - Pure functions
                 - Business logic
```

## Vitest Configuration

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'tests/',
        '**/*.config.ts',
        '**/*.d.ts',
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 75,
        statements: 80,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

## Unit Tests

```typescript
// src/utils/formatPrice.test.ts
import { describe, it, expect } from 'vitest';
import { formatPrice } from './formatPrice';

describe('formatPrice', () => {
  it('formats price with two decimal places', () => {
    expect(formatPrice(10)).toBe('$10.00');
    expect(formatPrice(10.5)).toBe('$10.50');
    expect(formatPrice(10.99)).toBe('$10.99');
  });
  
  it('handles zero', () => {
    expect(formatPrice(0)).toBe('$0.00');
  });
  
  it('handles negative numbers', () => {
    expect(formatPrice(-10)).toBe('-$10.00');
  });
  
  it('handles large numbers', () => {
    expect(formatPrice(1000000)).toBe('$1,000,000.00');
  });
});
```

## React Testing Library

```typescript
// components/ProductCard.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ProductCard } from './ProductCard';

describe('ProductCard', () => {
  const mockProduct = {
    id: '1',
    name: 'Test Product',
    price: 29.99,
    imageUrl: '/test.jpg',
  };
  
  it('renders product information', () => {
    render(<ProductCard product={mockProduct} />);
    
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('$29.99')).toBeInTheDocument();
    expect(screen.getByRole('img')).toHaveAttribute('src', '/test.jpg');
  });
  
  it('calls onAddToCart when button clicked', () => {
    const onAddToCart = vi.fn();
    render(<ProductCard product={mockProduct} onAddToCart={onAddToCart} />);
    
    const button = screen.getByRole('button', { name: /add to cart/i });
    fireEvent.click(button);
    
    expect(onAddToCart).toHaveBeenCalledWith('1');
    expect(onAddToCart).toHaveBeenCalledTimes(1);
  });
  
  it('is accessible', () => {
    const { container } = render(<ProductCard product={mockProduct} />);
    
    // Check for proper heading hierarchy
    expect(screen.getByRole('heading', { level: 3 })).toBeInTheDocument();
    
    // Check for alt text on image
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('alt', expect.stringContaining('Test Product'));
  });
});
```

## Testing Hooks

```typescript
// hooks/useProducts.test.ts
import { describe, it, expect, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useProducts } from './useProducts';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });
  
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('useProducts', () => {
  it('fetches products successfully', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [{ id: '1', name: 'Product 1' }],
    });
    
    const { result } = renderHook(() => useProducts(), {
      wrapper: createWrapper(),
    });
    
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    
    expect(result.current.data).toEqual([{ id: '1', name: 'Product 1' }]);
  });
  
  it('handles fetch error', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('Failed to fetch'));
    
    const { result } = renderHook(() => useProducts(), {
      wrapper: createWrapper(),
    });
    
    await waitFor(() => expect(result.current.isError).toBe(true));
    
    expect(result.current.error).toBeDefined();
  });
});
```

## Mocking

```typescript
// tests/mocks/handlers.ts
import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('/api/products', () => {
    return HttpResponse.json([
      { id: '1', name: 'Product 1', price: 10 },
      { id: '2', name: 'Product 2', price: 20 },
    ]);
  }),
  
  http.post('/api/products', async ({ request }) => {
    const product = await request.json();
    return HttpResponse.json(
      { id: '3', ...product },
      { status: 201 }
    );
  }),
  
  http.get('/api/products/:id', ({ params }) => {
    const { id } = params;
    if (id === '404') {
      return new HttpResponse(null, { status: 404 });
    }
    return HttpResponse.json({ id, name: `Product ${id}`, price: 10 });
  }),
];

// tests/setup.ts
import { beforeAll, afterEach, afterAll } from 'vitest';
import { setupServer } from 'msw/node';
import { handlers } from './mocks/handlers';

const server = setupServer(...handlers);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

## Integration Tests

```typescript
// tests/integration/checkout.test.ts
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CheckoutFlow } from '@/components/CheckoutFlow';

describe('Checkout Flow', () => {
  it('completes full checkout process', async () => {
    render(<CheckoutFlow />);
    
    // Add items to cart
    const addButton = screen.getByRole('button', { name: /add to cart/i });
    fireEvent.click(addButton);
    
    // Navigate to checkout
    const checkoutButton = screen.getByRole('button', { name: /checkout/i });
    fireEvent.click(checkoutButton);
    
    // Fill shipping form
    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: 'John Doe' },
    });
    fireEvent.change(screen.getByLabelText(/address/i), {
      target: { value: '123 Main St' },
    });
    
    // Submit order
    const submitButton = screen.getByRole('button', { name: /place order/i });
    fireEvent.click(submitButton);
    
    // Verify success
    await waitFor(() => {
      expect(screen.getByText(/order confirmed/i)).toBeInTheDocument();
    });
  });
});
```

## Playwright E2E Tests

```typescript
// e2e/checkout.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Checkout Flow', () => {
  test('user can complete purchase', async ({ page }) => {
    await page.goto('/products');
    
    // Add product to cart
    await page.getByRole('button', { name: /add to cart/i }).first().click();
    
    // Navigate to cart
    await page.getByRole('link', { name: /cart/i }).click();
    await expect(page).toHaveURL(/\/cart/);
    
    // Proceed to checkout
    await page.getByRole('button', { name: /checkout/i }).click();
    await expect(page).toHaveURL(/\/checkout/);
    
    // Fill form
    await page.getByLabel(/name/i).fill('John Doe');
    await page.getByLabel(/email/i).fill('john@example.com');
    await page.getByLabel(/address/i).fill('123 Main St');
    
    // Submit
    await page.getByRole('button', { name: /place order/i }).click();
    
    // Verify success
    await expect(page.getByText(/order confirmed/i)).toBeVisible();
    await expect(page).toHaveURL(/\/order\/[a-z0-9-]+/);
  });
  
  test('validates required fields', async ({ page }) => {
    await page.goto('/checkout');
    
    await page.getByRole('button', { name: /place order/i }).click();
    
    await expect(page.getByText(/name is required/i)).toBeVisible();
    await expect(page.getByText(/email is required/i)).toBeVisible();
  });
});
```

## Playwright Configuration

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

## Test Coverage Gates

```json
// package.json
{
  "scripts": {
    "test": "vitest",
    "test:coverage": "vitest --coverage",
    "test:e2e": "playwright test",
    "test:ci": "vitest --run --coverage && playwright test"
  }
}
```

## Testing Best Practices

```typescript
// ✅ Good - Test behavior, not implementation
it('shows error when form is invalid', async () => {
  render(<LoginForm />);
  fireEvent.click(screen.getByRole('button', { name: /login/i }));
  expect(await screen.findByText(/email is required/i)).toBeInTheDocument();
});

// ❌ Bad - Testing implementation details
it('sets error state when form is invalid', () => {
  const { result } = renderHook(() => useLoginForm());
  act(() => result.current.submit());
  expect(result.current.errors.email).toBe('Email is required');
});

// ✅ Good - Use accessible queries
screen.getByRole('button', { name: /submit/i });
screen.getByLabelText(/email/i);
screen.getByText(/welcome/i);

// ❌ Bad - Use test IDs or classes
screen.getByTestId('submit-button');
container.querySelector('.submit-btn');
```

## Anti-Patterns

❌ Don't test implementation details
❌ Don't use `waitFor` for everything (use `findBy` queries)
❌ Don't test third-party libraries
❌ Don't write tests that depend on each other
❌ Don't mock everything (test real integrations when possible)
❌ Don't skip accessibility testing
❌ Don't ignore flaky tests (fix them)
