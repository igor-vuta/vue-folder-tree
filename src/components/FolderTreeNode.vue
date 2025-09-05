<template>
  <li
    class="ftree-item"
    :class="{ selected: isSelected }"
    role="treeitem"
    :aria-level="level"
    :aria-expanded="hasChildren ? isOpen : undefined"
    :tabindex="isSelected ? 0 : -1"
    @click.stop="onClick"
  >
    <div class="row">
      <button
        v-if="hasChildren"
        class="twisty"
        :class="{ open: isOpen }"
        :aria-label="isOpen ? 'Collapse' : 'Expand'"
        @click.stop="toggle"
      >
        ▸
      </button>

      <span class="icon" aria-hidden="true">{{ icon }}</span>

    

      <span class="name">{{ node.name }}</span>
    </div>

    <!-- Accordion transition with JS height hooks for smooth auto-height -->
    <transition
      name="accordion"
      @enter="onEnter"
      @after-enter="onAfterEnter"
      @leave="onLeave"
    >
      <ul v-if="isOpen" class="children" role="group">
        <FolderTreeNode
          v-for="child in node.children"
          :key="child.id"
          :node="child"
          :level="level + 1"
          :selected-id="selectedId"
          :expanded.sync="expanded"
          :icons="icons"
          :checkboxes="checkboxes"
          @select="$emit('select', $event)"
        />
      </ul>
    </transition>
  </li>
</template>

<script setup lang="ts">
import { computed, defineProps, defineEmits, ref } from 'vue'

export type TreeNode = {
  id: string | number
  name: string
  children?: TreeNode[]
  isLeaf?: boolean
}

const props = defineProps<{
  node: TreeNode
  level: number
  selectedId: string | number | null
  expanded: Record<string | number, boolean>
  icons?: { folder?: string; folderOpen?: string; file?: string }
  checkboxes?: boolean
}>()

const emit = defineEmits<{ (e: 'select', id: string | number | null): void }>()

const hasChildren = computed(() => !!(props.node.children && props.node.children.length))
const isOpen = computed({
  get: () => !!props.expanded[props.node.id],
  set: (v: boolean) => (props.expanded[props.node.id] = v),
})
const isSelected = computed(() => props.selectedId === props.node.id)
const checked = ref(false)

const icon = computed(() => {
  if (hasChildren.value) return isOpen.value ? (props.icons?.folderOpen ?? '📂') : (props.icons?.folder ?? '📁')
  return props.icons?.file ?? '📄'
})

function toggle() {
  if (hasChildren.value) isOpen.value = !isOpen.value
}
function onClick() {
  emit('select', props.node.id)
}

/** Accordion JS hooks for auto-height transitions */
function onEnter(el: Element) {
  const e = el as HTMLElement
  e.style.height = '0px'
  e.style.opacity = '0'
  e.style.overflow = 'hidden'
  const h = e.scrollHeight
  requestAnimationFrame(() => {
    e.style.transition = 'height 200ms ease, opacity 200ms ease'
    e.style.height = h + 'px'
    e.style.opacity = '1'
  })
}
function onAfterEnter(el: Element) {
  const e = el as HTMLElement
  e.style.height = 'auto'
  e.style.overflow = ''
  e.style.transition = ''
}
function onLeave(el: Element) {
  const e = el as HTMLElement
  const h = e.scrollHeight
  e.style.height = h + 'px'
  e.style.opacity = '1'
  e.style.overflow = 'hidden'
  requestAnimationFrame(() => {
    e.style.transition = 'height 180ms ease, opacity 180ms ease'
    e.style.height = '0px'
    e.style.opacity = '0'
  })
}
</script>

<style scoped>
.ftree-item {
  list-style: none;
  margin: 0;
  padding: 2px 2px 2px 0;
}
.row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 8px;
  border-radius: 10px;
  transition: background 120ms ease, outline-color 120ms ease;
}
.row:hover {
  background: var(--muted);
}
.ftree-item.selected > .row {
  background: var(--accent-weak);
  outline: 1px solid var(--accent-ring);
}

.twisty {
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text);
  cursor: pointer;
  padding: 2px 6px;
  border-radius: 6px;
  font-size: 12px;
  line-height: 1;
  transform: rotate(0deg);
  transition: transform 160ms ease, background 120ms ease, border-color 120ms ease;
}
.twisty:hover { background: var(--muted); }
.twisty.open  { transform: rotate(90deg); }

.icon { width: 1.2em; text-align: center; }
.name { user-select: none; color: var(--text); }
.check { display: grid; place-items: center; margin-right: 2px; }

.children {
  margin: 0 0 0 22px;
  padding-left: 12px;
  border-left: 1px dashed var(--border);
}

/* Accordion drop-down (JS sets heights for smoothness) */
.accordion-enter-from,
.accordion-leave-to { opacity: 0; }
.accordion-enter-to,
.accordion-leave-from { opacity: 1; }
</style>