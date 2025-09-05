<template>
  <ul class="ftree root" role="tree" aria-label="Folder tree" @keydown.stop.prevent="onKeydown">
    <FolderTreeNode
      v-for="node in nodes"
      :key="node.id"
      :node="node"
      :level="1"
      :selected-id="selectedId"
      :expanded.sync="expanded"
      :icons="icons"
      :checkboxes="checkboxes"
      @select="handleSelect"
    />
  </ul>
</template>

<script setup lang="ts">
import { ref, watch, defineProps, defineEmits } from 'vue'
import FolderTreeNode from './FolderTreeNode.vue'

export type TreeNode = {
  id: string | number
  name: string
  children?: TreeNode[]
  isLeaf?: boolean
}

const props = defineProps<{
  nodes: TreeNode[]
  modelValue?: string | number | null
  icons?: { folder?: string; folderOpen?: string; file?: string }
  checkboxes?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', id: string | number | null): void
  (e: 'select', id: string | number | null): void
}>()

const selectedId = ref<string | number | null>(props.modelValue ?? null)
watch(() => props.modelValue, v => (selectedId.value = v ?? null))

const expanded = ref<Record<string | number, boolean>>({})

function handleSelect(id: string | number | null) {
  selectedId.value = id
  emit('update:modelValue', id)
  emit('select', id)
}

// Keyboard navigation (roving tabindex)
const flatIds = ref<(string|number)[]>([])
function collectIds(nodes: TreeNode[]) {
  const out: (string|number)[] = []
  function walk(arr: TreeNode[]) {
    for (const n of arr) {
      out.push(n.id)
      if (expanded.value[n.id] && n.children?.length) walk(n.children)
    }
  }
  walk(nodes)
  return out
}

function onKeydown(e: KeyboardEvent) {
  flatIds.value = collectIds(props.nodes)
  const idx = flatIds.value.indexOf(selectedId.value as any)
  const current = idx >= 0 ? idx : 0
  switch (e.key) {
    case 'ArrowDown':
      handleSelect(flatIds.value[Math.min(current + 1, flatIds.value.length - 1)])
      break
    case 'ArrowUp':
      handleSelect(flatIds.value[Math.max(current - 1, 0)])
      break
    case 'Home':
      handleSelect(flatIds.value[0]); break
    case 'End':
      handleSelect(flatIds.value[flatIds.value.length - 1]); break
    case 'Enter':
    case ' ':
      if (selectedId.value != null)
        expanded.value[selectedId.value] = !expanded.value[selectedId.value]
      break
  }
}
</script>

<style scoped>
.ftree {
  list-style: none;
  margin: 0;
  padding-left: 0;
  font: 14px/1.5 system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
}
.root {
  padding: 8px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 14px;
  box-shadow: 0 8px 30px rgba(15, 23, 42, .06);
}
</style>