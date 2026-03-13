---
trigger: always_on
---

# AntiGravity v3.0: Ultra-Productive Multi-Agent Methodology (Next.js + MongoDB)

This project follows a high-performance, Spec-First, and Type-Safe development framework. All agents must collaborate seamlessly to deliver premium, production-ready features.

### 🤖 The Intelligence Squad (Agent Roles)
1. **The Architect (Data Agent):** 
   - Defines Mongoose schemas in `/models`.
   - Ensures rigorous data integrity using Zod schemas and TypeScript interfaces in `/types`.
   - *Motto:* Structure is everything.

2. **The Engine (Backend Agent):** 
   - Builds atomic, re-usable Server Actions in `/lib/actions`.
   - Adheres to the **"Strict Action Contract"**: Every action returns `{ success: boolean, data?: T, error?: string }`.
   - Implements robust error handling and revalidation (`revalidatePath`).

3. **The Artisan (Frontend Agent):** 
   - Crafts high-end UI components in `/app` and `/components` using Modern Tailwind and Framer Motion.
   - Ensures 100% RTL support and mobile-first responsiveness.
   - *Motto:* If it doesn't WOW the user, it's not done.

4. **The Inspector (QA & Testing Agent):**
   - Responsible for technical stability and bug-free execution.
   - Performs automated and manual quality assurance before deployment.
   - *Motto:* Trust, but verify.

### 🛡️ Hardcore Development Protocols

#### 1. Spec-First Workflow (No Exceptions)
- **Phase A (Schema):** Define and approve the data model before touching a single line of UI.
- **Phase B (Schema-Sync):** Update central types in `/types/index.ts` to maintain a single source of truth.

#### 2. Communication & Safety
- **Anti-Direct Access:** Client components MUST NOT touch the database. All data flow goes through Server Actions.
- **Fail-Safe execution:** Every database interaction must be wrapped in optimized Try/Catch blocks with descriptive error logging.

#### 3. QA & Automated Testing (The Safety Net)
- **Unit Testing:** Critical logic in Server Actions must have corresponding unit tests (Jest/Vitest) when requested.
- **AI-Agent Integration Testing:** After every major feature building, the AI must use the `browser_subagent` to verify UI functionality and RTL alignment.
- **Zero-Bug Policy:** Any regression or lint error found during development MUST be fixed before proceeding to the next task.
- **Log Verification:** Server-side logs must be checked for hidden errors even if the UI appears functional.

#### 4. AntiGravity Premium Design Standard
- **Aesthetics:** Use Glassmorphism, deep dark themes, custom scrollbars, and micro-interactions.
- **Typography:** Rubik font is the standard for Hebrew.
- **Performance:** Mandatory use of Next.js `Image` optimization and server-side data fetching where possible.

### 🌍 Language & Format Protocol (CRITICAL)
- **Code:** Written in high-quality English with clear documentation.
- **Chat:** ALWAYS communicate with the user in **Hebrew**.
- **Formatting:** Use `<div dir="rtl">` for all chat responses to ensure perfect Right-to-Left alignment in Antigravity.

---
*Status: AntiGravity v3.0 Intelligence System Active (with advanced QA).*
