import {
  defineComponent,
  h,
  ref,
  shallowRef,
  watch,
  onMounted,
  onBeforeUnmount,
  type PropType,
} from "vue";

// Import the core streaming functionality without its types
import { createStream } from "js-streaming";

// Import local type definitions
import type {
  StreamAPI,
  StreamStatus,
  StreamType,
  AnyConfig,
  HLSConfig,
  WebRTCConfig,
} from "../types";

export default defineComponent({
  name: "StreamPlayer",
  props: {
    type: { type: String as PropType<StreamType>, required: true },
    config: { type: Object as PropType<AnyConfig>, required: true },
    autoOpen: { type: Boolean, default: false },
    autoplay: { type: Boolean, default: false },
    controls: { type: Boolean, default: true },
    playsInline: { type: Boolean, default: true },
    muted: { type: Boolean, default: false },
    logLimit: { type: Number, default: 500 },
    videoAttrs: {
      type: Object as PropType<Partial<HTMLVideoElement>>,
      default: () => ({}),
    },
  },
  emits: ["open", "close", "status", "error", "message"],
  setup(props, { emit, slots, expose }) {
    const status = ref<StreamStatus>("idle");
    const isOpen = ref(false);
    const error = ref<Error | null>(null);
    const messages = shallowRef<unknown[]>([]);
    const videoRef = ref<HTMLVideoElement | null>(null);

    let api: StreamAPI | null = null;
    let unsubs: Array<() => void> = [];

    function destroyAPI() {
      try {
        api?.close();
      } catch {}
      for (const off of unsubs) off();
      unsubs = [];
      api = null;
      isOpen.value = false;
    }

    function bindAPI(a: StreamAPI & { off?: StreamAPI["off"] }) {
      const onOpen = () => {
        isOpen.value = true;
        emit("open");
      };
      const onClose = () => {
        isOpen.value = false;
        emit("close");
      };
      const onStatus = (s: StreamStatus) => {
        status.value = s;
        emit("status", s);
      };
      const onError = (e: Error) => {
        error.value = e;
        emit("error", e);
      };
      const onMessage = (m: unknown) => {
        const next = messages.value.slice();
        next.push(m);
        const limit = props.logLimit ?? 500;
        messages.value =
          next.length > limit ? next.slice(next.length - limit) : next;
        emit("message", m);
      };

      unsubs.push(a.on("open", onOpen));
      unsubs.push(a.on("close", onClose));
      unsubs.push(a.on("status", onStatus));
      unsubs.push(a.on("error", onError));
      unsubs.push(a.on("message", onMessage));

      if (a.off) {
        unsubs.push(() => {
          a.off!("open", onOpen);
          a.off!("close", onClose);
          a.off!("status", onStatus);
          a.off!("error", onError);
          a.off!("message", onMessage);
        });
      }
    }

    function buildOptions(): any {
      const base = { ...(props.config as any) };

      if (props.type === "hls") {
        const cfg = base as HLSConfig;
        if (videoRef.value) {
          videoRef.value.autoplay = props.autoplay;
          videoRef.value.controls = props.controls;
          videoRef.value.playsInline = props.playsInline;
          videoRef.value.muted = props.muted;
        }
        return { type: "hls", ...cfg, video: videoRef.value! };
      }

      if (props.type === "webrtc") {
        const cfg = base as WebRTCConfig;
        const attachVideo = cfg.attachVideo !== false;
        const onTrack = (ms: MediaStream) => {
          if (attachVideo && videoRef.value) {
            videoRef.value.srcObject = ms;
            videoRef.value.autoplay = props.autoplay;
            videoRef.value.controls = props.controls;
            videoRef.value.playsInline = props.playsInline;
            videoRef.value.muted = props.muted;
          }
        };
        return { type: "webrtc", ...cfg, onTrack };
      }

      return { type: props.type, ...base };
    }

    async function instantiate() {
      destroyAPI();
      const opts = buildOptions();
      const newApi = createStream(opts) as StreamAPI & {
        off?: StreamAPI["off"];
      };
      api = newApi;
      bindAPI(newApi);
      if (props.autoOpen) await newApi.open();
    }

    function open() {
      api?.open();
    }
    function close() {
      api?.close();
    }
    function send(d: unknown) {
      api?.send?.(d);
    }

    expose({ open, close, send, status, isOpen, error, messages });

    onMounted(() => {
      void instantiate();
    });
    onBeforeUnmount(() => {
      destroyAPI();
    });

    watch(
      () => [props.type, props.config],
      () => {
        void instantiate();
      },
      { deep: true }
    );

    // render (بدون SFC)
    return () => {
      const children: any[] = [];

      if (props.type === "hls" || props.type === "webrtc") {
        children.push(
          h("video", {
            ref: videoRef,
            playsinline: props.playsInline,
            controls: props.controls,
            autoplay: props.autoplay,
            muted: props.muted,
            ...props.videoAttrs,
            style: "width:100%;border-radius:12px;",
          })
        );
      } else {
        const lines = (messages.value || []).map((m, i) =>
          h(
            "div",
            { key: i, style: "white-space:pre-wrap;word-break:break-word;" },
            typeof m === "string" ? m : JSON.stringify(m)
          )
        );
        const logBox = h(
          "div",
          {
            style:
              "background:#0b1322;color:#e5e7eb;border:1px solid #1f2937;border-radius:10px;padding:8px;max-height:260px;overflow:auto;font:12px/1.5 ui-monospace,monospace;",
          },
          lines
        );
        children.push(
          slots.log
            ? slots.log({
                messages: messages.value,
                status: status.value,
                error: error.value,
              })
            : logBox
        );
      }

      children.push(
        h(
          "div",
          { style: "display:flex;gap:8px;flex-wrap:wrap;" },
          slots.actions
            ? slots.actions({
                open,
                close,
                send,
                isOpen: isOpen.value,
                status: status.value,
              })
            : []
        )
      );

      return h(
        "div",
        { class: "usp", style: "display:grid;gap:8px;" },
        children
      );
    };
  },
});
