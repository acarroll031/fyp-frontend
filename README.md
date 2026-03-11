# Student Risk Predictor — Frontend

A React-based dashboard that helps lecturers identify and support at-risk students through predictive analytics.

## Tech Stack

- **React 19** with TypeScript
- **Ant Design 6** for UI components
- **Recharts** for data visualisation
- **Axios** for API communication
- **React Router 7** for client-side routing
- **Vite** (Rolldown) for bundling
- Deployed on **Vercel**

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```
VITE_API_URL=http://localhost:8000
```

### Development

```bash
npm run dev
```

### Production Build

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
├── Components/       # Reusable UI components (NavBar, ProtectedRoute)
├── pages/            # Page-level components
├── axiosInstance.ts   # Configured Axios client with auth interceptor
├── App.tsx           # Root component with routing
└── main.tsx          # Entry point
```

## Author

Adam Carroll — CSSE Final Year Student, Maynooth University
