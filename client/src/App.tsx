import { invoke, isTauri } from '@tauri-apps/api/core'
import { useState } from 'react'

import { Clamp } from './utils/Clamp'
import { add } from './wasm/client_wasm.js'

import type { ReactElement } from 'react'

const MaxCount = 10

export function App(): ReactElement {
  const [count, setCount] = useState(0)
  const [greeting, setGreeting] = useState(isTauri() ? 'Running inside Tauri' : 'Not running inside Tauri')

  const onGreet = async (): Promise<void> => {
    setGreeting(await invoke<string>('greet', { name: 'React' }))
  }

  return (
    <main>
      <h1>wrt boilerplate</h1>

      <button type="button" onClick={() => { setCount(Clamp(add(count, 1), 0, MaxCount)) }}>
        {`wasm add: ${count}`}
      </button>

      <button type="button" disabled={!isTauri()} onClick={() => { void onGreet() }}>
        tauri invoke
      </button>

      <p>{greeting}</p>
    </main>
  )
}
