# The Burgess Principle — Reasonable Adjustment Companion

This project is licensed under the MIT License with additional terms for "The Burgess Principle" content. See the [LICENSE](LICENSE) file for full details.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

> An AI-powered advocacy companion that helps people assert their right to reasonable adjustments. Empowering individuals — especially those with hidden disabilities — to have confident, informed conversations with employers, service providers, and institutions.

---

## ✨ What Is This?

The **Reasonable Adjustment Companion** is a web application built around [The Burgess Principle](https://theburgessprinciple.co.uk/) — the idea that every person deserves individual consideration for reasonable adjustments without needing to disclose a disability diagnosis.

**UK Certification Mark:** Registration #UK00004343685

---

## 🚀 Features

- **Guided onboarding** — Step-by-step setup capturing your name, adjustment type, country, and context
- **31+ predefined adjustments** — ADHD, anxiety, autism, chronic pain, mobility impairments, and more
- **21 supported countries** — Country-specific legal references (e.g. Equality Act 2010 for UK, ADA for US)
- **AI Co-Pilot** — Context-aware message generation grounded in The Burgess Principle
- **Staff display mode** — Full-screen, large-text view optimised for showing messages to staff
- **Tone adjustment** — Make messages firmer or more polite with a single tap
- **Conversation history** — Auto-saved conversations with timestamps and full transcript access
- **PDF export** — Export conversation logs as formatted PDF documents
- **Email & clipboard** — Copy messages for email or reference
- **Privacy-first** — All data stored locally in your browser — no server-side tracking

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18 · TypeScript · Vite |
| **Styling** | Tailwind CSS · shadcn/ui · Radix UI |
| **Routing** | React Router |
| **Forms** | React Hook Form · Zod |
| **State** | TanStack React Query |
| **Backend** | Supabase Edge Functions (Deno) |
| **AI** | Google Gemini via Lovable AI Gateway |
| **Storage** | Browser LocalStorage |
| **Testing** | Vitest · Playwright · Testing Library |

---

## 📦 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- [npm](https://www.npmjs.com/) or [Bun](https://bun.sh/)

### Installation

```bash
# Clone the repository
git clone https://github.com/ljbudgie/advocate-companion.git
cd advocate-companion

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at `http://localhost:8080`.

### Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview the production build |
| `npm run lint` | Run ESLint |
| `npm run test` | Run unit tests |
| `npm run test:watch` | Run tests in watch mode |

---

## 🗂️ Project Structure

```
src/
├── pages/              # Route pages (Index, About, NotFound)
├── components/         # React components
│   ├── ui/             # shadcn/ui primitives
│   ├── OnboardingScreen.tsx
│   ├── ConversationView.tsx
│   ├── ConversationHistory.tsx
│   └── StaffDisplay.tsx
├── hooks/              # Custom React hooks
├── types/              # TypeScript type definitions
├── integrations/       # Supabase client and types
└── lib/                # Utility functions
supabase/
└── functions/          # Supabase Edge Functions
    └── burgess-copilot/  # AI response generation
```

---

## 🤝 Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on how to get involved.

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgements

- [The Burgess Principle](https://theburgessprinciple.co.uk/) — the foundation behind this project
- [shadcn/ui](https://ui.shadcn.com/) — beautiful, accessible UI components
- [Supabase](https://supabase.com/) — open-source backend infrastructure
- [Lovable](https://lovable.dev/) — AI-powered development platform