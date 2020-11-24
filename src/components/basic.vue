<template>
  <div>
    <div ref="dateSlider" id="date-slider"></div>
  </div>
</template>

<script>
import CoivdData, { CovidData } from "../service/covid.data.service"

export default {
  data () {
    return {
    }
  },
  props: {
  },
  data() {
    return {
    }
  },
  watch: {
  },
  computed: {
    covidDataArray() {
      return CovidData.covidDataArray
    },
    covidMinDate() {
      return CovidData.minDate
    },
    covidMaxDate() {
      return CovidData.maxDate
    },
  },
  mounted() {
  },
  methods: {
  }
}
</script>

<style>
</style>
