import ToggleList from '@tiptap/extension-blockquote' // blockquoteをトグルリストとして扱う
import Bold from '@tiptap/extension-bold'
import BulletList from '@tiptap/extension-bullet-list'
import CodeBlock from '@tiptap/extension-code-block'
import Document from '@tiptap/extension-document'
import HardBreak from '@tiptap/extension-hard-break'
import Heading from '@tiptap/extension-heading'
import Image from '@tiptap/extension-image'
import Italic from '@tiptap/extension-italic'
import Link from '@tiptap/extension-link'
import ListItem from '@tiptap/extension-list-item'
import OrderedList from '@tiptap/extension-ordered-list'
import Paragraph from '@tiptap/extension-paragraph'
import Placeholder from '@tiptap/extension-placeholder'
import Strike from '@tiptap/extension-strike'
import TaskItem from '@tiptap/extension-task-item'
import TaskList from '@tiptap/extension-task-list'
import Text from '@tiptap/extension-text'
import Underline from '@tiptap/extension-underline'
import type { Extensions } from '@tiptap/react'

import convertNodeTypeToPlaceHolder from './convertNodeTypeToPlaceHolder'
import type { Block } from '../../../types'

const extensions = (block: Block): Extensions => [
  Document,
  Text,
  Bold,
  Underline,
  Italic,
  Strike,
  Heading,
  Paragraph,
  BulletList,
  OrderedList,
  ListItem,
  TaskItem,
  TaskList,
  ToggleList,
  HardBreak,
  Image,
  Link.configure({
    shouldAutoLink: (url) => url.startsWith('https://') || url.startsWith('http://'),
  }).extend({
    inclusive: false,
  }),
  CodeBlock.configure({
    languageClassPrefix: 'language-',
  }),
  Placeholder.configure({
    placeholder: ({ node, editor }) => {
      return convertNodeTypeToPlaceHolder({ node, editor, block })
    },
  }),
]
export default extensions
