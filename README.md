# vue-streaming

[![npm version](https://img.shields.io/npm/v/vue-streaming.svg)](https://www.npmjs.com/package/vue-streaming)
[![npm downloads](https://img.shields.io/npm/dm/vue-streaming.svg)](https://www.npmjs.com/package/vue-streaming)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A powerful Vue 3 component that wraps [js-streaming](https://www.npmjs.com/package/js-streaming), providing a unified interface for various streaming protocols (WebSocket, SSE, HTTP, Long-Polling, HLS, WebRTC) in your applications.

## Features

- 🔄 Support for six streaming protocols through a unified interface
- ⚡ Automatic connection state management and event handling
- 🎥 Built-in video element integration for live streaming (HLS/WebRTC)
- 📝 Customizable message log through slots
- 🛠️ Written in TypeScript with full type definitions
- 🔌 Extensible API with exposed methods and events

## Requirements

- Vue 3.3 or higher (peer dependency)
- js-streaming library installed in your project

## Installation

You can install the package using npm:

```bash
npm install vue-streaming js-streaming
```

Or using yarn:

```bash
yarn add vue-streaming js-streaming
```

Or using pnpm:

```bash
pnpm add vue-streaming js-streaming
```

## Quick Start
