<template>
  <ul class="base-list">
    <li
      class="base-list__item"
      v-for="(item, index) in items"
      :key="index"
    >
      <i :class="item.icon"></i>
      <span class="base-list__item__text">{{ item.text }}</span>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'BaseList',
  props: {
    items: {
      type: Array,
      required: true
    }
  }
}
</script>

<style>
  .base-list__item {
    padding-bottom: 16px;
  }

  .base-list__item__text {
    font-size: 14px;
    line-height: 1.3;
    padding-left: 12px;
  }
</style>
