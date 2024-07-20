export default {
  VITE_NODE_ENV: ['development', 'local'].includes(import.meta.env.MODE),
  VITE_APP_BASE_API_URL:
    import.meta.env.VITE_APP_BASE_API_URL || 'http://localhost:3000',
} as const;
