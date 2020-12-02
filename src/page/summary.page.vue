<template>
  <div>
    <h1 style="text-align: center;">Total Covid-19 Cases in The World</h1>
    <br/>
    <h5 style="text-align: right; ">Click and Play with the Data</h5>
    <div id="my_dataviz" style="position: relative"></div>
    <div ref="tooltip" id="tooltip" class="tooltip elevation-3" style="opacity: 0;"></div>
  </div>
</template>

<script>
import * as d3 from "d3";
import TotalChart from "../components/total.chart.component.vue";
import CoivdData, { CovidData } from "../service/covid.data.service";

var covidRawData = require("@/assets/data/owid-covid-data-2020-11-14.json");

export default {
  components: {
    TotalChart,
    CoivdData,
  },
  data() {
    return {
      selectedDate: "2020-11-13",
      data:[],
    };
  },
  created() {
  },

  watch: {

  },
  computed: {
  },
  mounted() {
    CovidData.initData()
    .then(()=> {
      this.circularPacking();
    })
  },
  updated() {
  },
  methods: {
    wrapperStyles() {
      return `height:${WRAPPER.height}px; width:${WRAPPER.width}px; margin:auto; background:${WRAPPER.background};`;
    },
    covidDataArray() {
      return  CovidData.covidDataArray;
    },
    covidMinDate() {
      return CovidData.minDate;
    },
    covidMaxDate() {
      return CovidData.maxDate;
    },


  },

};
</script>

<style>
  .node circle {
    stroke: #3a403d;
    stroke-width: .5px;
  }
  #my_dataviz {
    text-align: center;
    position: relative;
  }
  .node:hover{
    stroke-width: 7px;
    opacity: 1;
  }
  .tooltip {
    font-size: 1em;
    position: absolute;
    top: 20px;
    left: 20px;
    padding: 10px 20px;
    border-radius: 5px;
    background: #1f8ac0;
    color: white;
    width: 600px;
  }


</style>
