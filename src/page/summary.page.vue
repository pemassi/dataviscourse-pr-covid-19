<template>
  <div>
    <TotalChart
      class="lineChart"
    />



  </div>
</template>

<script>
import TotalChart from "../components/total.chart.component.vue";
import CoivdData, { CovidData } from "../service/covid.data.service"

var covidRawData = require("../assets/data/owid-covid-data-2020-11-14.json");
var latlngMapping = require("@/assets/data/latlng.json")

export default {
  components: {
    TotalChart,
  },
  data() {
    return {
      selectedDate: "2020-11-13",

    }
  },
  computed: {
  },
  mounted() {


  },
  methods: {

  },
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

</style>
