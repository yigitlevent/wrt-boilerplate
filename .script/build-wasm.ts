import { execSync } from 'child_process'
import path from 'path'

const IsDev = process.argv.includes('--dev')
const WasmDir = path.resolve(import.meta.dirname, '..', 'client-wasm')
const OutDir = '../client/src/wasm'
const WasmFile = `${OutDir}/client_wasm_bg.wasm`

const Commands = [
  'cargo build --release --target wasm32-unknown-unknown',
  `wasm-bindgen --target web --out-dir ${OutDir} target/wasm32-unknown-unknown/release/client_wasm.wasm`,
]

const OptimizeCommands = [
  `wasm-opt -O3 --converge --enable-bulk-memory --enable-sign-ext --enable-nontrapping-float-to-int --strip-debug --strip-producers -o ${WasmFile} ${WasmFile}`,
]

for (const command of IsDev ? Commands : [...Commands, ...OptimizeCommands]) {
  execSync(command, { cwd: WasmDir, stdio: 'inherit' })
}
