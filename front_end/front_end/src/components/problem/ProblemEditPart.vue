<template>
  <el-form-item>
    <template #label>
      <div class="label-container">
        {{ label }}
        <font-awesome-icon :icon="faXmark" v-if="value !== undefined" @click="value = undefined" />
      </div>
    </template>

    <template v-if="value !== undefined">
      <md-editor class="editor" v-model="value" />
    </template>
    <template v-else>
      <el-button type="primary" @click="value = ''">创建</el-button>
    </template>
  </el-form-item>
</template>

<script setup lang="ts">
import MdEditor from '../common/MdEditor.vue'

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'

const _props = defineProps<{
  label: string
}>()

const value = defineModel<string | undefined>({
  required: true,
})
</script>

<style lang="scss" scoped>
.editor {
  width: 100%;
  line-height: 1;
  overscroll-behavior: contain;
}
</style>
