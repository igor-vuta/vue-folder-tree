<template>
  <main class="app">
    <h1>Vue Folder Tree</h1>

    <div class="grid">
      <div class="pane">
        <FolderTree v-model="selectedId" :nodes="folders" :checkboxes="true" @select="updateSelected"/>
      </div>

      <div class="pane details">
        <h2>Selected</h2>

        <div v-if="selected">
          <div class="meta">
            <span class="badge" :class="selected.isLeaf ? 'file' : 'folder'">
              {{ selected.isLeaf ? 'File' : 'Folder' }}
            </span>
          </div>

          <div class="field">
            <label>Name</label>
            <div class="value">{{ selected.name }}</div>
          </div>

          <div class="field">
            <label>ID</label>
            <div class="value mono">{{ selected.id }}</div>
          </div>

          <div class="field">
            <label>Path</label>
            <div class="value mono">{{ selectedPath.join(' / ') }}</div>
          </div>
        </div>

        <div v-else class="placeholder">Nothing selected</div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import FolderTree from './components/FolderTree.vue'
import type { TreeNode } from './components/FolderTree.vue'
import { mockFolders } from './mockFolders'

const folders = mockFolders
const selectedId = ref<string | number | null>(folders[0]?.id ?? null)
const selected = ref<TreeNode | null>(null)
const selectedPath = ref<string[]>([])

function findPath(nodes: TreeNode[], id: string | number) {
  const stack: { node: TreeNode; path: string[] }[] = nodes.map(n => ({ node: n, path: [n.name] }))
  while (stack.length) {
    const { node, path } = stack.pop()!
    if (node.id === id) return { node, path }
    node.children?.forEach(c => stack.push({ node: c, path: [...path, c.name] }))
  }
  return null
}

function updateSelected(id: string | number | null) {
  if (id == null) { selected.value = null; selectedPath.value = []; return }
  const res = findPath(folders, id)
  selected.value = res?.node ?? null
  selectedPath.value = res?.path ?? []
}

// init
updateSelected(selectedId.value as any)
</script>

<style scoped>
.app { padding: 28px; }
h1 { font-size: 34px; margin: 0 0 18px; }
.grid { display: grid; grid-template-columns: 1.4fr 1fr; gap: 18px; }
.pane {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 14px;
  box-shadow: 0 8px 30px rgba(15, 23, 42, .06);
}
.details h2 { margin: 4px 0 12px; }

.meta { margin-bottom: 10px; }
.badge {
  display: inline-flex; align-items: center;
  padding: 4px 10px; border-radius: 999px;
  font-size: 12px; border: 1px solid var(--border);
  background: var(--muted); color: var(--text-muted);
}
.badge.file   { background: #eef6ff; border-color: #d4e4ff; color: #1e3a8a; }
.badge.folder { background: #ecfdf5; border-color: #ccefe3; color: #065f46; }

.field { margin: 10px 0; }
.field label { display: block; font-size: 12px; color: var(--text-muted); margin-bottom: 4px; }
.value {
  background: var(--muted); border: 1px solid var(--border);
  border-radius: 10px; padding: 8px 10px;
}
.mono { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace; }
.placeholder { color: var(--text-muted); }
@media (max-width: 820px){ .grid { grid-template-columns: 1fr; } }
</style>