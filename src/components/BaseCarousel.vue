<template>
  <ul
    class="base-carousel"
    :id="CAROUSEL_ID"
    @mousedown.prevent="onPressCarousel"
    @mouseup="onUnpressCarousel"
    @mousemove="onMoveCarousel"
    @mouseleave="onLeaveCarousel"
    :style="{...getCarouselMoveToNext, ...getItemWidthForCSS}"
  >
    <li
      class="base-carousel__item"
      v-for="(item, index) in items"
      :key="index"
      :data-carousel-item-index="index"
      :data-carousel-has-mouse-down="parseInt(index) === CAROUSEL_ITEM_ACTIVE && hasPressCarousel"
      :data-carousel-item-active="parseInt(index) === CAROUSEL_ITEM_ACTIVE ? true : false"
    >
      <button
        class="base-carousel__like"
        @click="item.isLiked = !item.isLiked"
        :style="getCarouselMoveToNextActions"
      >
        <i
          class="like-icon"
          :class="{
            like: item.isLiked
          }"
        >
        </i>
      </button>
      <img :src="item.imgSrc">
    </li>
    <li
      class="base-carousel__actions"
      :style="getCarouselMoveToNextActions"
    >
      <ul class="base-carousel__actions__nav">
        <li
          class="base-carousel__actions__nav__item"
          v-for="(item, index) in items"
          :key="index"
          :data-carousel-item-index="index"
          :data-carousel-item-active="parseInt(index) === CAROUSEL_ITEM_ACTIVE ? true : false"
        >
          <button @click="onNavigationCarousel"></button>
        </li>
      </ul>
    </li>
  </ul>
</template>

<script>

export default {
  name: 'BaseCarousel',
  data () {
    return {
      CAROUSEL_ID: (_ => `base-carousel-${crypto.getRandomValues(new Uint32Array(1))}`)(),
      CAROUSEL_DOM: null,
      CAROUSEL_ITEM_ACTIVE: 0,
      hasPressCarousel: false,
      currentX: 0,
      moveCarouselX: 0
    }
  },
  props: {
    items: {
      type: Array,
      required: true
    },
    itemWidth: {
      type: Number,
      required: true
    }
  },
  computed: {
    getItemWidthForCSS () {
      return {
        '--item-width': `${this.itemWidth}px`
      }
    },
    getTotalCarouselWidth () {
      return (this.items.length - 1) * this.itemWidth
    },
    getTranslateValue () {
      return this.itemWidth * this.CAROUSEL_ITEM_ACTIVE
    },
    getMoveOnMouse () {
      return Math.abs(this.getTranslateValue + this.moveCarouselX)
    },
    getCarouselMoveToNext () {
      return {
        transform: `translateX(-${this.getMoveOnMouse}px)`
      }
    },
    getCarouselMoveToNextActions () {
      return {
        right: this.getTranslateValue !== 0 ? `-${this.getTranslateValue - 16}px` : '16px'
      }
    },
    getMiddleX () {
      return (this.itemWidth / 2) + this.CAROUSEL_DOM.offsetLeft
    },
    getMoveCarouselXDirection () {
      return this.hasOverMiddleX ? 'left' : 'right'
    },
    hasOverMiddleX () {
      return this.getMiddleX > this.currentX
    }
  },
  methods: {
    getCurrentXOf (event) {
      const type = event.type

      if (type.includes('touchend')) {
        return event.changedTouches[0].clientX
      } else if (type.includes('touch')) {
        return event.touches[0].clientX
      } else if (type.includes('mouse')) {
        return event.clientX
      } else {
        throw new Error('event not expect in getCurrentX')
      }
    },
    setCurrentX (value) {
      this.currentX = value
    },
    setCarouselTransition (seconds = 0.2) {
      this.CAROUSEL_DOM.style.transition = `transform ${seconds}s linear`
    },
    getHasLastCarouselItem (deslocation) {
      return ((this.getTranslateValue * -1) + deslocation) < (this.getTotalCarouselWidth * -1)
    },
    onPressCarousel (event) {
      const currentX = this.getCurrentXOf(event)
      this.setCurrentX(currentX)

      this.hasPressCarousel = true
    },
    onMoveCarousel (event) {
      if (this.hasPressCarousel) {
        const deslocation = this.getCurrentXOf(event) - this.currentX
        const hasDeslocation = deslocation < this.getTranslateValue

        if (hasDeslocation && !this.getHasLastCarouselItem(deslocation)) {
          this.moveCarouselX = deslocation * -1
        } else {
          this.moveCarouselX = 0
        }
      }
    },
    onLeaveCarousel (event) {
      if (this.hasPressCarousel) {
        this.onUnpressCarousel(event)
      }
    },
    onUnpressCarousel (event) {
      this.hasPressCarousel = false

      const rules = {
        right: this.moveCarouselToRight,
        left: this.moveCarouselToLeft
      }

      rules[this.getMoveCarouselXDirection](event)

      this.moveCarouselX = 0
    },
    moveCarouselToRight (event) {
      if (this.getMiddleX > this.getCurrentXOf(event)) {
        const hasItemToMove = this.CAROUSEL_ITEM_ACTIVE < this.items.length - 1

        if (hasItemToMove) {
          this.CAROUSEL_ITEM_ACTIVE++
        }
      }

      this.setCarouselTransition()
    },
    moveCarouselToLeft (event) {
      if (this.getMiddleX < this.getCurrentXOf(event)) {
        const hasItemToMove = this.CAROUSEL_ITEM_ACTIVE - 1 >= 0

        if (hasItemToMove) {
          this.CAROUSEL_ITEM_ACTIVE--
        }
      }

      this.setCarouselTransition()
    },
    onNavigationCarousel (event) {
      try {
        const htmlReference = event.target.parentNode
        const htmlReferenceTagName = htmlReference.nodeName.toLowerCase()
        const htmlReferenceAttributeDataCarouselItemIndex = htmlReference.getAttribute('data-carousel-item-index')

        if (htmlReferenceTagName !== 'li') {
          throw new this.InterfaceNavigationCarousel('nodeName tag error', `nodeName ${htmlReferenceTagName} not match with expected li`)
        }

        if (htmlReferenceAttributeDataCarouselItemIndex === 'null') {
          throw new this.InterfaceNavigationCarousel('attribute error', 'attribute data-carousel-item-index does not found')
        }

        this.CAROUSEL_ITEM_ACTIVE = parseInt(htmlReferenceAttributeDataCarouselItemIndex)

        this.setCarouselTransition()
      } catch (error) {
        if (error instanceof this.InterfaceNavigationCarousel) {
          const interfaceNavigationCarousel = new Error(error.message)
          interfaceNavigationCarousel.message = error.message

          throw interfaceNavigationCarousel
        }

        throw error
      }
    },
    InterfaceNavigationCarousel (name, message) {
      this.name = name
      this.message = message
    }
  },
  mounted () {
    this.CAROUSEL_DOM = document.querySelector(`#${this.CAROUSEL_ID}`)

    this.CAROUSEL_DOM.addEventListener('transitionend', (event) => {
      event.target.style.transition = 'none'
    })

    this.CAROUSEL_DOM.addEventListener('touchstart', this.onPressCarousel)
    this.CAROUSEL_DOM.addEventListener('touchmove', this.onMoveCarousel)
    this.CAROUSEL_DOM.addEventListener('touchcancel', this.onLeaveCarousel)
    this.CAROUSEL_DOM.addEventListener('touchend', this.onUnpressCarousel)
  }
}
</script>

<style scoped>
  img {
    display: block;
    width: var(--item-width);
  }

  i {
    text-indent: 0;
  }

  [data-carousel-has-mouse-down] {
    cursor: grabbing;
  }

  .like-icon:before {
    color: #fff;
    content: '\2606';
    display: block;
    font-size: 24px;
    line-height: 1;
  }

  .like-icon.like:before {
    content: '\2605';
  }

  .base-carousel {
    display: flex;
    position: relative;
    max-width: var(--item-width);
    width: 100%;
  }

  .base-carousel__like {
    background-color: transparent;
    border: none;
    position: absolute;
    right: 16px;
    top: 16px;
  }

  .base-carousel__like:focus,
  .base-carousel__like:hover {
    background-color: inherit;
  }

  .base-carousel__item {
    transition: transform .2s linear;
  }

  .base-carousel__actions {
    bottom: 32px;
    font-size: 0;
    position: absolute;
    right: 16px;
  }

  .base-carousel__actions__nav__item {
    display: inline-block;
  }

  .base-carousel__actions__nav__item:not(:last-child){
    margin-right: 8px;
  }

  .base-carousel__actions__nav__item > button {
    border: 1px solid #fff;
    background-color: transparent;
    border-radius: 50%;
    height: 7px;
    width: 7px;
  }

  .base-carousel__actions__nav__item[data-carousel-item-active] > button {
    background-color: #fff;
  }
</style>
