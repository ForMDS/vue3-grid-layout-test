<script setup>
import {ref} from 'vue'
import {GridLayout, GridItem} from 'vue3-grid-layout'

const layout = ref([
  {"x": 0, "y": 0, "w": 2, "h": 2, "i": "0"},
  {"x": 2, "y": 0, "w": 2, "h": 4, "i": "1"},
  {"x": 4, "y": 0, "w": 2, "h": 5, "i": "2"},
  {"x": 6, "y": 0, "w": 2, "h": 3, "i": "3"},
  {"x": 8, "y": 0, "w": 2, "h": 3, "i": "4"},
  {"x": 10, "y": 0, "w": 2, "h": 3, "i": "5"},
  {"x": 0, "y": 5, "w": 2, "h": 5, "i": "6"},
  {"x": 2, "y": 5, "w": 2, "h": 5, "i": "7"},
  {"x": 4, "y": 5, "w": 2, "h": 5, "i": "8"},
  {"x": 6, "y": 3, "w": 2, "h": 4, "i": "9"},
  {"x": 8, "y": 4, "w": 2, "h": 4, "i": "10"},
])
</script>

<template>
  <grid-layout
    :layout.sync="layout"
    :col-num="12"
    :row-height="30"
    :is-draggable="true"
    :is-resizable="true"
    :is-mirrored="false"
    :vertical-compact="true"
    :margin="[10, 10]"
    :use-css-transforms="true"
  >
    <grid-item
      v-for="item in layout"
      :x="item.x"
      :y="item.y"
      :w="item.w"
      :h="item.h"
      :i="item.i"
      :key="item.i">
      <div class="item-content">{{ item.i }}</div>
    </grid-item>
  </grid-layout>
</template>

<style scoped>
.item-content {
  background-color: #42b983;
  color: white;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
}
</style>
