# wrt-boilerplate

A starter template for desktop apps built with Tauri 2, React 19, and Rust compiled to WebAssembly. The UI lives in React, heavy computation runs as wasm inside the page, and native OS access goes through Tauri. The same client runs in a desktop window or a plain browser.

The tooling is already set up: ESLint with the recommended rule sets, knip for dead code, vitest, a husky pre-commit hook, and GitHub Actions workflows for tests and for desktop releases on Linux, macOS, and Windows. The demo app is a single page with one wasm call and one Tauri command, so there is little to delete when you start.

This boilerplate is extracted from a personal project that used the same stack to keep its browser and desktop versions in parity.

## Layout

- `client/`: Vite + React app
- `client-wasm/`: Rust crate compiled to wasm, output goes to `client/src/wasm/` (gitignored)
- `client-tauri/`: Tauri desktop shell
- `.tests/`: vitest workspace, mirrors the source tree
- `.script/`: dev scripts

## Requirements

- Node 22+, Rust (`rust-toolchain.toml` pins the version and the wasm target)
- `wasm-bindgen-cli` 0.2.126: `cargo install wasm-bindgen-cli --version 0.2.126 --locked`
- `wasm-opt` from [binaryen](https://github.com/WebAssembly/binaryen/releases):
  - Arch: `sudo pacman -S binaryen`
  - Debian/Ubuntu: `sudo apt install binaryen`
  - macOS: `brew install binaryen`
  - Windows: download the latest `x86_64-windows` release, extract it, and add its `bin` folder to PATH
- [Tauri system dependencies](https://tauri.app/start/prerequisites/): MSVC Build Tools and WebView2 on Windows, Xcode Command Line Tools on macOS, webkit2gtk on Linux

## Commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Browser dev server, rebuilds wasm on `.rs` changes |
| `npm run dev:tauri` | The same, inside a Tauri window |
| `npm run build` | Web build to `client/dist` |
| `npm run build:tauri` | Desktop bundles |
| `npm test` | Run tests |
| `npm run lint` / `npm run lint:fix` | ESLint |
| `npm run knip` | Find unused files, exports, and dependencies |

`npm run build:wasm -w client` generates `client/src/wasm/`. Run it once after cloning: `lint` and `knip` need it, and `dev` and `build` run it on their own.

## Starting a new project

1. Replace `wrt-boilerplate` in `package.json`, `client/package.json`, and `.tests/package.json`
2. Set `productName`, `identifier`, and the window title in `client-tauri/tauri.conf.json`
3. Replace the placeholder icons: `npx tauri icon path/to/icon.png -o client-tauri/icons`
4. Adjust the ESLint rules in `eslint.config.mjs` to taste. It only uses recommended presets, including the ESLint Stylistic defaults

## Documentation

### App

- [Tauri](https://tauri.app/start/)
- [React](https://react.dev/reference/react)
- [Vite](https://vite.dev/guide/)
- [TypeScript](https://www.typescriptlang.org/docs/)

### Rust and wasm

- [Rust](https://doc.rust-lang.org/book/)
- [WebAssembly](https://developer.mozilla.org/en-US/docs/WebAssembly)
- [wasm-bindgen](https://wasm-bindgen.github.io/wasm-bindgen/)
- [Binaryen](https://github.com/WebAssembly/binaryen)

## How to develop with this boilerplate

### Daily loop

1. Run `npm run dev:tauri`, or `npm run dev` if the work doesn't need Tauri APIs
2. Edit code. React changes hot reload, `.rs` changes in `client-wasm/` rebuild the wasm, and `.rs` changes in `client-tauri/` restart the app
3. Commit. The pre-commit hook lints staged files and runs the tests
4. Run `npm run knip` before finishing a feature to catch dead code

### Where code goes

- UI and app logic: `client/src/`
- CPU-heavy work that should run in the page: `client-wasm/src/`
- Native access such as files, OS, and windows: `client-tauri/src/`

### Add a wasm function

1. Add a `#[wasm_bindgen] pub fn` to `client-wasm/src/lib.rs`
2. Import it in React from the generated bindings, as `client/src/App.tsx` does with `add`

`client/src/main.tsx` already initializes the wasm module before React renders, so components can call exports directly.

### Add a Tauri command

1. Add a `#[tauri::command]` function to `client-tauri/src/lib.rs`
2. Register it in `tauri::generate_handler![...]` in the same file
3. Call it with `invoke("command_name", { args })`, as `client/src/App.tsx` does with `greet`

Guard calls with `isTauri()` so the app still runs in a plain browser. Plugins and core window APIs also need a permission in `client-tauri/capabilities/default.json`.

### Add a test

Put tests in `.tests/`, mirroring the source path: `client/src/utils/Clamp.ts` is tested by `.tests/client/utils/Clamp.test.ts`. Tests run without the wasm build, so keep logic you want to test out of files that import `client/src/wasm/`.

### Upgrade wasm-bindgen

The version must match in three places:

- `client-wasm/Cargo.toml`
- `.github/workflows/release-desktop.yml`
- your local `wasm-bindgen-cli` install

### Release

Run the **Release Desktop** workflow from the GitHub Actions tab and enter a version. It builds the selected platforms and attaches them to a draft GitHub Release. Builds are unsigned, so macOS Gatekeeper and Windows SmartScreen warn users until you add signing certificates.
