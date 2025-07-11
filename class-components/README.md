# React Class Components Project

A project for learning React class components with TypeScript, Tailwind CSS, and modern development tools.

## Description

This is a Pokemon search application built using React class components. The project demonstrates:

- Using React class components (no hooks)
- TypeScript for type safety
- Tailwind CSS for styling
- Error Boundary for error handling
- Local storage for data persistence
- API integration (Pokemon API)
- Modern development tooling (ESLint, Prettier, Husky)

## Technologies

- **React 19** - library for building user interfaces
- **TypeScript** - typed JavaScript
- **Vite** - fast build tool
- **Tailwind CSS** - CSS framework
- **SCSS** - CSS preprocessor
- **ESLint** - code linting tool
- **Prettier** - code formatter
- **Husky** - git hooks

## Installation and Setup

### Requirements

- Node.js >= 20.19.0 (recommended 22.x)
- npm >= 10.0.0

### Install Dependencies

```bash
npm install
```

### Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code with ESLint
npm run lint

# Format code with Prettier
npm run format:fix
```

## Project Structure

```
src/
├── components/          # Components
│   ├── ErrorBoundary.tsx    # Error Boundary
│   ├── ErrorTester.tsx      # Component for testing errors
│   ├── Results.tsx          # Display search results
│   └── Search.tsx           # Search component
├── styles/             # SCSS styles
│   ├── globals.scss         # Global styles with Tailwind
│   ├── _variables.scss      # SCSS variables
│   ├── _mixins.scss         # SCSS mixins
│   ├── _fonts.scss          # Font definitions
│   ├── _common.scss         # Common styles
│   └── _reset.scss          # CSS reset
├── App.tsx             # Main component
├── main.tsx            # Entry point
└── index.css           # CSS entry file
```

## Features

### Class Components

All components in the project are implemented as React class components:

```typescript
class App extends Component<Record<string, never>, AppState> {
  // State and lifecycle methods
}
```

### Error Boundary

The application is wrapped in an Error Boundary to catch errors:

```typescript
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }
}
```

### Local Storage

Search queries are saved to localStorage:

```typescript
// Save
localStorage.setItem('searchTerm', trimmedQuery);

// Load
const savedSearchTerm = localStorage.getItem('searchTerm');
```

### API Integration

The project uses Pokemon API for data fetching:

```typescript
const url = query
  ? `https://pokeapi.co/api/v2/pokemon/${query.toLowerCase()}`
  : 'https://pokeapi.co/api/v2/pokemon?limit=20';
```

## Development Tools Configuration

### ESLint

Configured for strict TypeScript code checking:

```javascript
export default tseslint.config({
  extends: [
    js.configs.recommended,
    ...tseslint.configs.strict,
    eslintPluginPrettier,
  ],
  // ...
});
```

### Prettier

Code formatting with settings:

```json
{
  "trailingComma": "es5",
  "tabWidth": 2,
  "semi": true,
  "singleQuote": true
}
```

### Husky

Pre-commit hook configured for automatic code checking:

```bash
npm run lint
```

### TypeScript

Strict TypeScript configuration with path mapping:

```json
{
  "compilerOptions": {
    "strict": true,
    "baseUrl": "./src",
    "paths": {
      "@/*": ["*"],
      "@/components/*": ["components/*"],
      "@/styles/*": ["styles/*"]
    }
  }
}
```

## Deployment

For GitHub Pages deployment:

1. Build the project:

```bash
npm run build
```

2. The `dist` folder contains the production-ready files

## Assignment Requirements

This project fulfills the following requirements:

- ✅ Using class components
- ✅ TypeScript without `any` usage
- ✅ ESLint, Prettier, Husky setup
- ✅ Component separation
- ✅ Search with localStorage persistence
- ✅ Loading indicators
- ✅ Error handling
- ✅ Error Boundary implementation
- ✅ Error testing button

## License

MIT
