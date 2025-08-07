# Carthus Project Guide

## 1. Project Overview

Carthus, also known as "Elijeweb," is an AI-powered sales assistant designed to streamline e-commerce operations for businesses leveraging Meta platforms (Facebook, Instagram). It automates customer interactions, manages orders, tracks stock levels, and provides sales analytics through a user-friendly dashboard. The application aims to enhance efficiency, prevent missed sales, and reduce manual chaos, particularly catering to the Tunisian market with support for local languages like Tounsi.

## 2. Key Technologies & Dependencies

The project is built on a modern web stack, primarily utilizing:

*   **Languages**: TypeScript, JavaScript
*   **Frontend Framework**: Next.js (with App Router), React
*   **Authentication**: NextAuth.js (with Credentials Provider and Prisma Adapter)
*   **Database ORM**: Prisma
*   **Styling**: Tailwind CSS (inferred from extensive utility class usage)
*   **Password Hashing**: bcrypt
*   **Database**: PostgreSQL (common choice for Prisma, inferred)
*   **Fonts**: Google Fonts (Inter, Roboto Mono)

## 3. File Structure Analysis

The project follows a standard Next.js App Router structure, organizing code logically:

*   **`app/`**: This is the core Next.js App Router directory.
    *   **`app/api/`**: Contains all backend API routes.
        *   `app/api/auth/`: Handles user authentication (login, registration, NextAuth.js callbacks).
        *   `app/api/conversations/`: Manages customer conversations and messages.
        *   `app/api/dashboard/`: Provides aggregated sales, stock, and key metric data for the dashboard.
        *   `app/api/orders/`: Manages order creation, retrieval, updates, and deletion.
        *   `app/api/products/`: Handles product and product variant management.
    *   **`app/[feature]/page.tsx`**: Represents individual pages or features of the application accessible via routes (e.g., `/dashboard`, `/login`, `/register`, `/reset-password`).
    *   **`app/layout.tsx`**: The root layout component, responsible for defining the overall page structure, including global styles, font imports, and wrapping the application with shared components like `Header`, `Footer`, and `Providers`.
    *   **`app/page.tsx`**: The main landing page or homepage of the application.
*   **`components/`**: Houses reusable React UI components that are shared across different pages or layouts.
    *   `components/Footer.tsx`: The application's footer component.
    *   `components/Header.tsx`: The application's header, including navigation, dark mode toggle, and authentication status.
    *   `components/Providers.tsx`: A wrapper component that provides global contexts, specifically `SessionProvider` for NextAuth.js.
*   **`lib/`**: Contains utility functions, configurations, and shared logic.
    *   `lib/auth.ts`: Configuration for NextAuth.js, defining authentication providers and callbacks.
    *   `lib/prisma.ts`: Initializes and exports the Prisma client instance for database interactions.

## 4. Setup & Build Instructions

To set up and run the Carthus project locally:

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd carthus-project
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    # or yarn install
    ```
3.  **Configure Environment Variables:**
    Create a `.env` file in the project root and add the following:
    ```env
    DATABASE_URL="postgresql://user:password@host:port/database?schema=public"
    NEXTAUTH_SECRET="YOUR_VERY_LONG_RANDOM_SECRET_STRING" # Generate a strong, random string
    NEXTAUTH_URL="http://localhost:3000" # Or your deployment URL
    ```
    *   Replace `DATABASE_URL` with your PostgreSQL database connection string.
    *   Generate a strong `NEXTAUTH_SECRET` (e.g., using `openssl rand -base64 32`).
4.  **Run Prisma Migrations:**
    This will create the necessary database schema based on your Prisma schema.
    ```bash
    npx prisma migrate dev --name init
    ```
    (The `init` name is a suggestion; you can choose any descriptive name.)
5.  **Generate Prisma Client:**
    This command generates the Prisma client based on your schema, allowing TypeScript to recognize your models. It's often run automatically by `prisma migrate dev` or a `postinstall` script, but can be run manually if needed.
    ```bash
    npx prisma generate
    ```
6.  **Start the Development Server:**
    ```bash
    npm run dev
    # or yarn dev
    ```
    The application will be accessible at `http://localhost:3000`.
7.  **Build for Production:**
    ```bash
    npm run build
    # or yarn build
    ```
8.  **Start Production Server (after building):**
    ```bash
    npm run start
    # or yarn start
    ```

## 5. Proposed CI/CD Pipeline

A simple CI/CD pipeline using GitHub Actions can ensure code quality, build integrity, and automate deployment.

```yaml
name: Carthus CI/CD Pipeline

on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18' # Use a specific Node.js version compatible with Next.js

      - name: Install dependencies
        run: npm ci # Use npm ci for clean installs in CI environments

      - name: Lint code
        run: npm run lint # Assumes a 'lint' script in package.json (e.g., eslint)

      - name: Run tests
        run: npm test # Assumes a 'test' script in package.json (e.g., Jest, React Testing Library)
        # Add a placeholder for now, actual tests need to be written

      - name: Build project
        run: npm run build
        env:
          # These are required for Prisma client generation and Next.js build process
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
          NEXTAUTH_SECRET: ${{ secrets.NEXTAUTH_SECRET }}

      # Optional: Deploy to Vercel (example)
      # - name: Deploy to Vercel
      #   if: github.ref == 'refs/heads/main'
      #   uses: amondnet/vercel-action@v20
      #   with:
      #     vercel-token: ${{ secrets.VERCEL_TOKEN }}
      #     vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
      #     vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
      #     vercel-args: '--prod' # Deploy to production alias
```

## 6. Architecture Diagram

```mermaid
graph TD
    A[User] --> B(Next.js Frontend);
    B -- API Calls --> C{Next.js API Routes};
    C -- Authentication --> D[NextAuth.js];
    C -- Data Operations --> E[Prisma ORM];
    E --> F[Database (PostgreSQL)];
    D --> F;
```

## 7. Potential Improvements

1.  **Implement Comprehensive Testing**: Introduce a robust testing suite covering unit tests for utility functions and components, integration tests for API routes and database interactions, and end-to-end tests for critical user flows. This will significantly improve code reliability, prevent regressions, and facilitate future development.
2.  **Enhance API Input Validation and Error Handling**: While basic checks are present, implement a dedicated schema validation library (e.g., Zod, Joi) for all incoming API request bodies and query parameters. Additionally, refine error responses to be more specific and user-friendly, and integrate a centralized logging solution (e.g., Winston, Pino, or a cloud-based service like Sentry) for better observability and debugging in production.
3.  **Introduce Rate Limiting and Security Hardening**: Implement rate limiting on authentication endpoints (login, register) and other critical APIs to prevent brute-force attacks and abuse. Review and apply common security best practices for Next.js applications, such as proper CORS configuration, secure cookie handling, and protection against common web vulnerabilities (XSS, CSRF).