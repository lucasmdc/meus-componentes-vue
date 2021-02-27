<template>
  <div id="app">
    <BaseCard
      v-for="(product, index) in products"
      :key="index"
      :title="product.name"
      :text="product.text"
      :cardWidth="300"
    >
      <template v-slot:baseCardTop>
        <BaseCarousel
          :items="product.photos"
          :itemWidth="300"
        />
      </template>
      <template v-slot:baseCardContentAppend>
        <BaseList :items="product.details" />
      </template>
      {{ products }}
    </BaseCard>
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
      aliasProductsImages: [],
      aliasProductsEnSuites: [],
      aliasProductsUsableAreas: []
    }
  },
  methods: {
    CreateProductInterface (name, text, photos, details) {
      this.name = name
      this.text = text
      this.photos = photos
      this.details = details
    },
    testValueIs (value, type) {
      const result = Object.prototype.toString.call(value).toLowerCase()

      return result.substring(1, result.length - 1).split(' ')[1] === type
    },
    formatingDetailsItems (value) {
      const sliced = value.slice(0, value.length - 1)

      if (sliced.length > 0) {
        const joined = sliced.join(' , ')
        const firstAndLastHasSameValue = value[0] === value[value.length - 1]

        if (!firstAndLastHasSameValue) {
          return joined.concat(' e ' + value[value.length - 1])
        }

        return joined
      }

      return value
    }
  },
  created () {
    try {
      const decoder = new TextDecoder('utf-8')

      fetch('https://static-content.bivilabs.com.br/challenges/products.json')
        .then(response => response.body)
        .then(body => {
          const reader = body.getReader()

          reader
            .read()
            .then(({ value, done }) => {
              const products = JSON.parse(decoder.decode(value)).products.splice(0, 5)

              products.forEach(product => {
                if (this.testValueIs(product.address.geo_location, 'object')) {
                  // photos
                  const photos = product.photos.map(photo => {
                    return {
                      imgSrc: photo,
                      isLiked: false
                    }
                  })

                  this.aliasProductsImages.push(photos)
                  // end-photos

                  // unitsEnSuites
                  const unitsEnSuites = this.testValueIs(product.units.en_suites, 'array')
                    ? JSON.parse(JSON.stringify(product.units.en_suites))
                    : [product.units.en_suites]

                  const validUnitsEnSuites = unitsEnSuites.filter(enSuite => {
                    return !!enSuite
                  })

                  this.aliasProductsEnSuites.push(validUnitsEnSuites)
                  // end-unitsEnSuites

                  // usableAreas
                  const usableAreas = this.testValueIs(product.units.usable_areas, 'array')
                    ? JSON.parse(JSON.stringify(product.units.usable_areas))
                    : [product.units.usable_areas]

                  const validUsableAreas = usableAreas.filter(usableArea => {
                    return usableArea > 10
                  })

                  this.aliasProductsUsableAreas.push(validUsableAreas)
                  // end-usableAreas

                  // datails
                  const { city, district } = product.address
                  const address = `
                    ${city}<br>
                    <span style="font-size:14px">${district}</span>
                  `

                  const details = [
                    {
                      icon: 'icon-key',
                      text: `Apartamentos de ${this.formatingDetailsItems(validUsableAreas)}m²`
                    },
                    {
                      icon: 'icon-bed',
                      text: `
                        ${this.formatingDetailsItems(validUnitsEnSuites)}
                        suítes`
                    },
                    {
                      icon: 'icon-pin',
                      text: 'Localização Privilegiada'
                    }
                  ]
                  // end-datails

                  this.products.push(new this.CreateProductInterface(product.name, address, photos, details))
                }
              })
            })
        })
    } catch (error) {

    }
  }
}
</script>

<style>
</style>
