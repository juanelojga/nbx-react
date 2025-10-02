# PROJECT.md

## Project Overview

This is a frontend application for a package handling company that connects to an existing Django backend using GraphQL (Graphene). Built with Next.js (latest version) and TypeScript, it provides interfaces for both administrative users and clients to manage package operations.

## User Types

### 1. Admin Users

Full system access for managing packages, users, and system operations.

### 2. Client Users

Limited access to view and manage their own packages.

## Tech Stack

- **Frontend**: Next.js (App Router), TypeScript, React
- **Styling**: [TBD - will be decided in design setup]
- **State Management**: React Context / [TBD]
- **API**: GraphQL (Apollo Client or urql - to be decided)
- **Backend**: Django + Graphene (existing)

## Core Features (To Be Implemented)

### For Clients:

- User authentication (login/logout)
- Dashboard with package overview
- Track packages by tracking number
- View list of all their packages
- Create new shipment requests
- View package details and history

### For Admins:

- Admin dashboard with system metrics
- Manage all packages in the system
- User management (view, create, edit clients)
- Package status updates
- Reports and analytics
- System settings

## Project Structure

```
/src
  /app          # Next.js App Router pages
  /components   # Reusable React components
  /lib          # Utilities and configurations
  /types        # TypeScript type definitions
  /graphql      # GraphQL queries and mutations
  /hooks        # Custom React hooks
  /contexts     # React Context providers
```

## Development Guidelines

- Follow TypeScript strict mode
- Use ESLint and Prettier configurations
- Write clean, maintainable code
- Add comments for complex logic
- Follow Next.js best practices

## Getting Started

[Leave placeholder for setup instructions - will be filled as we build]

## Environment Variables

Required environment variables:

- `NEXT_PUBLIC_GRAPHQL_API_URL`: GraphQL endpoint
- [Others to be added as needed]
