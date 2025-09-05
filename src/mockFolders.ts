export type TreeNode = {
  id: number | string;
  name: string;
  children?: TreeNode[];
  isLeaf?: boolean;
}

export const mockFolders: TreeNode[] = [
  {
    id: 1, name: 'Projects', children: [
      { id: 2, name: 'website', children: [
        { id: 3, name: 'index.html', isLeaf: true },
        { id: 4, name: 'styles', children: [
          { id: 5, name: 'main.css', isLeaf: true }
        ]}
      ]},
      { id: 6, name: 'api', children: [
        { id: 7, name: 'app.ts', isLeaf: true },
        { id: 8, name: 'routes', children: [
          { id: 9, name: 'users.ts', isLeaf: true }
        ]}
      ]}
    ]
  },
  {
    id: 10, name: 'Documents', children: [
      { id: 11, name: 'Resume.pdf', isLeaf: true },
      { id: 12, name: 'CoverLetter.md', isLeaf: true }
    ]
  }
]
