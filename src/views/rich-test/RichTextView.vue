<script setup>
import { Editor } from './Editor'
import { ref } from 'vue'

const plugins = [
  'advlist',
  'autolink',
  'colorpicker',
  'directionality',
  'fullscreen',
  'hr',
  'insertdatetime',
  'lists',
  'nonbreaking',
  'paste',
  'searchreplace',
  'tabfocus',
  'table',
  'textcolor',
  'textpattern',
  'visualblocks',
  'wordcount',
]
const fontSize = '14px 16px 18px 20px 22px 24px 26px 28px 30px 32px 34px 36px 48px 56px 72px'
const content_style = 'body { font-size: 18px; }'
const lineheight_formats = '1 1.2 1.5 1.6 1.8 2 2.4'

const initConfig = {
  plugins: plugins,
  toolbar: 'fontsizeselect | styleselect | bold italic underline strikethrough | forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat',
  content_style: content_style,
  fontsize_formats: fontSize,
  lineheight_formats: lineheight_formats,
  menubar: 'edit insert view format table tools'
}

const initConfig2 = {
  plugins: ['wordcount'],
  menubar: false,
  toolbar: 'fontsizeselect forecolor bold underline',
  content_style: content_style,
  fontsize_formats: fontSize,
}

const content = ref('')
const content2 = ref('这是第二个编辑器的内容')

function submitHandler() {
  console.log('第一个编辑器内容:', content.value)
  console.log('第二个编辑器内容:', content2.value)
}
</script>

<template>
  <Editor v-model="content" :init="initConfig"></Editor>
  <div style="margin-top: 30px; width: 450px;">
    <Editor v-model="content2" :init="initConfig2"></Editor>
  </div>
  <button @click="submitHandler">提交</button>
</template>

<style lang="less"></style>
