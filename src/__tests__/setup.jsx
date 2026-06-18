import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import fetch from 'node-fetch';

// Mock helper that returns a successful fetch response for tests.
// The value passed in is returned from the mocked json() call.
global.setFetchResponse = (val) => {
    global.fetch = vi.fn(() => Promise.resolve({
        json: () => Promise.resolve(val),
        ok: true,
        status: 200
    }))
}

// Clean up the testing DOM after each test.
afterEach(() => {
    cleanup();
})