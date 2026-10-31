import { Button, Container, Group, Stack, Text, Title } from '@mantine/core'
import '@mantine/core/styles.css'
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
    <Container py="md">
      <Stack>
        <Title>wrt boilerplate</Title>

        <Group>
          <Button onClick={() => { setCount(Clamp(add(count, 1), 0, MaxCount)) }}>
            {`wasm add: ${count}`}
          </Button>

          <Button disabled={!isTauri()} onClick={() => { void onGreet() }}>
            tauri invoke
          </Button>
        </Group>

        <Text>{greeting}</Text>
      </Stack>
    </Container>
  )
}
