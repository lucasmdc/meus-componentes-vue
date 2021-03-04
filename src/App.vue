<template>
  <div id="app">
    <h2>BaseCarousel</h2>
    <BaseCarousel
      :items="banners"
      :itemWidth="bannerSize"
    />
    <article>
      <h2>BaseCard + BaseCarousel</h2>
      <div class="article__body">
        <BaseCard
          v-for="(product, index) in products"
          :key="index"
          :title="product.name"
          :text="product.text"
          :cardWidth="productSize"
        >
          <template v-slot:baseCardTop>
            <BaseCarousel
              :items="product.photos"
              :itemWidth="productSize"
            />
          </template>
        </BaseCard>
      </div>
    </article>
    <article>
      <h2>BaseCard + BaseCarousel + BaseList</h2>
      <div class="article__body">
        <BaseCard
          v-for="(product, index) in productsWithDetails"
          :key="index"
          :title="product.name"
          :text="product.text"
          :cardWidth="productSize"
        >
          <template v-slot:baseCardTop>
            <BaseCarousel
              :items="product.photos"
              :itemWidth="productSize"
            />
          </template>
          <template v-slot:baseCardContentAppend>
            <BaseList :items="product.details" />
          </template>
        </BaseCard>
      </div>
    </article>
  </div>
</template>

<script>
import BaseCard from './components/BaseCard'
import BaseList from './components/BaseList'
import BaseCarousel from './components/BaseCarousel'

export default {
  name: 'App',
  components: {
    BaseCard,
    BaseList,
    BaseCarousel
  },
  data () {
    return {
      products: [],
      banners: [],
      details: [],
      productSize: 300,
      bannerSize: 1440
    }
  },
  computed: {
    productsWithDetails () {
      return this.products.map((elem, index) => {
        return {
          ...elem,
          details: this.details
        }
      })
    }
  },
  created () {
    const productsToAppend = [{
      name: 'Fotos incríveis #1',
      text: 'Imagens Aleatórias',
      details: [],
      photos: [
        {
          imgSrc: `https://picsum.photos/${this.productSize}?random=1`,
          isLiked: false
        },
        {
          imgSrc: `https://picsum.photos/${this.productSize}?random=2`,
          isLiked: false
        },
        {
          imgSrc: `https://picsum.photos/${this.productSize}?random=3`,
          isLiked: false
        },
        {
          imgSrc: `https://picsum.photos/${this.productSize}?random=4`,
          isLiked: false
        }
      ]
    },
    {
      name: 'Fotos incríveis #2',
      text: 'Imagens Aleatórias',
      details: [],
      photos: [
        {
          imgSrc: `https://picsum.photos/${this.productSize}?random=5`,
          isLiked: false
        },
        {
          imgSrc: `https://picsum.photos/${this.productSize}?random=6`,
          isLiked: false
        },
        {
          imgSrc: `https://picsum.photos/${this.productSize}?random=7`,
          isLiked: false
        },
        {
          imgSrc: `https://picsum.photos/${this.productSize}?random=8`,
          isLiked: false
        }
      ]
    },
    {
      name: 'Fotos incríveis #3',
      text: 'Imagens Aleatórias',
      details: [],
      photos: [
        {
          imgSrc: `https://picsum.photos/${this.productSize}?random=9`,
          isLiked: false
        },
        {
          imgSrc: `https://picsum.photos/${this.productSize}?random=10`,
          isLiked: false
        },
        {
          imgSrc: `https://picsum.photos/${this.productSize}?random=11`,
          isLiked: false
        },
        {
          imgSrc: `https://picsum.photos/${this.productSize}?random=12`,
          isLiked: false
        }
      ]
    },
    {
      name: 'Fotos incríveis #4',
      text: 'Imagens Aleatórias',
      details: [],
      photos: [
        {
          imgSrc: `https://picsum.photos/${this.productSize}?random=13`,
          isLiked: false
        },
        {
          imgSrc: `https://picsum.photos/${this.productSize}?random=14`,
          isLiked: false
        },
        {
          imgSrc: `https://picsum.photos/${this.productSize}?random=15`,
          isLiked: false
        },
        {
          imgSrc: `https://picsum.photos/${this.productSize}?random=16`,
          isLiked: false
        }
      ]
    }]

    const bannersToAppend = [
      {
        imgSrc: 'https://picsum.photos/1920/500?random=13',
        isLiked: false
      },
      {
        imgSrc: 'https://picsum.photos/1920/500?random=14',
        isLiked: false
      },
      {
        imgSrc: 'https://picsum.photos/1920/500?random=15',
        isLiked: false
      },
      {
        imgSrc: 'https://picsum.photos/1920/500?random=16',
        isLiked: false
      }
    ]

    const detailsToAppend = [
      {
        icon: 'icon-hash',
        text: 'texto de descrição 1'
      },
      {
        icon: 'icon-hash',
        text: 'texto de descrição 2'
      },
      {
        icon: 'icon-hash',
        text: 'texto de descrição "n"'
      }
    ]

    this.products.push(...productsToAppend)
    this.banners.push(...bannersToAppend)
    this.details.push(...detailsToAppend)

    window.addEventListener('resize', (event) => {
      this.bannerSize = event.target.innerWidth
    })
  }
}
</script>

<style scoped>
  h2 {
    font-size: 48px;
    margin: 32px 0;
    line-height: 1.1;
    text-align: center;
  }

  article {
    padding: 0 15px;
    width: 100%;
  }

  article .article__body {
    display: flex;
    justify-content: space-evenly;
  }
</style>
