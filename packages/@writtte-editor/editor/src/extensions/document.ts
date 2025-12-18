import { type AnyExtension, Node } from '@tiptap/core';

const DocumentExtension: AnyExtension = Node.create({
  name: 'document',
  topNode: true,
  content: 'block+',
});

export { DocumentExtension };
