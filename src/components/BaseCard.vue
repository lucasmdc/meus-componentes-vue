<template>
  <div class="base-card" :style="getCardWidthForCSS">
    <div class="base-card__top">
      <slot name="baseCardTop"></slot>
    </div>
    <div class="base-card__content">
      <h2 class="base-card__content__title">{{ title }}</h2>
      <p
        class="base-card__content__text"
        v-html="text">
      </p>
      <slot name="baseCardContentAppend"></slot>
      <div class="base-card__content__actions">
        <button class="base-card__content__action">
          Ver mais
        </button>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'BaseCard',
  props: {
    title: {
      type: String,
      default: ''
    },
    text: {
      type: String,
      default: ''
    },
    cardWidth: {
      type: Number,
      required: true
    }
  },
  computed: {
    getCardWidthForCSS () {
      return {
        '--card-width': `${this.cardWidth}px`
      }
    }
  }
}
</script>

<style scoped>
  .base-card {
    background-color: #fff;
    display: flex;
    flex-direction: column;
    margin: 0 12px 24px;
    width: var(--card-width)
  }

  .base-card__top,
  .base-card__content {
    background-color: inherit;
    border-radius: 16px;
    overflow: hidden;
  }

  .base-card__top {
    border-radius: 16px 16px 0 0;
  }

  .base-card__content {
    box-shadow:  -4px 4px 24px -4px rgb(170 170 170 / .57);
    border-radius: 0 0 16px 16px;
    padding: 24px 32px;
    position: relative;
    z-index: 1;
  }

  .base-card__content__title {
    font-size: 32px;
    line-height: 1.2;
    padding-bottom: 4px;
  }

  .base-card__content__text {
    color: #707070;
    font-size: 16px;
    line-height: 1.2;
    padding-bottom: 16px;
  }

  .base-card__content__details__item {
    padding-bottom: 16px;
  }

  .base-card__content__detail {
    font-size: 14px;
    line-height: 1.3;
    padding-left: 12px;
  }

  .base-card__content__actions {
    margin-top: 26px;
  }

  .base-card__content__action {
    background-color: transparent;
    border-radius: 16px;
    border: 1px solid #aaa;
    color: #aaa;
    font-weight: 700;
    line-height: 1.3;
    padding: 16px;
    width: 100%;
  }

</style>
