# solostudy

This project was created with [Better-T-Stack](https://github.com/AmanVarshney01/create-better-t-stack), a modern TypeScript stack that combines Next.js, Next, TRPC, and more.

## Features

- **TypeScript** - For type safety and improved developer experience
- **Next.js** - Full-stack React framework
- **TailwindCSS** - Utility-first CSS for rapid UI development
- **shadcn/ui** - Reusable UI components
- **Next.js** - Full-stack React framework
- **tRPC** - End-to-end type-safe APIs
- **Node.js** - Runtime environment
- **Drizzle** - TypeScript-first ORM
- **PostgreSQL** - Database engine
- **Authentication** - Email & password authentication with Better Auth
- **Passkey Support** - WebAuthn-based passwordless authentication
- **Turborepo** - Optimized monorepo build system

## Getting Started

First, install the dependencies:

```bash
pnpm install
```

## Database Setup

This project uses PostgreSQL with Drizzle ORM.

1. Make sure you have a PostgreSQL database set up.
2. Create your `apps/server/.env` file with your configuration:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/solostudy"

# Better Auth
BETTER_AUTH_SECRET="your-secret-key-here"
BETTER_AUTH_URL="http://localhost:3001"

# CORS
CORS_ORIGIN="http://localhost:3000"

# Passkey Configuration (for production, update these)
PASSKEY_RP_ID="localhost"
PASSKEY_RP_NAME="SoloStudy"
PASSKEY_ORIGIN="http://localhost:3001"
```

3. Apply the schema to your database:

```bash
pnpm db:push
```

Then, run the development server:

```bash
pnpm dev
```

Open [http://localhost:3001](http://localhost:3001) in your browser to see the web application.
The API is running at [http://localhost:3000](http://localhost:3000).

## Project Structure

```
solostudy/
├── apps/
│   ├── web/         # Frontend application (Next.js)
│   └── server/      # Backend API (Next, TRPC)
```

## Available Scripts

- `pnpm dev`: Start all applications in development mode
- `pnpm build`: Build all applications
- `pnpm dev:web`: Start only the web application
- `pnpm dev:server`: Start only the server
- `pnpm check-types`: Check TypeScript types across all apps
- `pnpm db:push`: Push schema changes to database
- `pnpm db:studio`: Open database studio UI

## Authentication Features

This project includes comprehensive authentication with:

### Email & Password Authentication

- User registration and login
- Secure password handling
- Session management

### Passkey Authentication (WebAuthn)

- Passwordless authentication using biometrics, security keys, or device authentication
- Conditional UI support for seamless passkey selection
- Cross-platform compatibility (iOS Face ID/Touch ID, Android fingerprint, Windows Hello, etc.)
- Users can add multiple passkeys to their account
- Optional passkey registration during signup
- Fallback to email/password when passkeys aren't available

### Usage

1. **Sign Up**: Create an account with email/password, optionally add a passkey
2. **Sign In**: Use email/password or passkey authentication
3. **Manage Passkeys**: Add, rename, or remove passkeys from your account (future feature)
