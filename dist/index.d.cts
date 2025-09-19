import * as vue from 'vue';
import { PropType } from 'vue';

type StreamType = "websocket" | "sse" | "http" | "long-polling" | "hls" | "webrtc";
type StreamStatus = "idle" | "connecting" | "open" | "closing" | "closed" | "error";
type AnyConfig = Record<string, unknown>;
type HLSConfig = Omit<AnyConfig, "type" | "video">;
type WebRTCConfig = Omit<AnyConfig, "type" | "onTrack"> & {
    attachVideo?: boolean;
};
interface BaseOptions {
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
type Message = unknown;
interface StreamState {
    status: StreamStatus;
    error: Error | null;
    messages: Message[];
    isOpen: boolean;
}
interface StreamAdapter {
    open(): Promise<void> | void;
    close(): Promise<void> | void;
    send?(data: unknown): void;
}
type ListenerMap = {
    open: (() => void)[];
    close: (() => void)[];
    error: ((err: Error) => void)[];
    message: ((msg: Message) => void)[];
    status: ((s: StreamStatus) => void)[];
};
interface StreamAPI {
    open(): Promise<void>;
    close(): Promise<void>;
    send?(data: unknown): void;
    on<T extends keyof ListenerMap>(evt: T, cb: ListenerMap[T][number]): () => void;
    off<T extends keyof ListenerMap>(evt: T, cb: ListenerMap[T][number]): void;
    readonly state: Readonly<StreamState>;
}

declare const _default: vue.DefineComponent<vue.ExtractPropTypes<{
    type: {
        type: PropType<StreamType>;
        required: true;
    };
    config: {
        type: PropType<AnyConfig>;
        required: true;
    };
    autoOpen: {
        type: BooleanConstructor;
        default: boolean;
    };
    autoplay: {
        type: BooleanConstructor;
        default: boolean;
    };
    controls: {
        type: BooleanConstructor;
        default: boolean;
    };
    playsInline: {
        type: BooleanConstructor;
        default: boolean;
    };
    muted: {
        type: BooleanConstructor;
        default: boolean;
    };
    logLimit: {
        type: NumberConstructor;
        default: number;
    };
    videoAttrs: {
        type: PropType<Partial<HTMLVideoElement>>;
        default: () => {};
    };
}>, () => vue.VNode<vue.RendererNode, vue.RendererElement, {
    [key: string]: any;
}>, {}, {}, {}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, ("open" | "error" | "close" | "message" | "status")[], "open" | "error" | "close" | "message" | "status", vue.PublicProps, Readonly<vue.ExtractPropTypes<{
    type: {
        type: PropType<StreamType>;
        required: true;
    };
    config: {
        type: PropType<AnyConfig>;
        required: true;
    };
    autoOpen: {
        type: BooleanConstructor;
        default: boolean;
    };
    autoplay: {
        type: BooleanConstructor;
        default: boolean;
    };
    controls: {
        type: BooleanConstructor;
        default: boolean;
    };
    playsInline: {
        type: BooleanConstructor;
        default: boolean;
    };
    muted: {
        type: BooleanConstructor;
        default: boolean;
    };
    logLimit: {
        type: NumberConstructor;
        default: number;
    };
    videoAttrs: {
        type: PropType<Partial<HTMLVideoElement>>;
        default: () => {};
    };
}>> & Readonly<{
    onOpen?: ((...args: any[]) => any) | undefined;
    onError?: ((...args: any[]) => any) | undefined;
    onClose?: ((...args: any[]) => any) | undefined;
    onMessage?: ((...args: any[]) => any) | undefined;
    onStatus?: ((...args: any[]) => any) | undefined;
}>, {
    playsInline: boolean;
    autoplay: boolean;
    controls: boolean;
    muted: boolean;
    autoOpen: boolean;
    logLimit: number;
    videoAttrs: Partial<HTMLVideoElement>;
}, {}, {}, {}, string, vue.ComponentProvideOptions, true, {}, any>;

export { type AnyConfig, type BaseOptions, type HLSConfig, type ListenerMap, type Message, type StreamAPI, type StreamAdapter, _default as StreamPlayer, type StreamState, type StreamStatus, type StreamType, _default as StreamingPlayer, type WebRTCConfig };
