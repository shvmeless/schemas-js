// IMPORTS
import { resolve } from 'path'

// CONFIG
export default {
  test: {
    reporters: ['default', { summary: false }],
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@tests': resolve(__dirname, './tests'),
    },
  },
}
