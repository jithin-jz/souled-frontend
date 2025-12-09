# Testing Guide

## Overview

This document outlines the testing strategy, setup, and guidelines for the Souled eCommerce application.

---

## Table of Contents

- [Testing Strategy](#testing-strategy)
- [Setup](#setup)
- [Running Tests](#running-tests)
- [Writing Tests](#writing-tests)
- [Test Coverage](#test-coverage)
- [Example Test Cases](#example-test-cases)

---

## Testing Strategy

### Testing Pyramid

Our testing approach follows the testing pyramid:

1. **Unit Tests (70%)** - Test individual components and functions
2. **Integration Tests (20%)** - Test component interactions and API integration
3. **End-to-End Tests (10%)** - Test complete user flows

### Tools & Libraries

- **Vitest** - Fast unit testing framework (Vite-native)
- **React Testing Library** - Component testing utilities
- **MSW (Mock Service Worker)** - API mocking
- **Playwright** - End-to-end testing (optional)

---

## Setup

### Install Testing Dependencies

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom msw
```

### Configure Vitest

Create `vitest.config.js`:

```javascript
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/test/setup.js",
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: ["node_modules/", "src/test/", "**/*.config.js"],
    },
  },
});
```

### Test Setup File

Create `src/test/setup.js`:

```javascript
import { expect, afterEach } from "vitest";
import { cleanup } from "@testing-library/react";
import * as matchers from "@testing-library/jest-dom/matchers";

// Extend Vitest's expect with jest-dom matchers
expect.extend(matchers);

// Cleanup after each test
afterEach(() => {
  cleanup();
});
```

### Update package.json

Add test scripts:

```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "test:run": "vitest run"
  }
}
```

---

## Running Tests

### Run All Tests

```bash
npm test
```

### Run Tests in Watch Mode

```bash
npm test -- --watch
```

### Run Tests with UI

```bash
npm run test:ui
```

### Generate Coverage Report

```bash
npm run test:coverage
```

Coverage report will be generated in `coverage/` directory.

### Run Specific Test File

```bash
npm test -- src/components/Navbar.test.jsx
```

### Run Tests Matching Pattern

```bash
npm test -- --grep "authentication"
```

---

## Writing Tests

### Component Testing

#### Basic Component Test

```javascript
// src/components/__tests__/Navbar.test.jsx
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Navbar from "../Navbar";
import { useAuthStore } from "../../store/useAuthStore";

// Mock the auth store
vi.mock("../../store/useAuthStore");

describe("Navbar", () => {
  it("renders logo and navigation links", () => {
    useAuthStore.mockReturnValue({
      user: null,
      isAuthenticated: false,
    });

    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );

    expect(screen.getByText("Souled")).toBeInTheDocument();
    expect(screen.getByText("Products")).toBeInTheDocument();
  });

  it("shows user menu when authenticated", () => {
    useAuthStore.mockReturnValue({
      user: { first_name: "John", is_staff: false },
      isAuthenticated: true,
    });

    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );

    expect(screen.getByText("John")).toBeInTheDocument();
  });
});
```

#### Testing User Interactions

```javascript
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

it("handles button click", async () => {
  const user = userEvent.setup();
  const handleClick = vi.fn();

  render(<button onClick={handleClick}>Click me</button>);

  await user.click(screen.getByText("Click me"));

  expect(handleClick).toHaveBeenCalledTimes(1);
});
```

### API Mocking with MSW

#### Setup MSW Handlers

```javascript
// src/test/mocks/handlers.js
import { http, HttpResponse } from "msw";

export const handlers = [
  // Mock login endpoint
  http.post("/api/login/", async ({ request }) => {
    const { email, password } = await request.json();

    if (email === "test@example.com" && password === "password") {
      return HttpResponse.json({
        access: "mock-access-token",
        refresh: "mock-refresh-token",
        user: {
          id: 1,
          email: "test@example.com",
          first_name: "Test",
          last_name: "User",
          is_staff: false,
        },
      });
    }

    return HttpResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }),

  // Mock products endpoint
  http.get("/api/products/", () => {
    return HttpResponse.json({
      count: 2,
      results: [
        {
          id: 1,
          name: "Test Product 1",
          price: "29.99",
          stock: 10,
        },
        {
          id: 2,
          name: "Test Product 2",
          price: "39.99",
          stock: 5,
        },
      ],
    });
  }),
];
```

#### Setup MSW Server

```javascript
// src/test/mocks/server.js
import { setupServer } from "msw/node";
import { handlers } from "./handlers";

export const server = setupServer(...handlers);
```

#### Use in Tests

```javascript
// src/test/setup.js
import { beforeAll, afterEach, afterAll } from "vitest";
import { server } from "./mocks/server";

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

### Store Testing

```javascript
// src/store/__tests__/useAuthStore.test.js
import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useAuthStore } from "../useAuthStore";

describe("useAuthStore", () => {
  beforeEach(() => {
    // Reset store before each test
    const { result } = renderHook(() => useAuthStore());
    act(() => {
      result.current.logout();
    });
  });

  it("initializes with null user", () => {
    const { result } = renderHook(() => useAuthStore());
    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it("sets user on login", () => {
    const { result } = renderHook(() => useAuthStore());
    const mockUser = {
      id: 1,
      email: "test@example.com",
      first_name: "Test",
    };

    act(() => {
      result.current.setUser(mockUser);
    });

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.isAuthenticated).toBe(true);
  });
});
```

---

## Test Coverage

### Coverage Goals

- **Overall Coverage:** 80%+
- **Critical Paths:** 90%+
  - Authentication flows
  - Checkout process
  - Payment handling
  - Cart operations

### Viewing Coverage

After running `npm run test:coverage`, open `coverage/index.html` in your browser to see detailed coverage reports.

### Coverage Metrics

- **Statements:** % of code statements executed
- **Branches:** % of conditional branches tested
- **Functions:** % of functions called
- **Lines:** % of code lines executed

---

## Example Test Cases

### Authentication Tests

```javascript
// src/pages/__tests__/Login.test.jsx
import { describe, it, expect } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import Login from "../Login";

describe("Login Page", () => {
  it("renders login form", () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });

  it("shows validation errors for empty fields", async () => {
    const user = userEvent.setup();

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    const submitButton = screen.getByRole("button", { name: /login/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    });
  });

  it("submits form with valid credentials", async () => {
    const user = userEvent.setup();

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    await user.type(screen.getByLabelText(/email/i), "test@example.com");
    await user.type(screen.getByLabelText(/password/i), "password");
    await user.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(screen.getByText(/login successful/i)).toBeInTheDocument();
    });
  });
});
```

### Cart Tests

```javascript
// src/store/__tests__/useCartStore.test.js
import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useCartStore } from "../useCartStore";

describe("useCartStore", () => {
  beforeEach(() => {
    const { result } = renderHook(() => useCartStore());
    act(() => {
      result.current.clearCart();
    });
  });

  it("adds item to cart", () => {
    const { result } = renderHook(() => useCartStore());
    const product = {
      id: 1,
      name: "Test Product",
      price: "29.99",
    };

    act(() => {
      result.current.addToCart(product, 2);
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].quantity).toBe(2);
  });

  it("updates item quantity", () => {
    const { result } = renderHook(() => useCartStore());
    const product = {
      id: 1,
      name: "Test Product",
      price: "29.99",
    };

    act(() => {
      result.current.addToCart(product, 2);
      result.current.updateQuantity(1, 5);
    });

    expect(result.current.items[0].quantity).toBe(5);
  });

  it("removes item from cart", () => {
    const { result } = renderHook(() => useCartStore());
    const product = {
      id: 1,
      name: "Test Product",
      price: "29.99",
    };

    act(() => {
      result.current.addToCart(product, 2);
      result.current.removeFromCart(1);
    });

    expect(result.current.items).toHaveLength(0);
  });

  it("calculates total correctly", () => {
    const { result } = renderHook(() => useCartStore());

    act(() => {
      result.current.addToCart({ id: 1, price: "10.00" }, 2);
      result.current.addToCart({ id: 2, price: "15.00" }, 1);
    });

    expect(result.current.total).toBe("35.00");
  });
});
```

### Product Listing Tests

```javascript
// src/pages/__tests__/Products.test.jsx
import { describe, it, expect } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Products from "../Products/Products";

describe("Products Page", () => {
  it("loads and displays products", async () => {
    render(
      <BrowserRouter>
        <Products />
      </BrowserRouter>
    );

    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Test Product 1")).toBeInTheDocument();
      expect(screen.getByText("Test Product 2")).toBeInTheDocument();
    });
  });

  it("filters products by search", async () => {
    const user = userEvent.setup();

    render(
      <BrowserRouter>
        <Products />
      </BrowserRouter>
    );

    const searchInput = screen.getByPlaceholderText(/search/i);
    await user.type(searchInput, "Product 1");

    await waitFor(() => {
      expect(screen.getByText("Test Product 1")).toBeInTheDocument();
      expect(screen.queryByText("Test Product 2")).not.toBeInTheDocument();
    });
  });
});
```

---

## Best Practices

### DO's ✅

1. **Write descriptive test names** - Test names should clearly describe what is being tested
2. **Test user behavior, not implementation** - Focus on what users see and do
3. **Use data-testid sparingly** - Prefer accessible queries (getByRole, getByLabelText)
4. **Mock external dependencies** - API calls, third-party libraries
5. **Test edge cases** - Empty states, error states, loading states
6. **Keep tests isolated** - Each test should be independent
7. **Use beforeEach for setup** - Reset state between tests
8. **Test accessibility** - Ensure components are accessible

### DON'Ts ❌

1. **Don't test implementation details** - Avoid testing internal state or methods
2. **Don't test third-party libraries** - Trust that they work
3. **Don't write overly complex tests** - Keep tests simple and focused
4. **Don't skip cleanup** - Always clean up after tests
5. **Don't ignore warnings** - Fix console warnings in tests
6. **Don't hardcode test data** - Use factories or fixtures
7. **Don't test everything** - Focus on critical paths and edge cases

---

## Continuous Integration

### GitHub Actions Example

Create `.github/workflows/test.yml`:

```yaml
name: Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: "20"
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm run test:run

      - name: Generate coverage
        run: npm run test:coverage

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/coverage-final.json
```

---

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [MSW Documentation](https://mswjs.io/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

---

## Current Test Coverage Status

> **Note:** Tests are not yet implemented. This document serves as a guide for setting up and writing tests.

### Priority Test Areas

1. **Authentication Flow** (High Priority)

   - Login/Register forms
   - Google OAuth
   - Token refresh
   - Protected routes

2. **Shopping Cart** (High Priority)

   - Add/remove items
   - Update quantities
   - Cart persistence
   - Total calculation

3. **Checkout Process** (High Priority)

   - Address selection
   - Payment method selection
   - Order creation
   - Payment verification

4. **Product Management** (Medium Priority)

   - Product listing
   - Search and filters
   - Product details
   - Stock validation

5. **Admin Panel** (Medium Priority)
   - User management
   - Product CRUD
   - Order management
   - Dashboard analytics

---

## Getting Started with Testing

1. Install testing dependencies:

   ```bash
   npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom msw
   ```

2. Create `vitest.config.js` and `src/test/setup.js` as shown above

3. Add test scripts to `package.json`

4. Start with simple component tests

5. Gradually add integration and E2E tests

6. Aim for 80%+ coverage on critical paths

---

**Happy Testing! 🧪**
