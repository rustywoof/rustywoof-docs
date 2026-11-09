<div align="center">
  <img src="https://www.ianramy.co.ke/rustywoof/assets/logo.png" width="250" />
  <br>

# Rustywoof Documentation

Official documentation portal, CLI reference manual, and interactive WebAssembly workbench for Rustywoof.

Rustywoof (`woof`) is a pre-commit secret scanner and multi-ecosystem supply chain vulnerability auditor written in Rust. This repository contains the source code for the official documentation portal, live in-browser security playground, interactive terminal simulators, and technical architecture guides.

## Features

- **Multi-Ecosystem Secret Scanner:** Documentation and live simulators for Aho-Corasick token prefix matching combined with Shannon entropy validation, eliminating regular expression backtracking and suppressing false positives.
- **Supply Chain Vulnerability Auditor:** Guides and interactive sandboxes for querying the Open Source Vulnerabilities (OSV) distributed database across Cargo, npm, pnpm, Yarn, Bun, and Python manifests.
- **In-Browser WebAssembly Playground:** Client-side scanner and payload inspector powered by a dedicated Rust WebAssembly module (`wasm-core`), equipped with deterministic offline fallbacks.
- **Exhaustive CLI Reference:** Complete reference guides covering syntax, options, exit codes, and machine-readable output schemas for all `woof` commands (`init`, `scan`, `audit`, `patrol`, `check`, `hook`, `sniff`, `remediate`, `cache`, `update`, `generate`).
- **Developer-Grade Terminal Simulators:** Zero-scrollbar terminal windows with official ecosystem brand icons, tactile copy actions, and accurate ANSI diagnostic formatting.
- **High-Performance Architecture:** Built with Next.js 16 (Turbopack), React 19, Fumadocs MDX engine, Tailwind CSS v4, and offline-first service worker caching.

## Design System

The documentation interface implements a dual-mode architectural palette engineered for extended reading comfort:

- **Dark Theme:** Modern obsidian slate (`#0a0d12` surface, `#111620` raised, `#1e2634` border, `#f97316` amber accent).
- **Light Theme:** Warm tactile parchment (`#f2f2f2` surface, `#ece8e1` code chrome, `#ddd3c1` border, `#bc6500` burnt ochre accent).
- **Typography:** IBM Plex Sans paired with IBM Plex Mono for code windows and terminal output.

# Official Link

[Official Rustywoof Website](https://rustywoof.dev)
