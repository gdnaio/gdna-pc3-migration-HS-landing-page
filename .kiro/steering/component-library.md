---
title: Component Library Standards
inclusion: always
---

# Component Library Standards

## shadcn/ui + Radix UI

We use shadcn/ui components built on Radix UI primitives. Components are copied into your project (not installed as dependencies) for full control and auditability.

## Installation

```bash
npx shadcn-ui@latest init
npx shadcn-ui@latest add button
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add form
```

## Component Usage

```tsx
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export function ProductActions() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Open Dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Product Details</DialogTitle>
        </DialogHeader>
        <p>Product information goes here</p>
      </DialogContent>
    </Dialog>
  );
}
```

## Accessibility Requirements

All components MUST meet WCAG 2.1 AA standards:

### Keyboard Navigation
- All interactive elements accessible via keyboard
- Visible focus indicators
- Logical tab order

### Screen Reader Support
- Proper ARIA labels and roles
- Meaningful alt text for images
- Form labels associated with inputs

### Color Contrast
- Text: minimum 4.5:1 contrast ratio
- Large text (18pt+): minimum 3:1
- Interactive elements: minimum 3:1

```tsx
// ✅ Good - Accessible button
<Button aria-label="Delete product" onClick={handleDelete}>
  <TrashIcon aria-hidden="true" />
  Delete
</Button>

// ❌ Bad - Icon-only button without label
<Button onClick={handleDelete}>
  <TrashIcon />
</Button>
```

## Form Components

```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function ProductForm() {
  const form = useForm({
    resolver: zodResolver(productSchema),
  });
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter product name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
```

## Customization

Components can be customized via Tailwind classes:

```tsx
// ✅ Good - Extend with Tailwind
<Button className="bg-brand-500 hover:bg-brand-600">
  Custom Brand Button
</Button>

// ✅ Good - Create variant in component file
// components/ui/button.tsx
const buttonVariants = cva(
  "base-classes",
  {
    variants: {
      variant: {
        default: "...",
        brand: "bg-brand-500 hover:bg-brand-600",
      },
    },
  }
);
```

## Common Components

### Button
```tsx
<Button variant="default">Default</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline">Cancel</Button>
<Button variant="ghost">Ghost</Button>
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
```

### Dialog
```tsx
<Dialog>
  <DialogTrigger asChild>
    <Button>Open</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Title</DialogTitle>
      <DialogDescription>Description</DialogDescription>
    </DialogHeader>
    {/* Content */}
    <DialogFooter>
      <Button>Save</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

### Toast
```tsx
import { useToast } from '@/components/ui/use-toast';

export function Component() {
  const { toast } = useToast();
  
  return (
    <Button onClick={() => {
      toast({
        title: "Success",
        description: "Product created successfully",
      });
    }}>
      Create Product
    </Button>
  );
}
```

## Anti-Patterns

❌ Don't install UI component libraries as npm packages (use shadcn/ui copy approach)
❌ Don't use inline styles (use Tailwind classes)
❌ Don't create custom components when shadcn/ui has one
❌ Don't skip accessibility attributes
❌ Don't use `<div>` for clickable elements (use `<button>`)
