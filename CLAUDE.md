# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Important: Next.js Version Notice

This project uses **Next.js 16.2.6** — a version with breaking changes from what training data reflects. Read `node_modules/next/dist/docs/` before writing any Next.js-specific code. Heed deprecation notices (e.g., `middleware` file convention is deprecated in favor of `proxy`).

## Commands

```bash
npm run dev       # Start development server (localhost:3000)
npm run build     # Production build
npm run start     # Start production server
npm run lint      # ESLint
npx tsc --noEmit  # Type check without building
```

## Architecture Overview

### Routing & i18n
- All public pages live under `app/[locale]/` — default locale is `id` (Indonesian), second locale is `en`
- `/` redirects to `/id` via `app/page.tsx`
- `middleware.ts` handles two concerns: locale detection (via next-intl) for public routes, and cookie-based auth guard for `/admin/*` routes
- Navigation helpers (`Link`, `useRouter`, `usePathname`) must be imported from `@/lib/i18n/navigation`, not from `next/link` or `next/navigation`, so locale is automatically prepended

### Translation
- All UI strings live in `messages/id.json` and `messages/en.json`
- Server components use `getTranslations()`, client components use `useTranslations()`
- Array/object data in translations (services list, FAQ items, etc.) is retrieved with `t.raw('key')` and cast to the expected type

### Supabase
- `lib/supabase/client.ts` — browser client (for client components and `'use client'` hooks)
- `lib/supabase/server.ts` — server client with cookie handling (`createClient`) and a service-role bypass client (`createAdminClient`) used in API routes that need to skip RLS

### AI (NVIDIA NIM)
- `lib/nvidia.ts` exports `nvidia` (OpenAI-compatible client pointed at `https://integrate.api.nvidia.com/v1`) and `MODELS` constants
- Three models: `chatbot` (llama-3.1-70b), `blogGen` (nemotron-70b), `translate` (llama-3.1-8b)
- `app/api/chat/route.ts` streams responses as SSE with an in-memory rate limiter (30 req/IP/hour)

### UI Component Quirks

**Button (`components/ui/button.tsx`)** — The default shadcn init installed a `@base-ui/react` button that doesn't support `asChild`. This was replaced with a custom Radix Slot-based button. Always use `asChild` from this file — do not reinstall the shadcn button via `npx shadcn add button`.

**Sheet (`components/ui/sheet.tsx`)** — Built on `@base-ui/react/dialog`. Its `SheetTrigger` does **not** support `asChild`. Render the trigger element directly as a child (plain HTML/className) instead of wrapping a `<Button asChild>`.

**Social icons** — `lucide-react` does not export Instagram, LinkedIn, Twitter, or GitHub icons in this version. These are implemented as inline SVG components in `components/common/Footer.tsx`.

### Framer Motion
- All animated components require `'use client'` at the top
- When using `variants`, avoid function-valued variant keys (`show: (i) => ...`) — they cause TS errors. Pass `transition` as a prop directly on `<motion.*>` instead

### Admin Panel
- Lives at `/admin/*` — no locale prefix
- Auth is checked in `middleware.ts` by looking for a Supabase session cookie containing `auth-token`
- The admin layout (`app/admin/layout.tsx`) hardcodes `locale: 'id'` for `NextIntlClientProvider`
- There is no public registration — admin accounts are created manually in Supabase dashboard

### Static GEO Files
- `public/llms.txt` (English) and `public/llms-id.txt` (Indonesian) — AI crawler discovery files
- `public/robots.txt` — explicitly allows GPTBot, Claude-Web, PerplexityBot

## Environment Variables

Required in `.env.local`:

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public anon key (safe to expose) |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key — only used server-side in `createAdminClient()` |
| `NVIDIA_API_KEY` | NVIDIA NIM API key (`nvapi-...`) |
| `RESEND_API_KEY` | Resend email API key |
| `RESEND_FROM_EMAIL` | Sender address (must be verified domain in Resend) |
| `RESEND_TO_EMAIL` | Recipient for contact form notifications |
| `NEXT_PUBLIC_APP_URL` | Full URL (e.g. `https://teridox.com`) used in email templates |

## IMPORTANT
- ALWAYS USE CONTEXT7 BEFORE MAKE ANY CHANGE
- ALWAYS USE SKILLS BEFORE MAKE ANY CHANGE
- ALWAYS DO GIT ADD, GIT COMMIT, AND GIT PUSH AFTER MAKE CHANGE
- NEVER PUT SENSITIVE DATA ON THE FRONT END AND GITHUB
- Always create a new branch and commit and then push to the new branch if you create a new feature or major change, create a new branch for the feature or major change, move it to the main branch if I have instructed you to do so.
- If you only make small changes or small bugs, just commit and push to the main branch without having to wait for my command.
