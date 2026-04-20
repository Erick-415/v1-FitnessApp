# EazyFitness

Two-sided fitness coaching app — trainer portal + client portal.

## Stack

- **React Native + Expo 52** (TypeScript strict)
- **Expo Router v4** (file-based routing)
- **Supabase** (Postgres, Auth, Storage, Realtime, Edge Functions)
- **RevenueCat + Stripe** (subscriptions)
- **Mux** (video)
- **Anthropic Claude API** (AI features via Edge Functions)
- **Zustand** (client state) + **TanStack Query** (server state)
- **React Hook Form + Zod** (forms)
- **pnpm workspaces** (monorepo)

## Project Structure

```
apps/client     → Client-facing app (workouts, nutrition, progress, messages)
apps/trainer    → Trainer app (clients, programs, messages, form review)
packages/shared → Supabase client, auth context, shared types
packages/config → ESLint, Prettier, TypeScript base configs
supabase/       → Migrations, Edge Functions
```

## Setup

### Prerequisites

- Node.js ≥ 20
- pnpm ≥ 9 (`npm i -g pnpm`)
- Expo CLI (`npm i -g expo-cli`)
- Supabase CLI (`brew install supabase/tap/supabase`)

### 1. Install dependencies

```bash
pnpm install
```

### 2. Environment variables

```bash
cp apps/client/.env.example apps/client/.env
cp apps/trainer/.env.example apps/trainer/.env
```

Fill in your Supabase URL and anon key from the Supabase dashboard.

### 3. Start local Supabase

```bash
supabase start
supabase db reset   # runs migrations
```

### 4. Generate Supabase types

```bash
supabase gen types typescript --local > packages/shared/src/types/database.types.ts
```

### 5. Run the apps

```bash
# Client app
pnpm client

# Trainer app
pnpm trainer
```

## Auth Flow

- Email/password on iOS + Android
- Sign in with Apple on iOS only
- Sessions persisted in `expo-secure-store`
- `profiles.role` determines app access — wrong role is signed out immediately

## Environment Variables

| Variable | Where |
|---|---|
| `EXPO_PUBLIC_SUPABASE_URL` | `.env` in each app |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | `.env` in each app |
| Supabase service role key | Supabase secrets only |
| RevenueCat API keys | EAS secrets |
| Anthropic API key | Supabase Edge Function secrets |

**Never commit `.env` files or secrets.**
