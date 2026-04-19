import { unified, type PluggableList } from 'unified'

import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import remarkRehype from 'remark-rehype'

import rehypeKatex from 'rehype-katex'
import rehypeStringify from 'rehype-stringify'

// Pack up render plugins to avoid differences between casket-viewer and actual rendering
export const getRemarkPlugins: () => PluggableList = () => {
  return [
    remarkGfm,
    remarkMath, // Support Math (use KaTeX as Engine)
  ]
}

export const getRehypePlugins: () => PluggableList = () => {
  // Support `\gdef` in KaTeX
  const macros = {}
  return [[rehypeKatex, { macros: macros, output: 'html' }]]
}

export const getRemarkRehypeOptions: () => object = () => {
  return {}
}

const getProcessor = () => {
  const remarkPlugins = getRemarkPlugins()
  const rehypePlugins = getRehypePlugins()
  const options = getRemarkRehypeOptions()
  return unified()
    .use(remarkParse)
    .use(remarkPlugins)
    .use(remarkRehype, options)
    .use(rehypePlugins)
    .use(rehypeStringify, { allowDangerousHtml: true })
}

export const markdownHtml = async (content: string) =>
  getProcessor()
    .process(content)
    .then((x) => String(x))
