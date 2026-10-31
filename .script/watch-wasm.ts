import { spawn } from 'child_process'
import fs from 'fs'
import path from 'path'

const DebounceMs = 1000
const WasmDir = path.resolve(import.meta.dirname, '..', 'client-wasm')
const SrcDir = path.join(WasmDir, 'src')

let DebounceTimer: NodeJS.Timeout | null = null
let Building = false
let RebuildQueued = false

function RunBuild(): void {
  if (Building) {
    RebuildQueued = true
    return
  }

  Building = true
  console.log('[watch-wasm] change detected, rebuilding...')

  const build = spawn('npm run build:wasm:dev -w client', { shell: true, stdio: 'inherit' })

  build.on('exit', (code) => {
    Building = false
    console.log(code === 0 ? '[watch-wasm] rebuild complete' : `[watch-wasm] rebuild failed (exit ${code})`)

    if (RebuildQueued) {
      RebuildQueued = false
      RunBuild()
    }
  })
}

function ScheduleBuild(): void {
  if (DebounceTimer) clearTimeout(DebounceTimer)
  DebounceTimer = setTimeout(RunBuild, DebounceMs)
}

fs.watch(SrcDir, { recursive: true }, (_event, filename) => {
  if (!filename?.endsWith('.rs')) return
  ScheduleBuild()
})

console.log(`[watch-wasm] watching ${SrcDir} for changes`)
