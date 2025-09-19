# vue-streaming

<div align="center">
**Universal Vue 3 streaming component for real-time data and media**

[![npm version](https://img.shields.io/npm/v/vue-streaming.svg)](https://github.com/package/vue-streaming)
[![Vue 3](https://img.shields.io/badge/vue-3.3%2B-brightgreen.svg)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/typescript-ready-blue.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/vue-streaming)](https://bundlephobia.com/package/vue-streaming)

</div>

## 🌟 Features

Vue Streaming provides a unified `<StreamPlayer>` component that handles **6 different streaming protocols** with a consistent, declarative API:

- 🔌 **WebSocket** - Real-time bidirectional communication
- 📡 **Server-Sent Events (SSE)** - Server-to-client event streams
- 🌊 **HTTP Streaming** - Chunked transfer encoding streams
- 🔄 **Long Polling** - HTTP-based persistent connections
- 📺 **HLS Video** - HTTP Live Streaming for adaptive video
- 🎥 **WebRTC** - Peer-to-peer real-time communication

### ✨ Why Choose Vue Streaming?

- **One API, Many Protocols**: Switch between streaming types with just a prop change
- **Vue 3 Native**: Built for Composition API with full TypeScript support
- **Headless Design**: No imposed styling - complete UI control
- **Production Ready**: Auto-reconnection, error handling, and backoff strategies
- **Lightweight**: Thin wrapper around `js-streaming` core library
- **Extensible**: Custom slots and event system for any use case

## 📦 Installation

```bash
# npm
npm install vue-streaming js-streaming

# yarn
yarn add vue-streaming js-streaming

# pnpm
pnpm add vue-streaming js-streaming
```

> **Note**: Both `vue-streaming` and `js-streaming` are required. Vue Streaming is a wrapper that leverages the core `js-streaming` library.

### Requirements

- **Vue**: 3.3.0 or higher
- **Node**: 16+ (for build tools)
- **Build System**: Vite, Nuxt 3, or Vue CLI with TypeScript support

## 🚀 Quick Start

### Basic WebSocket Example

```vue
<script setup lang="ts">
import { ref } from "vue";
import { StreamPlayer } from "vue-streaming";

const player = ref<InstanceType<typeof StreamPlayer>>();
const config = {
  url: "wss://echo.websocket.events",
  protocols: ["echo-protocol"],
};

function sendMessage() {
  player.value?.send("Hello WebSocket!");
}
</script>

<template>
  <div>
    <h2>WebSocket Demo</h2>
    <StreamPlayer
      ref="player"
      type="websocket"
      :config="config"
      :auto-open="true"
      @message="console.log('Received:', $event)"
      @status="console.log('Status:', $event)"
    />
    <button @click="sendMessage">Send Message</button>
  </div>
</template>
```

### HLS Video Streaming

```vue
<script setup lang="ts">
import { StreamPlayer } from "vue-streaming";

const hlsConfig = {
  url: "https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8",
};
</script>

<template>
  <StreamPlayer
    type="hls"
    :config="hlsConfig"
    :auto-open="true"
    :autoplay="true"
    :controls="true"
    :muted="false"
  />
</template>
```

### Server-Sent Events

```vue
<script setup lang="ts">
import { StreamPlayer } from "vue-streaming";

const sseConfig = {
  url: "/api/events",
  headers: { Authorization: "Bearer token" },
};
</script>

<template>
  <StreamPlayer
    type="sse"
    :config="sseConfig"
    :auto-open="true"
    @message="handleServerEvent"
  />
</template>
```

## 📚 API Reference

### Props

| Prop          | Type         | Default    | Description                                                                |
| ------------- | ------------ | ---------- | -------------------------------------------------------------------------- |
| `type`        | `StreamType` | _required_ | Protocol type: `websocket`, `sse`, `http`, `long-polling`, `hls`, `webrtc` |
| `config`      | `object`     | _required_ | Protocol-specific configuration object                                     |
| `autoOpen`    | `boolean`    | `false`    | Automatically open connection on mount                                     |
| `autoplay`    | `boolean`    | `false`    | Auto-play for video streams (HLS/WebRTC)                                   |
| `controls`    | `boolean`    | `true`     | Show video controls                                                        |
| `playsInline` | `boolean`    | `true`     | Play video inline on mobile                                                |
| `muted`       | `boolean`    | `false`    | Start video muted                                                          |
| `logLimit`    | `number`     | `500`      | Maximum messages to keep in memory                                         |
| `videoAttrs`  | `object`     | `{}`       | Additional HTML video element attributes                                   |

### Events

| Event      | Payload        | Description                                                               |
| ---------- | -------------- | ------------------------------------------------------------------------- |
| `@open`    | `void`         | Connection established                                                    |
| `@close`   | `void`         | Connection closed                                                         |
| `@status`  | `StreamStatus` | Status change: `idle`, `connecting`, `open`, `closing`, `closed`, `error` |
| `@error`   | `Error`        | Error occurred                                                            |
| `@message` | `any`          | New message/data received                                                 |

### Exposed Methods & Properties

```typescript
interface StreamPlayerInstance {
  // Methods
  open(): Promise<void>;
  close(): Promise<void>;
  send(data: unknown): void; // Available for WebSocket/WebRTC

  // Reactive State
  status: Ref<StreamStatus>;
  isOpen: Ref<boolean>;
  error: Ref<Error | null>;
  messages: Ref<unknown[]>;
}
```

### Configuration Objects

Each stream type accepts different configuration options:

#### WebSocket Config

```typescript
{
  url: string
  protocols?: string[]
  headers?: Record<string, string>
  binaryType?: 'blob' | 'arraybuffer'
}
```

#### SSE Config

```typescript
{
  url: string
  headers?: Record<string, string>
  withCredentials?: boolean
  eventSourceInitDict?: EventSourceInit
}
```

#### HTTP Streaming Config

```typescript
{
  url: string
  method?: string
  headers?: Record<string, string>
  body?: any
  signal?: AbortSignal
}
```

#### Long Polling Config

```typescript
{
  url: string
  interval?: number
  headers?: Record<string, string>
  timeout?: number
}
```

#### HLS Config

```typescript
{
  url: string
  hlsConfig?: any  // Passed to HLS.js
}
```

#### WebRTC Config

```typescript
{
  configuration?: RTCConfiguration
  attachVideo?: boolean  // Auto-attach video stream
  // Additional WebRTC-specific options
}
```

## 🎨 Customization with Slots

### Custom Log Display

```vue
<template>
  <StreamPlayer type="websocket" :config="config">
    <template #log="{ messages, status, error }">
      <div class="custom-log">
        <div class="status-bar">
          Status: <span :class="status">{{ status }}</span>
        </div>
        <div v-if="error" class="error">{{ error.message }}</div>
        <div class="messages">
          <div v-for="(msg, i) in messages" :key="i" class="message">
            {{ typeof msg === "string" ? msg : JSON.stringify(msg) }}
          </div>
        </div>
      </div>
    </template>
  </StreamPlayer>
</template>

<style scoped>
.custom-log {
  border: 2px solid #007acc;
  border-radius: 8px;
  padding: 16px;
  background: #f8f9fa;
}
.status-bar {
  font-weight: bold;
}
.status.open {
  color: green;
}
.status.error {
  color: red;
}
.messages {
  max-height: 300px;
  overflow-y: auto;
}
.message {
  padding: 4px 0;
  border-bottom: 1px solid #eee;
}
</style>
```

### Custom Action Buttons

```vue
<template>
  <StreamPlayer type="websocket" :config="config">
    <template #actions="{ open, close, send, isOpen, status }">
      <div class="action-bar">
        <button @click="open" :disabled="isOpen">Connect</button>
        <button @click="close" :disabled="!isOpen">Disconnect</button>
        <button @click="send('ping')" :disabled="!isOpen">Ping</button>
        <span class="status-indicator" :class="status">{{ status }}</span>
      </div>
    </template>
  </StreamPlayer>
</template>
```

## 🛠️ Advanced Usage

### Auto-Reconnection and Error Handling

```vue
<script setup lang="ts">
import { ref } from "vue";
import { StreamPlayer } from "vue-streaming";

const config = ref({
  url: "wss://api.example.com/ws",
  // Auto-reconnection settings
  autoReconnect: true,
  maxRetries: 5,
  heartbeatMs: 30000,
  backoff: {
    baseMs: 1000,
    maxMs: 10000,
    factor: 1.5,
    jitter: true,
  },
});

function handleError(error: Error) {
  console.error("Stream error:", error);
  // Custom error handling logic
}

function handleStatusChange(status: string) {
  if (status === "error") {
    // Handle connection errors
  } else if (status === "open") {
    console.log("Successfully connected!");
  }
}
</script>

<template>
  <StreamPlayer
    type="websocket"
    :config="config"
    @error="handleError"
    @status="handleStatusChange"
  />
</template>
```

### Dynamic Configuration

```vue
<script setup lang="ts">
import { ref, computed } from "vue";
import { StreamPlayer } from "vue-streaming";

const apiEndpoint = ref("wss://api.example.com");
const authToken = ref("");

const dynamicConfig = computed(() => ({
  url: `${apiEndpoint.value}/ws`,
  headers: {
    Authorization: `Bearer ${authToken.value}`,
  },
}));

// Configuration changes will automatically recreate the stream
</script>

<template>
  <div>
    <input v-model="apiEndpoint" placeholder="WebSocket URL" />
    <input v-model="authToken" placeholder="Auth Token" />

    <StreamPlayer
      type="websocket"
      :config="dynamicConfig"
      :auto-open="!!authToken"
    />
  </div>
</template>
```

### Programmatic Control

```vue
<script setup lang="ts">
import { ref, onMounted } from "vue";
import { StreamPlayer } from "vue-streaming";

const player = ref<InstanceType<typeof StreamPlayer>>();

onMounted(() => {
  // Programmatic control
  setTimeout(() => {
    player.value?.open();
  }, 1000);

  // Send periodic messages
  setInterval(() => {
    if (player.value?.isOpen) {
      player.value.send({
        type: "heartbeat",
        timestamp: Date.now(),
      });
    }
  }, 10000);
});

// Access reactive state
const connectionStatus = computed(() => player.value?.status || "idle");
const messageCount = computed(() => player.value?.messages.length || 0);
</script>
```

## 🔧 TypeScript Support

Vue Streaming is fully typed. Import types for enhanced development experience:

```typescript
import type {
  StreamType,
  StreamStatus,
  StreamState,
  StreamAPI,
} from "vue-streaming";

// Component instance type
import { StreamPlayer } from "vue-streaming";
type StreamPlayerInstance = InstanceType<typeof StreamPlayer>;

// Usage in composition function
function useStreamPlayer() {
  const player = ref<StreamPlayerInstance>();
  const status = computed(() => player.value?.status || "idle");

  return { player, status };
}
```

## 🌐 Nuxt 3 / SSR Usage

For server-side rendering, wrap the component to prevent hydration issues:

```vue
<template>
  <div>
    <ClientOnly>
      <StreamPlayer type="websocket" :config="config" :auto-open="true" />
      <template #fallback>
        <div>Loading stream player...</div>
      </template>
    </ClientOnly>
  </div>
</template>
```

Or create an async component:

```vue
<script setup lang="ts">
import { defineAsyncComponent } from "vue";

const StreamPlayer = defineAsyncComponent(() =>
  import("vue-streaming").then((m) => m.StreamPlayer)
);
</script>
```

## 📱 Real-World Examples

### Chat Application

```vue
<script setup lang="ts">
import { ref } from "vue";
import { StreamPlayer } from "vue-streaming";

const message = ref("");
const chatPlayer = ref<InstanceType<typeof StreamPlayer>>();

const config = {
  url: "wss://chat.example.com/ws",
  protocols: ["chat-v1"],
};

function sendMessage() {
  if (message.value.trim()) {
    chatPlayer.value?.send({
      type: "message",
      content: message.value,
      timestamp: new Date().toISOString(),
    });
    message.value = "";
  }
}

function handleChatMessage(msg: any) {
  if (msg.type === "message") {
    // Handle incoming chat message
    console.log(`${msg.user}: ${msg.content}`);
  }
}
</script>

<template>
  <div class="chat-container">
    <StreamPlayer
      ref="chatPlayer"
      type="websocket"
      :config="config"
      :auto-open="true"
      @message="handleChatMessage"
    >
      <template #log="{ messages }">
        <div class="chat-messages">
          <div v-for="msg in messages" :key="msg.id" class="message">
            <strong>{{ msg.user }}:</strong> {{ msg.content }}
          </div>
        </div>
      </template>

      <template #actions="{ isOpen }">
        <div class="chat-input">
          <input
            v-model="message"
            @keyup.enter="sendMessage"
            :disabled="!isOpen"
            placeholder="Type a message..."
          />
          <button @click="sendMessage" :disabled="!isOpen">Send</button>
        </div>
      </template>
    </StreamPlayer>
  </div>
</template>
```

### Live Data Dashboard

```vue
<script setup lang="ts">
import { ref, computed } from "vue";
import { StreamPlayer } from "vue-streaming";

const metrics = ref<any[]>([]);

const config = {
  url: "/api/metrics/stream",
  headers: { Accept: "text/event-stream" },
};

function handleMetricsUpdate(data: any) {
  if (data.type === "metrics") {
    metrics.value = [...metrics.value, data.payload].slice(-50); // Keep last 50
  }
}

const latestMetrics = computed(
  () => metrics.value[metrics.value.length - 1]?.payload || {}
);
</script>

<template>
  <div class="dashboard">
    <h1>Live Metrics Dashboard</h1>

    <div class="metrics-grid">
      <div class="metric-card">
        <h3>CPU Usage</h3>
        <div class="metric-value">{{ latestMetrics.cpu }}%</div>
      </div>
      <div class="metric-card">
        <h3>Memory</h3>
        <div class="metric-value">{{ latestMetrics.memory }}MB</div>
      </div>
    </div>

    <StreamPlayer
      type="sse"
      :config="config"
      :auto-open="true"
      @message="handleMetricsUpdate"
    >
      <template #log="{ messages, status }">
        <div class="connection-status">
          Status: <span :class="status">{{ status }}</span> | Updates:
          {{ messages.length }}
        </div>
      </template>
    </StreamPlayer>
  </div>
</template>
```

## 🐛 Troubleshooting

### Common Issues

**Connection fails immediately**

```typescript
// Check if the URL is correct and accessible
const config = {
  url: "ws://localhost:3000/ws", // http:// for ws://, https:// for wss://
};
```

**CORS issues with SSE/HTTP**

```typescript
const config = {
  url: "/api/stream",
  headers: {
    "Access-Control-Allow-Origin": "*",
  },
};
```

**Video not playing (HLS/WebRTC)**

```vue
<StreamPlayer
  type="hls"
  :config="hlsConfig"
  :autoplay="true"
  :muted="true"  <!-- Required for autoplay in most browsers -->
  :plays-inline="true"
/>
```

**Messages not displaying**

```javascript
// Check if logLimit is sufficient
<StreamPlayer :log-limit="1000" />

// Or handle messages manually
@message="msg => console.log('Received:', msg)"
```

### Browser Compatibility

- **WebSocket**: All modern browsers
- **SSE**: All modern browsers (IE/Edge requires polyfill)
- **HLS**: Requires HLS.js for non-Safari browsers
- **WebRTC**: Modern browsers (check specific API support)

### Performance Tips

1. **Limit message history**: Use reasonable `logLimit` values
2. **Debounce rapid updates**: Use `shallowRef` for message arrays
3. **Clean up properly**: Component handles cleanup automatically
4. **Use object URLs**: For large binary data in WebRTC/HLS

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup

```bash
git clone https://github.com/yourusername/vue-streaming.git
cd vue-streaming
npm install
npm run dev
```

### Building

```bash
npm run build
npm run test
```

## 📄 License

MIT © Vue Streaming Contributors

---

<div align="center">

**[Documentation](https://github.com/yourusername/vue-streaming#readme) • [Examples](https://github.com/yourusername/vue-streaming/tree/main/examples) • [Issues](https://github.com/yourusername/vue-streaming/issues)**

Made with ❤️ for the Vue.js community

</div>
