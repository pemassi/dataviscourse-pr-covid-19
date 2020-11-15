<template>
  <div>
    <LineChart
      class="lineChart"
      :d3-data="d3Data"
    ></LineChart>

    <div class="input-group mb-3">
      <input v-model="selectedDate" type="text" class="form-control">
      <div class="input-group-append">
        <button class="btn btn-outline-secondary" type="button">Button</button>
      </div>
    </div>

    <Map :date="selectedDate"></Map>
  </div>
</template>

<script>
import Map from "../components/map.component"
import LineChart from "../components/LineChart";
import CoivdData, { CovidData } from "../service/covid.data.service"
var covidRawData = require("../assets/data/owid-covid-data-2020-11-14.json");


export default {
  components: {
    Map,
    LineChart
  },
  data () {
    return {
      selectedDate: "2020-11-13",

      covidWorldData: [],
      d3Data: {}
    }
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
    //console.log(covidRawData["OWID_WRL"].data);
    let d3DataX = [];
    let d3DataY = [];
    let d3Tooltip = [];
    covidRawData["OWID_WRL"].data.forEach(function (d) {
      d3DataX.push(d.date);
      d3DataY.push(d.new_cases);

    });

    this.d3Data = {
      x: d3DataX,
      y: d3DataY,
    };

    console.log(this.d3Data)
  },
  methods: {
    getD3data() {
      return this.d3Data;
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
  html, body{
    background-color: #1f2329;
  }

  .lineChart {
    background: black;
  }


</style>
