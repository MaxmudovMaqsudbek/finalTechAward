# Bid-Rigging Detection Frontend Documentation

This document provides comprehensive setup instructions and architectural details for the frontend application of the bid-rigging detection system.

## Table of Contents

1. [Project Overview](#project-overview)
2. [Prerequisites](#prerequisites)
3. [Environment Setup](#environment-setup)
4. [Installation Guide](#installation-guide)
5. [Environment Variables Configuration](#environment-variables-configuration)
6. [Project Architecture](#project-architecture)
7. [Development Workflow](#development-workflow)
8. [Build and Deployment](#build-and-deployment)
9. [Troubleshooting](#troubleshooting)

## Project Overview

The frontend is a modern React application built with **Vite** as the build tool and bundler. It provides an intuitive dashboard for analyzing auction data, detecting bid-rigging patterns, and generating comprehensive reports.

### Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | `^19.1.0` | UI framework for building component-based interfaces |
| **Vite** | `^7.0.4` | Build tool and development server |
| **Material-UI** | `^7.1.2` | React component library for UI design |
| **TailwindCSS** | `^4.1.10` | Utility-first CSS framework |
| **React Router DOM** | `^7.6.2` | Client-side routing |
| **Recharts** | `^2.15.3` | Data visualization and charting library |
| **Zustand** | `^5.0.6` | State management solution |
| **Axios** | `^1.10.0` | HTTP client for API requests |
| **Leaflet** | `^1.9.4` | Interactive maps integration |

## Prerequisites

Before setting up the project, ensure you have the following installed:

### Required Software

| Software | Minimum Version | Recommended Version | Purpose |
|----------|----------------|-------------------|---------|
| **Node.js** | `18.0.0` | `20.x.x` | JavaScript runtime |
| **npm** | `8.0.0` | `10.x.x` | Package manager |
| **Git** | `2.34.0` | Latest | Version control |

### System Requirements

- **OS**: Windows 10/11, macOS 10.15+, or Linux Ubuntu 18.04+
- **RAM**: Minimum 4GB, Recommended 8GB+
- **Storage**: At least 1GB free space
- **Browser**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+

## Environment Setup

### 1. Clone the Repository

```bash
git clone https://github.com/MaxmudovMaqsudbek/finalTechAward.git
cd finalTechAward/bid-rigging-detection/tech
```

### 2. Verify Node.js Installation

```bash
node --version  # Should return v18.0.0 or higher
npm --version   # Should return 8.0.0 or higher
```

### 3. Install Dependencies

Navigate to the tech directory and install all required packages:

```bash
npm install
```

This will install all dependencies listed in `package.json`, including:
- Production dependencies (React, Material-UI, TailwindCSS, etc.)
- Development dependencies (Vite, ESLint, TypeScript types, etc.)

## Installation Guide

### Step-by-Step Installation

1. **Verify Prerequisites**
   ```bash
   node --version && npm --version
   ```

2. **Install Project Dependencies**
   ```bash
   npm install
   ```

3. **Set Up Environment Variables** (See next section)

4. **Start Development Server**
   ```bash
   npm run dev
   ```

5. **Open Application**
   - Navigate to `http://localhost:5173` in your browser
   - The application should load with the login page

## Environment Variables Configuration

### Creating the .env File

The application requires environment variables for proper configuration. Create a `.env` file in the `tech` directory:

```bash
# Navigate to tech directory
cd tech

# Create .env file (Windows PowerShell)
New-Item -Path ".env" -ItemType File

# Or using Command Prompt
echo. > .env
```

### Required Environment Variables

Copy the following configuration into your `.env` file:

```properties
# ===========================================
# APPLICATION CONFIGURATION
# ===========================================
VITE_APP_NAME=Procurement Dashboard
VITE_APP_VERSION=1.0.0

# ===========================================
# API CONFIGURATION
# ===========================================
# Backend API base URL - Update this to match your backend server
VITE_API_BASE_URL=http://localhost:3000/api
# Request timeout in milliseconds
VITE_API_TIMEOUT=30000

# ===========================================
# MAP CONFIGURATION
# ===========================================
# OpenStreetMap tile server URL
VITE_MAP_TILE_URL=https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
# Map attribution text
VITE_MAP_ATTRIBUTION=© OpenStreetMap contributors

# ===========================================
# FEATURE FLAGS
# ===========================================
# Enable/disable data export functionality
VITE_FEATURE_EXPORT_DATA=true
# Enable/disable advanced filtering options
VITE_FEATURE_ADVANCED_FILTERS=true
# Enable/disable real-time data updates
VITE_FEATURE_REAL_TIME_UPDATES=true

# ===========================================
# ANALYTICS CONFIGURATION (OPTIONAL)
# ===========================================
# Google Analytics ID (leave empty if not using analytics)
VITE_ANALYTICS_ID=

# ===========================================
# DEVELOPMENT CONFIGURATION
# ===========================================
# Set to 'development' for dev mode, 'production' for prod
VITE_NODE_ENV=development
# Enable debug mode (shows additional console logs)
VITE_DEBUG_MODE=true
```

### Environment Variables Reference

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `VITE_APP_NAME` | `string` | `"Procurement Dashboard"` | Application display name |
| `VITE_APP_VERSION` | `string` | `"1.0.0"` | Current application version |
| `VITE_API_BASE_URL` | `string` | `"http://localhost:3000/api"` | Backend API endpoint |
| `VITE_API_TIMEOUT` | `number` | `30000` | API request timeout (ms) |
| `VITE_MAP_TILE_URL` | `string` | OSM URL | Map tiles source URL |
| `VITE_MAP_ATTRIBUTION` | `string` | OSM attribution | Map attribution text |
| `VITE_FEATURE_EXPORT_DATA` | `boolean` | `true` | Enable data export feature |
| `VITE_FEATURE_ADVANCED_FILTERS` | `boolean` | `true` | Enable advanced filters |
| `VITE_FEATURE_REAL_TIME_UPDATES` | `boolean` | `true` | Enable real-time updates |
| `VITE_ANALYTICS_ID` | `string` | `""` | Google Analytics tracking ID |
| `VITE_DEBUG_MODE` | `boolean` | `true` | Enable debug logging |

### Environment-Specific Configurations

#### Development Environment
```properties
VITE_API_BASE_URL=http://localhost:3000/api
VITE_DEBUG_MODE=true
VITE_NODE_ENV=development
```

#### Production Environment
```properties
VITE_API_BASE_URL=https://your-production-api.com/api
VITE_DEBUG_MODE=false
VITE_NODE_ENV=production
```

#### Staging Environment
```properties
VITE_API_BASE_URL=https://staging-api.your-domain.com/api
VITE_DEBUG_MODE=true
VITE_NODE_ENV=staging
```

## Project Architecture

### Folder Structure Overview

```
tech/
├── public/                     # Static assets
│   └── logoEq.svg               # Eq1 logo
├── src/                       # Source code
│   ├── App.jsx               # Main application component
│   ├── main.jsx              # Application entry point
│   ├── index.css             # Global styles
│   ├── assets/               # Static assets (images, icons)
│   │   └── react.svg
│   ├── entities/             # Business entities (User, etc.)
│   │   └── user/
│   │       └── Profile.jsx
│   ├── features/             # Feature-specific components
│   │   ├── Notifications.jsx
│   │   └── ThemeToggler.jsx
│   ├── pages/                # Page components
│   │   ├── AnalysisPage/
│   │   ├── Login/
│   │   ├── MainPage/
│   │   ├── Reports/
│   │   ├── Settings/
│   │   └── ToDo/
│   ├── shared/               # Shared utilities and components
│   │   ├── api/              # API configuration and hooks
│   │   ├── hooks/            # Custom React hooks
│   │   ├── lib/              # Utility libraries and contexts
│   │   └── ui/               # Reusable UI components
│   └── widgets/              # Complex UI widgets
│       ├── Header.jsx
│       ├── Sidebar.jsx
│       ├── analysis/
│       ├── main/
│       └── reports/
├── .env                      # Environment variables
├── .gitignore               # Git ignore rules
├── eslint.config.js         # ESLint configuration
├── package.json             # Dependencies and scripts
├── vite.config.js           # Vite configuration
└── README.md                # This documentation
```

### Architecture Principles

The application follows **Feature-Sliced Design (FSD)** architecture principles:

#### 1. **Layers**
- **app**: Application initialization and global providers
- **pages**: Route-level components
- **widgets**: Complex UI blocks composed of features and entities
- **features**: User-interactive functionality
- **entities**: Business entities and their logic
- **shared**: Reusable utilities, UI kit, and technical code

#### 2. **Segments**
- **ui**: UI components and their compositions
- **model**: Business logic, state management, and data models
- **lib**: Infrastructure code, utilities, and configurations
- **api**: API interactions and data fetching logic

### Key Components

#### Core Application Components

| Component | Location | Purpose |
|-----------|----------|---------|
| `App.jsx` | `/src/App.jsx` | Main application wrapper with routing logic |
| `main.jsx` | `/src/main.jsx` | Application entry point with providers |
| `AuthProvider` | `/src/shared/lib/contexts/AuthProvider.jsx` | Authentication state management |
| `ThemeProvider` | `/src/shared/lib/contexts/ThemeContext.jsx` | Theme switching functionality |

#### Page Components

| Page | Location | Description |
|------|----------|-------------|
| **LoginPage** | `/src/pages/Login/` | User authentication interface |
| **MainPage** | `/src/pages/MainPage/` | Dashboard with KPIs and overview charts |
| **AnalysisPage** | `/src/pages/AnalysisPage/` | Bid-rigging analysis tools and visualizations |
| **ReportsPage** | `/src/pages/Reports/` | Report generation and management |
| **SettingsPage** | `/src/pages/Settings/` | Application configuration |
| **ToDoPage** | `/src/pages/ToDo/` | Task management interface |

#### Widget Components

| Widget | Location | Purpose |
|--------|----------|---------|
| **Header** | `/src/widgets/Header.jsx` | Top navigation and page title |
| **Sidebar** | `/src/widgets/Sidebar.jsx` | Main navigation menu |
| **StatsCards** | `/src/widgets/main/StatsCards.jsx` | KPI display cards |
| **NetworkGraph** | `/src/widgets/analysis/NetworkGraph.jsx` | Network visualization for relationships |
| **Pagination** | `/src/widgets/reports/Pagination.jsx` | Data pagination controls |

## Development Workflow

### Available Scripts

| Script | Command | Purpose |
|--------|---------|---------|
| **Development** | `npm run dev` | Start development server with hot reload |
| **Build** | `npm run build` | Create production build |
| **Preview** | `npm run preview` | Preview production build locally |
| **Lint** | `npm run lint` | Run ESLint code quality checks |

### Development Server

```bash
npm run dev
```

- **URL**: `http://localhost:5173`
- **Hot Reload**: Automatically reloads on file changes
- **Port**: Default 5173 (auto-increments if occupied)

### Code Quality and Linting

The project uses **ESLint** with React-specific rules:

```bash
# Run linting
npm run lint

# Auto-fix linting issues
npm run lint -- --fix
```

### State Management

The application uses **Zustand** for state management:

```javascript
// Example store structure
import { create } from 'zustand'

const useAppStore = create((set) => ({
  theme: 'light',
  user: null,
  setTheme: (theme) => set({ theme }),
  setUser: (user) => set({ user }),
}))
```

### API Integration

API calls are managed through **Axios** with centralized configuration:

```javascript
// API configuration example
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: import.meta.env.VITE_API_TIMEOUT,
})
```

## Build and Deployment

### Production Build

```bash
npm run build
```

This creates optimized files in the `dist/` directory:
- Minified JavaScript bundles
- Optimized CSS files
- Static assets with hashed filenames
- Compressed assets for faster loading

### Build Configuration

The build process is configured in `vite.config.js`:

```javascript
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { '@': '/src' }
  },
  build: {
    chunkSizeWarningLimit: 3000,
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
      },
    },
  },
})
```

### Deployment Options

#### 1. **Static Hosting** (Recommended)
Deploy the `dist/` folder to:
- **Vercel**: `vercel --prod`
- **Netlify**: Drag and drop `dist/` folder
- **GitHub Pages**: Push `dist/` to `gh-pages` branch

#### 2. **Traditional Web Server**
Copy `dist/` contents to web server root directory.

#### 3. **Docker Deployment**
```dockerfile
FROM nginx:alpine
COPY dist/ /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Environment-Specific Builds

```bash
# Development build
npm run build -- --mode development

# Production build
npm run build -- --mode production

# Staging build
npm run build -- --mode staging
```

## Troubleshooting

### Common Issues and Solutions

#### 1. **Node.js Version Mismatch**
```bash
Error: Node.js version 16.x.x is not supported
```
**Solution**: Upgrade to Node.js 18+ or use nvm:
```bash
nvm install 20
nvm use 20
```

#### 2. **Port Already in Use**
```bash
Error: Port 5173 is already in use
```
**Solution**: Use different port:
```bash
npm run dev -- --port 3000
```

#### 3. **Module Not Found Errors**
```bash
Error: Cannot resolve module '@/components/...'
```
**Solution**: Clear node_modules and reinstall:
```bash
rm -rf node_modules package-lock.json
npm install
```

#### 4. **Environment Variables Not Loading**
```bash
Error: Cannot read property of undefined (VITE_API_BASE_URL)
```
**Solution**: 
- Ensure `.env` file is in the correct directory (`tech/`)
- Restart development server after adding new variables
- Verify variables start with `VITE_` prefix

#### 5. **Build Failures**
```bash
Error: Failed to build for production
```
**Solution**: 
- Run `npm run lint` to check for code issues
- Verify all imports are correct
- Check for TypeScript errors if using TS files

#### 6. **API Connection Issues**
```bash
Error: Network Error / CORS issues
```
**Solution**:
- Verify `VITE_API_BASE_URL` in `.env`
- Ensure backend server is running
- Check CORS configuration on backend

### Performance Optimization

#### Bundle Size Analysis
```bash
npm run build
npx vite-bundle-analyzer dist/
```

#### Code Splitting
Components are automatically code-split by Vite. For manual splitting:
```javascript
const LazyComponent = React.lazy(() => import('./Component'))
```

#### Memory Management
- Use `React.memo()` for expensive components
- Implement proper cleanup in `useEffect`
- Avoid memory leaks in event listeners

### Development Tips

1. **Use React DevTools** for debugging components
2. **Enable source maps** for better debugging experience
3. **Use TypeScript** for better type safety (optional)
4. **Implement proper error boundaries** for production stability
5. **Use proper semantic HTML** for accessibility

### Support and Contributing

- **Issues**: Report bugs and feature requests on GitHub
- **Documentation**: Keep this README updated with changes
- **Code Style**: Follow ESLint rules and Prettier formatting
- **Testing**: Add tests for new features and components

---

For additional questions or support, please contact the development team or create an issue in the GitHub repository.


