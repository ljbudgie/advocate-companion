# The Burgess Principle — Reasonable Adjustment Companion

> ⚠️ **Important**  
> This is a personal self-advocacy tool grounded in The Burgess Principle. The generated messages and templates are for informational and assistive purposes only. They do not constitute legal advic[...]  

This project is licensed under the MIT License with additional terms for "The Burgess Principle" content. See the [LICENSE](LICENSE) file for full details.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

> An AI-powered advocacy companion that helps people assert their right to reasonable adjustments. Empowering individuals — especially those with hidden disabilities — to have confident, infor[...]  

---

## ✨ What Is This?

The **Reasonable Adjustment Companion** is a web application built around [The Burgess Principle](https://theburgessprinciple.co.uk/) — the idea that every person deserves individual considerati[...]  

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

## If You Fork This Project

The underlying code for this project is licensed under the MIT License, and you're welcome to fork, modify, and build upon it for your own purposes.

However, "The Burgess Principle" framework — including its core doctrine, predefined adjustment templates, legal references, branding, and philosophical content — is protected intellectual pr[...]  

If your fork uses The Burgess Principle name, doctrine, templates, or branding in a commercial, professional, organisational, or group context, it requires a paid commercial licence from the crea[...]  

When forking, please clearly state in your README that it is a fork of advocate-companion and link back to the original repository at https://github.com/ljbudgie/advocate-companion.

For licensing enquiries or commercial use of the framework, contact: lewisburgess_1987@hotmail.co.uk

---

## The Burgess Principle

The Reasonable Adjustment Companion is the practical "hands" — a simple, privacy-first tool that helps individuals request reasonable adjustments with confidence.

The full **Burgess Principle** — including the complete legal research, IP licensing framework, Certification Mark regulations (UK00004343685), and commercial toolkit — lives in its dedicated repository:

→ [github.com/ljbudgie/burgess-principle](https://github.com/ljbudgie/burgess-principle)

For commercial licensing enquiries, please contact: lewisburgess_1987@hotmail.co.uk

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgements

- [The Burgess Principle](https://theburgessprinciple.co.uk/) — the foundation behind this project
- [shadcn/ui](https://ui.shadcn.com/) — beautiful, accessible UI components
- [Supabase](https://supabase.com/) — open-source backend infrastructure
- [Lovable](https://lovable.dev/) — AI-powered development platform.