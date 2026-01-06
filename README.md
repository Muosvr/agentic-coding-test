# Todo List App

A simple, elegant todo list application built with Next.js, TypeScript, and Tailwind CSS.

## Features

- ✅ Add new todos
- ✅ Mark todos as complete/incomplete
- ✅ Delete todos
- ✅ View todo statistics (total, completed, active)
- ✅ Responsive design
- ✅ Beautiful UI with Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Testing

This app includes comprehensive browser automation tests using Playwright.

### Run Tests

```bash
# Install browsers first (one time)
npx playwright install chromium

# Run tests
npm test

# Run tests with visible browser
npm run test:headed

# Run tests in interactive UI mode
npm run test:ui
```

See [TESTING.md](TESTING.md) for detailed testing documentation.

## Deployment to Vercel

### Option 1: Deploy via Vercel CLI

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
vercel
```

### Option 2: Deploy via Vercel Dashboard

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your repository
5. Vercel will auto-detect Next.js and configure the build settings
6. Click "Deploy"

### Option 3: Deploy with One Click

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/todo-app)

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Testing:** Playwright (Browser Automation)
- **Deployment:** Vercel

## Project Structure

```
├── app/
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Main todo list page
│   └── globals.css          # Global styles
├── tests/
│   └── todo.spec.ts         # Playwright test suite
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── playwright.config.ts     # Playwright configuration
├── next.config.js
└── TESTING.md               # Testing documentation
```

## License

MIT