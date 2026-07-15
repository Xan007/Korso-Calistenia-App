<p align="center">
  <img src="assets/Icon.png" alt="Korso" width="120" height="120" />
</p>

<h1 align="center">Korso</h1>

<p align="center">
  Mobile platform for university calisthenics adherence
</p>

<p align="center">
  <a href="https://nodejs.org/"><img src="https://img.shields.io/badge/Node.js-18%2B-339933?logo=node.js&logoColor=white" alt="Node.js" /></a>
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white" alt="TypeScript" /></a>
  <a href="https://pnpm.io/"><img src="https://img.shields.io/badge/pnpm-9.0-F69220?logo=pnpm&logoColor=white" alt="pnpm" /></a>
  <a href="https://nestjs.com/"><img src="https://img.shields.io/badge/NestJS-11-E0234E?logo=nestjs&logoColor=white" alt="NestJS" /></a>
  <a href="https://expo.dev/"><img src="https://img.shields.io/badge/Expo-57-000020?logo=expo&logoColor=white" alt="Expo" /></a>
  <a href="https://www.prisma.io/"><img src="https://img.shields.io/badge/Prisma-5.10-2D3748?logo=prisma&logoColor=white" alt="Prisma" /></a>
  <a href="https://www.postgresql.org/"><img src="https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white" alt="PostgreSQL" /></a>
  <img src="https://img.shields.io/badge/License-UNLICENSED-red" alt="License" />
</p>

---

## Table of Contents

- [About](#about)
- [Tech Stack](#tech-stack)
- [Repository Structure](#repository-structure)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [API](#api)
- [Mobile](#mobile)
- [Database](#database)
- [Acknowledgments](#acknowledgments)

---

## About

Korso is a mobile platform designed to improve adherence to university calisthenics practice. The project adapts to the academic calendar, reducing friction during exam periods and supporting habit formation through attendance tracking, streaks, and social features.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Mobile | React Native, Expo SDK 57 |
| Backend | NestJS 11 |
| Database | PostgreSQL 16 (Neon in production, Docker in development) |
| ORM | Prisma 5 |
| Auth | JWT + Google OAuth |
| Push Notifications | Firebase Cloud Messaging |
| Monorepo | pnpm workspaces |

---

## Repository Structure

```
korso/
├── apps/
│   ├── api/          NestJS backend
│   └── mobile/       Expo / React Native app
├── packages/
│   └── shared/       Shared types and schemas
├── assets/           Logo and media for documentation
├── docker-compose.yml
├── pnpm-workspace.yaml
└── package.json
```

---

## Prerequisites

- Node.js 18 or higher
- pnpm 9 or higher
- Docker (for local PostgreSQL)
- Git

Install pnpm globally if you haven't:

```bash
npm install -g pnpm
```

---

## Getting Started

1. Clone the repository:

```bash
git clone https://github.com/YOUR_USERNAME/korso.git
cd korso
```

2. Install dependencies:

```bash
pnpm install
```

3. Set up environment variables:

```bash
cp apps/api/.env.example apps/api/.env
cp apps/mobile/.env.example apps/mobile/.env
```

4. Start the local database:

```bash
pnpm docker:up
```

5. Generate the Prisma client and push the schema:

```bash
cd apps/api
pnpm db:generate
pnpm db:push
```

6. Start the development servers:

```bash
# From the root directory
pnpm dev
```

This will start both the API and the mobile app concurrently.

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start API and mobile concurrently |
| `pnpm dev:api` | Start API only |
| `pnpm dev:mobile` | Start mobile only |
| `pnpm build` | Build all workspaces |
| `pnpm lint` | Lint all workspaces |
| `pnpm typecheck` | Type-check all workspaces |
| `pnpm docker:up` | Start PostgreSQL container |
| `pnpm docker:down` | Stop PostgreSQL container |

---

## API

The API is built with NestJS and follows a hybrid architecture (domain-based modules with internal layering).

Location: `apps/api/`

| Command | Description |
|---------|-------------|
| `pnpm start:dev` | Start in watch mode |
| `pnpm start:prod` | Start in production mode |
| `pnpm test` | Run unit tests |
| `pnpm test:e2e` | Run e2e tests |
| `pnpm db:generate` | Generate Prisma client |
| `pnpm db:push` | Push schema to database |
| `pnpm db:seed` | Seed the database |

Default port: `3000`

---

## Mobile

The mobile app is built with React Native and Expo. It follows a feature-based architecture.

Location: `apps/mobile/`

| Command | Description |
|---------|-------------|
| `pnpm start` | Start Expo dev server |
| `pnpm android` | Start on Android emulator |
| `pnpm ios` | Start on iOS simulator |
| `pnpm web` | Start on web |

---

## Database

The project uses PostgreSQL 16 with Prisma as the ORM.

- **Development**: Docker container via `docker-compose.yml`
- **Production**: Neon serverless PostgreSQL

The Prisma schema is located at `apps/api/prisma/schema.prisma`.

To modify the database schema:

```bash
cd apps/api
pnpm prisma:migrate
```

---