<template>
  <div class="modal-overlay" @click.self="close" @keydown.esc="close">
    <div class="modal" role="dialog" :aria-label="title">
      <header class="modal-header">
        <h3>{{ title }}</h3>
      </header>

      <div class="modal-content">
        <slot />
      </div>

      <footer class="modal-footer">
        <button class="btn primary" @click="ok">OK</button>
        <button class="btn" @click="close">Close</button>
      </footer>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, onBeforeUnmount } from 'vue';

export default defineComponent({
  name: 'Modal',
  props: {
    title: { type: String, required: true },
  },
  emits: ['close', 'ok'],
  setup(_, { emit }) {
    const close = () => emit('close');
    const ok = () => emit('ok');

    // prevent body scroll while modal is open
    onMounted(() => {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      onBeforeUnmount(() => (document.body.style.overflow = prev));
    });

    return { close, ok };
  },
});
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(14, 18, 27, 0.65);
  display: grid;
  place-items: center;
  z-index: 1000;
  animation: overlayFade 150ms ease;
}

.modal {
  background: #ffffff;
  border-radius: 12px;
  padding: 20px;
  width: min(520px, 92vw);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.35);
  animation: modalPop 180ms cubic-bezier(.2,.8,.2,1);
}

.modal-header {
  margin-bottom: 14px;
  text-align: center;
}
.modal-header h3 {
  margin: 0;
  font-size: 20px;
  font-weight: 700;
}

.modal-content {
  max-height: min(66vh, 520px);
  overflow: auto;
  padding: 4px 2px 10px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding-top: 6px;
}

.btn {
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text);
  padding: 10px 16px;
  border-radius: 10px;
  cursor: pointer;
  transition: background 120ms ease, border-color 120ms ease, transform 80ms;
}
.btn:hover   { background: var(--muted); }
.btn:active  { transform: translateY(1px); }
.btn.primary { background: var(--accent); color: #fff; border-color: var(--accent); }
.btn.primary:hover { filter: brightness(0.98); }

@keyframes overlayFade {
  from { opacity: 0; }
  to   { opacity: 1; }
}
@keyframes modalPop {
  from { opacity: 0; transform: translateY(8px) scale(0.98); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}
</style>