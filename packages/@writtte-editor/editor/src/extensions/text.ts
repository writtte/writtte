import { type AnyExtension, Node } from '@tiptap/core';

const TextExtension: AnyExtension = Node.create({
  name: 'text',
  group: 'inline',
});

export { TextExtension };
