declare module "js-streaming" {
  export interface StreamAPI {
    open(): Promise<void>;
    close(): Promise<void>;
    send?(data: unknown): void;
    on(event: "open", cb: () => void): () => void;
    on(event: "close", cb: () => void): () => void;
    on(event: "status", cb: (s: any) => void): () => void;
    on(event: "error", cb: (e: Error) => void): () => void;
    on(event: "message", cb: (m: unknown) => void): () => void;
    readonly state: Readonly<{
      status: any;
      error: Error | null;
      messages: unknown[];
      isOpen: boolean;
    }>;
  }
  export function createStream(options: any): StreamAPI;
}
