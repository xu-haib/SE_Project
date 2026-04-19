<template>
  <div class="markdown-wrap" v-html="html" />
</template>

<script lang="ts" setup>
import { markdownHtml } from '@/utils/markdown'
import { onBeforeMount, ref } from 'vue'

const html = ref('')

const props = defineProps<{
  content: string
}>()

onBeforeMount(() => {
  markdownHtml(props.content).then((x) => {
    html.value = x
  })
})
</script>
