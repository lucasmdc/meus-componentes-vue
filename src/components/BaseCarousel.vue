<template>
  <ul
    class="base-carousel"
    :id="CAROUSEL_ID"
    @mousedown.prevent="onPressCarousel"
    @mouseup="onUnpressCarousel"
    @mousemove="onMoveCarousel"
    @mouseleave="onLeaveCarousel"
    :style="{...deslocateCarouselTo, ...transforItemWidthPropToCssVariable}"
  >
    <li
      class="base-carousel__item"
      v-for="(item, index) in items"
      :key="index"
      :data-carousel-item-index="index"
      :data-carousel-has-mouse-down="parseInt(index) === CAROUSEL_ITEM_ACTIVE && hasPressedCarousel"
      :data-carousel-item-active="parseInt(index) === CAROUSEL_ITEM_ACTIVE ? true : false"
    >
      <button
        class="base-carousel__like"
        @click="item.isLiked = !item.isLiked"
        :style="deslocateCarouselActionsTo"
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
      :style="deslocateCarouselActionsTo"
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
      hasPressedCarousel: false,
      currentCarouselPressedX: 0,
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
    transforItemWidthPropToCssVariable () {
      return {
        '--item-width': `${this.itemWidth}px`
      }
    },
    totalCarouselWidth () {
      return (this.items.length - 1) * this.itemWidth
    },
    currentCarouselItemView () {
      return this.itemWidth * this.CAROUSEL_ITEM_ACTIVE
    },
    deslocateCarousel () {
      return Math.abs(this.currentCarouselItemView + this.moveCarouselX)
    },
    deslocateCarouselTo () {
      return {
        transform: `translateX(-${this.deslocateCarousel}px)`
      }
    },
    deslocateCarouselActionsTo () {
      return {
        right: this.currentCarouselItemView !== 0 ? `-${this.currentCarouselItemView - 16}px` : '16px'
      }
    },
    middleCarouselItemX () {
      return (this.itemWidth / 2) + this.CAROUSEL_DOM.offsetLeft
    },
    moveCarouselXDirection () {
      return this.hasOverMiddleCarouselItemX ? 'left' : 'right'
    },
    hasOverMiddleCarouselItemX () {
      return this.middleCarouselItemX > this.currentCarouselPressedX
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
    setCurrentCarouselPressedX (value) {
      this.currentCarouselPressedX = value
    },
    setCarouselTransition (seconds = 0.2) {
      this.CAROUSEL_DOM.style.transition = `transform ${seconds}s linear`
    },
    getHasLastCarouselItem (deslocation) {
      return ((this.currentCarouselItemView * -1) + deslocation) < (this.totalCarouselWidth * -1)
    },
    onPressCarousel (event) {
      const currentCarouselPressedX = this.getCurrentXOf(event)
      this.setCurrentCarouselPressedX(currentCarouselPressedX)

      this.hasPressedCarousel = true
    },
    onMoveCarousel (event) {
      if (this.hasPressedCarousel) {
        const deslocation = this.getCurrentXOf(event) - this.currentCarouselPressedX
        const hasDeslocation = deslocation < this.currentCarouselItemView

        if (hasDeslocation && !this.getHasLastCarouselItem(deslocation)) {
          this.moveCarouselX = deslocation * -1
        } else {
          this.moveCarouselX = 0
        }
      }
    },
    onLeaveCarousel (event) {
      if (this.hasPressedCarousel) {
        this.onUnpressCarousel(event)
      }
    },
    onUnpressCarousel (event) {
      this.hasPressedCarousel = false

      const rules = {
        right: this.moveCarouselToRight,
        left: this.moveCarouselToLeft
      }

      rules[this.moveCarouselXDirection](event)

      this.moveCarouselX = 0
    },
    moveCarouselToRight (event) {
      if (this.middleCarouselItemX > this.getCurrentXOf(event)) {
        const hasItemToMove = this.CAROUSEL_ITEM_ACTIVE < this.items.length - 1

        if (hasItemToMove) {
          this.CAROUSEL_ITEM_ACTIVE++
        }
      }

      this.setCarouselTransition()
    },
    moveCarouselToLeft (event) {
      if (this.middleCarouselItemX < this.getCurrentXOf(event)) {
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
    max-width: var(--item-width);
    width: 100vw;
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
    width: 100%;
  }

  .base-carousel__like {
    background-color: transparent;
    border: none;
    border-top: 4px solid #ccc;
    padding: 8px 8px 0;
    position: absolute;
    right: 16px;
    top: 0;
    z-index: 2;
  }

  .base-carousel__like:after,
  .base-carousel__like:before {
    border-top: 76px solid #aaa;
    bottom: -44px;
    content: '';
    display: block;
    position: absolute;
    transition: border-color .2s linear !important;
    z-index: 1;
  }

  .base-carousel__like:after {
    border-right: 40px solid transparent;
    left: 0;
  }

  .base-carousel__like:before {
    border-left: 40px solid transparent;
    right: 0;
  }

  .base-carousel__like:focus,
  .base-carousel__like:hover {
    background-color: inherit;
  }

  .base-carousel__like:focus:after,
  .base-carousel__like:focus:before,
  .base-carousel__like:hover:after,
  .base-carousel__like:hover:before {
     border-top: 76px solid #ccc;
  }

  .base-carousel__like i {
    position: relative;
    z-index: 3;
  }

  .base-carousel__item {
    transition: transform .2s linear;
    max-width: var(--item-width);
    width: 100vw;
  }

  .base-carousel__actions {
    background-color: #aaa;
    border-radius: 8px;
    bottom: 12px;
    font-size: 0;
    padding: 8px;
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
