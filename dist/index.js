import { defineComponent, ref, shallowRef, onMounted, onBeforeUnmount, watch, h } from 'vue';
import { createStream } from 'js-streaming';

// src/components/StreamPlayer.ts
var StreamPlayer_default = defineComponent({
  name: "StreamPlayer",
  props: {
    type: { type: String, required: true },
    config: { type: Object, required: true },
    autoOpen: { type: Boolean, default: false },
    autoplay: { type: Boolean, default: false },
    controls: { type: Boolean, default: true },
    playsInline: { type: Boolean, default: true },
    muted: { type: Boolean, default: false },
    logLimit: { type: Number, default: 500 },
    videoAttrs: {
      type: Object,
      default: () => ({})
    }
  },
  emits: ["open", "close", "status", "error", "message"],
  setup(props, { emit, slots, expose }) {
    const status = ref("idle");
    const isOpen = ref(false);
    const error = ref(null);
    const messages = shallowRef([]);
    const videoRef = ref(null);
    let api = null;
    let unsubs = [];
    function destroyAPI() {
      try {
        api?.close();
      } catch {
      }
      for (const off of unsubs) off();
      unsubs = [];
      api = null;
      isOpen.value = false;
    }
    function bindAPI(a) {
      const onOpen = () => {
        isOpen.value = true;
        emit("open");
      };
      const onClose = () => {
        isOpen.value = false;
        emit("close");
      };
      const onStatus = (s) => {
        status.value = s;
        emit("status", s);
      };
      const onError = (e) => {
        error.value = e;
        emit("error", e);
      };
      const onMessage = (m) => {
        const next = messages.value.slice();
        next.push(m);
        const limit = props.logLimit ?? 500;
        messages.value = next.length > limit ? next.slice(next.length - limit) : next;
        emit("message", m);
      };
      unsubs.push(a.on("open", onOpen));
      unsubs.push(a.on("close", onClose));
      unsubs.push(a.on("status", onStatus));
      unsubs.push(a.on("error", onError));
      unsubs.push(a.on("message", onMessage));
      if (a.off) {
        unsubs.push(() => {
          a.off("open", onOpen);
          a.off("close", onClose);
          a.off("status", onStatus);
          a.off("error", onError);
          a.off("message", onMessage);
        });
      }
    }
    function buildOptions() {
      const base = { ...props.config };
      if (props.type === "hls") {
        const cfg = base;
        if (videoRef.value) {
          videoRef.value.autoplay = props.autoplay;
          videoRef.value.controls = props.controls;
          videoRef.value.playsInline = props.playsInline;
          videoRef.value.muted = props.muted;
        }
        return { type: "hls", ...cfg, video: videoRef.value };
      }
      if (props.type === "webrtc") {
        const cfg = base;
        const attachVideo = cfg.attachVideo !== false;
        const onTrack = (ms) => {
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
      const newApi = createStream(opts);
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
    function send(d) {
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
    return () => {
      const children = [];
      if (props.type === "hls" || props.type === "webrtc") {
        children.push(
          h("video", {
            ref: videoRef,
            playsinline: props.playsInline,
            controls: props.controls,
            autoplay: props.autoplay,
            muted: props.muted,
            ...props.videoAttrs,
            style: "width:100%;border-radius:12px;"
          })
        );
      } else {
        const lines = (messages.value || []).map(
          (m, i) => h(
            "div",
            { key: i, style: "white-space:pre-wrap;word-break:break-word;" },
            typeof m === "string" ? m : JSON.stringify(m)
          )
        );
        const logBox = h(
          "div",
          {
            style: "background:#0b1322;color:#e5e7eb;border:1px solid #1f2937;border-radius:10px;padding:8px;max-height:260px;overflow:auto;font:12px/1.5 ui-monospace,monospace;"
          },
          lines
        );
        children.push(
          slots.log ? slots.log({
            messages: messages.value,
            status: status.value,
            error: error.value
          }) : logBox
        );
      }
      children.push(
        h(
          "div",
          { style: "display:flex;gap:8px;flex-wrap:wrap;" },
          slots.actions ? slots.actions({
            open,
            close,
            send,
            isOpen: isOpen.value,
            status: status.value
          }) : []
        )
      );
      return h(
        "div",
        { class: "usp", style: "display:grid;gap:8px;" },
        children
      );
    };
  }
});

export { StreamPlayer_default as StreamPlayer, StreamPlayer_default as StreamingPlayer };
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map