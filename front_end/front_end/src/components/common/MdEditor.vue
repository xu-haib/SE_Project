<template>
  <casket-star
    v-model="value"
    :lang="lang"
    :plugins="plugins"
    :show-editor="showEditor"
    :show-viewer="showViewer"
    :height="height"
  />
</template>

<script setup lang="ts">
import { CasketStar, getDefaultPlugins, zhCN, enUS, markdown, markdownLanguage } from 'casket-star'

import { getRemarkPlugins, getRehypePlugins, getRemarkRehypeOptions } from '@/utils/markdown'
import { codemirrorMath } from '@/utils/codemirror-math'

import { useConfig } from '@/stores/config'

import { onBeforeMount, ref } from 'vue'

const config = useConfig()
const lang = ref(config.userLang === 'zh-CN' ? zhCN : zhCN)

const props = withDefaults(
  defineProps<{
    narrow?: boolean | 'auto',
    height?: string,
  }>(),
  {
    narrow: 'auto',
    height: '300px',
  },
)
const value = defineModel<string>({ required: true })

const showEditor = ref(true)
const showViewer = ref(true)

const plugins = getDefaultPlugins()

// Drop default plugin settings
plugins.remark = getRemarkPlugins()
plugins.rehype = getRehypePlugins()
plugins.remarkRehypeOptions = getRemarkRehypeOptions()

// Config markdown language in Codemirror
plugins.codemirror = [
  markdown({
    base: markdownLanguage, // Use GFM as base
    extensions: [
      { remove: ['HTMLBlock', 'HTMLTag'] }, // Avoid resolving HTML in the Editor
      codemirrorMath, // Resolve math equations
    ],
    completeHTMLTags: false, // Avoid resolving HTML in the Editor
  }),
]

onBeforeMount(() => {
  const mobile = window.innerWidth <= 576
  if ((props.narrow === 'auto' && mobile) || props.narrow === true) {
    showViewer.value = false

    // Remove left toolbar for more spaces
    plugins.toolbarL = []
  }
})
</script>
