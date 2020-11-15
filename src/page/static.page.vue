<template>
  <div>
    <div class="input-group mb-3">
      <input v-model="selectedDate" type="text" class="form-control">
      <div class="input-group-append">
        <button class="btn btn-outline-secondary" type="button">Button</button>
      </div>
    </div>




  </div>
</template>

<script>
import LineChart from "../components/LineChart";
import CoivdData, { CovidData } from "../service/covid.data.service"

var covidRawData = require("../assets/data/owid-covid-data-2020-11-14.json");
var latlngMapping = require("@/assets/data/latlng.json")

export default {
  components: {
    LineChart,
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
