<template>
  <div>
    <div class="row">
      <div class="col">
        <h1 style="color: white;">{{selectedDate}}</h1>
      </div>
      <div class="col">
        <ul class="pagination justify-content-end">
          <li :class="`page-item ${category === 'dailyCase' ? 'active' : ''}`" @click="category='dailyCase'"><a class="page-link">Daily Case</a></li>
          <li :class="`page-item ${category === 'deailyDeath' ? 'active' : ''}`" @click="category='deailyDeath'"><a class="page-link">Daily Death</a></li>
          <li :class="`page-item ${category === 'deailyCaseWithPoplulation' ? 'active' : ''}`" @click="category='deailyCaseWithPoplulation'"><a class="page-link">Daily Case with Poplulation</a></li>
          <li :class="`page-item ${category === 'deailyCaseWithPoplulationDensity' ? 'active' : ''}`" @click="category='deailyCaseWithPoplulationDensity'"><a class="page-link">Daily Case with Poplulation Density</a></li>
        </ul>
      </div>
    </div>
    
    <div class="row">
      <div class="col-1">
        <button 
          class="btn btn-primary" 
          style="margin-top: 10px;" 
          @click="datePlay = !datePlay"
        >
          {{datePlay ? "Stop" : "Play"}}
        </button>
      </div>
      <div class="col">
        <DateSlider
          :playing="datePlay"
          @on-date-update="updateDate"
          @on-play-end="datePlay = false"
        ></DateSlider>
      </div>
    </div>

    <LineChart
      class="lineChart"
      :d3-data="d3Data"
      @changeDate="updateDate"
    ></LineChart>

    <Map 
      :date="selectedDate"
      :category="category"
    ></Map>
  </div>
</template>

<script>
import Map from "../components/map.component"
import LineChart from "../components/LineChart"
import DateSlider from "../components/date.slider.component"

import CoivdData, { CovidData } from "../service/covid.data.service"
var covidRawData = require("../assets/data/owid-covid-data-2020-11-14.json")

export default {
  components: {
    Map,
    LineChart,
    DateSlider,
  },
  data () {
    return {
      selectedDate: "2020-11-11",
      datePlay: false,
      category: "dailyCase",
      covidWorldData: [],
      d3Data: {},
      test: ""
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
  watch: {

  },
  mounted() {
    console.log("Covid World data");
    console.log(covidRawData["OWID_WRL"].data);
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

    //console.log(this.d3Data);



  },
  methods: {
    getD3data() {
      return this.d3Data;
    },
    updateDate(updatedData) {
      this.selectedDate = updatedData;
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
