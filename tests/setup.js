// Global test setup for Vitest
import { vi, beforeEach } from 'vitest'

// Mock axios globally
import axios from 'axios'
vi.mock('axios', () => ({
  default: vi.fn()
}))

// Reset all mocks before each test
beforeEach(() => {
  vi.clearAllMocks()
})
