# Contributing to The Burgess Principle — Reasonable Adjustment Companion

Thank you for your interest in contributing! This project helps people with disabilities assert their right to reasonable adjustments, and every contribution makes a difference.

## How to Contribute

### Reporting Bugs

If you find a bug, please [open an issue](https://github.com/ljbudgie/advocate-companion/issues/new) with:

- A clear, descriptive title
- Steps to reproduce the problem
- Expected vs actual behaviour
- Your browser and OS

### Suggesting Features

Feature ideas are welcome! Please [open an issue](https://github.com/ljbudgie/advocate-companion/issues/new) and describe:

- The problem your feature would solve
- How you envision the solution
- Any alternatives you've considered

### Submitting Changes

1. **Fork** the repository
2. **Create a branch** for your change (`git checkout -b feature/your-feature-name`)
3. **Make your changes** — keep them focused and well-tested
4. **Run checks** before committing:
   ```bash
   npm run lint
   npm run test
   npm run build
   ```
5. **Commit** with a clear message describing your change
6. **Push** your branch and open a **Pull Request**

### Development Setup

```bash
git clone https://github.com/ljbudgie/advocate-companion.git
cd advocate-companion
npm install
npm run dev
```

## Code Guidelines

- Write **TypeScript** — avoid `any` types where possible
- Follow existing code style and formatting
- Use [shadcn/ui](https://ui.shadcn.com/) components for new UI elements
- Keep components small and focused
- Add tests for new functionality

## Code of Conduct

Please be respectful and inclusive in all interactions. This project exists to support accessibility and inclusion — our community should reflect those values.

## Questions?

If you're unsure about anything, feel free to open an issue and ask. We're happy to help!
