import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { App } from './App'
import InitWasm from './wasm/client_wasm.js'

const RootElement = document.getElementById('root')

if (!RootElement) {
  throw new Error('Root element not found')
}

await InitWasm()

createRoot(RootElement)
  .render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
