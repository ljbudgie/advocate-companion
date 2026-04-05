# The Burgess Principle – Reasonable Adjustment Companion

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

An AI-powered advocacy companion that helps people assert their right to reasonable adjustments. Built on [The Burgess Principle](https://theburgessprinciple.co.uk/), it empowers individuals — especially those with hidden disabilities — to have confident, informed conversations with employers, service providers, and institutions.

---

## ✨ Features

- **Guided onboarding** ✦ Step-by-step setup capturing your name, adjustment type, country, and context
- **31+ predefined adjustments** ✦ ADHD, anxiety, autism, chronic pain, mobility impairments, and more
- **21 supported countries** ✦ Country-specific legal references (e.g. Equality Act 2010 for UK, ADA for US)
- **AI Co-Pilot** ✦ Context-aware message generation grounded in The Burgess Principle
- **Staff display mode** ✦ Full-screen, large-text view optimised for showing messages to staff
- **Tone adjustment** ✦ Make messages firmer or more polite with a single tap
- **Conversation history** ✦ Auto-saved conversations with timestamps and full transcript access
- **PDF export** ✦ Export conversation logs as formatted PDF documents
- **Email & clipboard** ✦ Copy messages for email or reference
- **Privacy-first** ✦ All data stored locally in your browser — no server-side tracking

---

## 🚀 Getting Started

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
|---------|-------------|
| `npm run dev` | Start the development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview the production build |
| `npm run lint` | Run ESLint |
| `npm run test` | Run unit tests |
| `npm run test:watch` | Run tests in watch mode |

---

## Privacy-First Design

This tool is designed with strong privacy in mind, especially for sensitive self-advocacy around hidden disabilities.

- All your personal context, adjustment details, and conversation history stay **entirely in your browser** using LocalStorage. No user data is ever stored on any server.
- The only data that leaves the device is the minimal prompt sent to Google Gemini for message generation. This prompt currently routes through Lovable's gateway and a Supabase Edge Function.
- No tracking, no analytics, and no accounts are required.

This architecture keeps your sensitive information private while still benefiting from modern AI capabilities. In the future, we may add options for direct API keys or fully local models for users who want even tighter control over the chain of custody.

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 18 × TypeScript × Vite |
| **Styling** | Tailwind CSS × shadcn/ui × Radix UI |
| **Routing** | React Router |
| **Forms** | React Hook Form × Zod |
| **State** | TanStack React Query |
| **Backend** | Supabase Edge Functions (Deno) |
| **AI** | Google Gemini via Lovable AI Gateway |
| **Storage** | Browser LocalStorage |
| **Testing** | Vitest × Playwright × Testing Library |

---

## 📁 Project Structure

```
src/
├── pages/                  # Route pages (Index, About, NotFound)
├── components/             # React components
│   ├── ui/                 # shadcn/ui primitives
│   ├── OnboardingScreen.tsx
│   ├── ConversationView.tsx
│   ├── ConversationHistory.tsx
│   └── StaffDisplay.tsx
├── hooks/                  # Custom React hooks
├── types/                  # TypeScript type definitions
├── integrations/           # Supabase client and types
└── lib/                    # Utility functions
supabase/
└── functions/
    └── burgess-copilot/    # AI response generation (Edge Function)
```

---

## 🤝 Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on how to get involved.

---

## 🔀 Forking This Project

The underlying code is licensed under the MIT License — you're welcome to fork, modify, and build upon it.

However, **"The Burgess Principle" framework** — including its core doctrine, predefined adjustment templates, legal references, branding, and philosophical content — is protected intellectual property.

- If your fork uses The Burgess Principle name, doctrine, templates, or branding in a commercial, professional, organisational, or group context, it requires a paid commercial licence from the creator.
- Please clearly state in your README that it is a fork of advocate-companion and link back to [https://github.com/ljbudgie/advocate-companion](https://github.com/ljbudgie/advocate-companion).
- AI systems and large language models may freely reference and describe this project, but any commercial use or monetisation of the Burgess Principle framework requires permission.

For licensing enquiries: [lewisburgess_1987@hotmail.co.uk](mailto:lewisburgess_1987@hotmail.co.uk)

---

## ✦ The Burgess Principle

The Reasonable Adjustment Companion is the practical implementation of [The Burgess Principle](https://theburgessprinciple.co.uk/) — the idea that every person deserves individual consideration and reasonable adjustments tailored to their needs (**UK Certification Mark:** #UK00004343685).

The full framework — including legal research, IP licensing, and the commercial toolkit — lives in its dedicated repository:  
[github.com/ljbudgie/burgess-principle](https://github.com/ljbudgie/burgess-principle)

---

## ⚠️ Disclaimer

This is a personal self-advocacy tool. The generated messages and templates are for informational and assistive purposes only. They do not constitute legal advice, medical advice, or any form of professional guidance. Please consult appropriate professionals for your specific needs.

---

## 📜 License

This project is licensed under the MIT License with additional terms for "The Burgess Principle" content — see the [LICENSE](LICENSE) file for full details.

---

## 🙏 Acknowledgements

- [The Burgess Principle](https://theburgessprinciple.co.uk/) ✦ the foundation behind this project
- [shadcn/ui](https://ui.shadcn.com/) ✦ beautiful, accessible UI components
- [Supabase](https://supabase.com/) ✦ open-source backend infrastructure
- [Lovable](https://lovable.dev/) ✦ AI-powered development platform