export type StreamType =
  | "websocket"
  | "sse"
  | "http"
  | "long-polling"
  | "hls"
  | "webrtc";

export type StreamStatus =
  | "idle"
  | "connecting"
  | "open"
  | "closing"
  | "closed"
  | "error";

// مرن علشان مانعتمدش على js-streaming في الـ DTS
export type AnyConfig = Record<string, unknown>;

// HLS: الفيديو بيتوفر من الكومبوننت
export type HLSConfig = Omit<AnyConfig, "type" | "video">;

// WebRTC: onTrack داخلي + attachVideo اختياري
export type WebRTCConfig = Omit<AnyConfig, "type" | "onTrack"> & {
  attachVideo?: boolean;
};

export interface BaseOptions {
  type: StreamType;
  bufferLimit?: number;
  autoReconnect?: boolean;
  maxRetries?: number;
  heartbeatMs?: number;
  backoff?: {
    baseMs?: number;
    maxMs?: number;
    factor?: number;
    jitter?: boolean;
  };
}

export type Message = unknown;

export interface StreamState {
  status: StreamStatus;
  error: Error | null;
  messages: Message[];
  isOpen: boolean;
}

export interface StreamAdapter {
  open(): Promise<void> | void;
  close(): Promise<void> | void;
  send?(data: unknown): void; // لبعض الأنواع زي WS/WebRTC
}

export type ListenerMap = {
  open: (() => void)[];
  close: (() => void)[];
  error: ((err: Error) => void)[];
  message: ((msg: Message) => void)[];
  status: ((s: StreamStatus) => void)[];
};

export interface StreamAPI {
  open(): Promise<void>;
  close(): Promise<void>;
  send?(data: unknown): void;
  on<T extends keyof ListenerMap>(
    evt: T,
    cb: ListenerMap[T][number]
  ): () => void;
  off<T extends keyof ListenerMap>(evt: T, cb: ListenerMap[T][number]): void;
  readonly state: Readonly<StreamState>;
}
