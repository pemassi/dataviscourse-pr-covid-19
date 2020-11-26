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

    <Map 
      :date="selectedDate"
      :category="category"
    ></Map>
  </div>
</template>

<script>
import Map from "../components/map.component"
import DateSlider from "../components/date.slider.component"

import CoivdData, { CovidData } from "../service/covid.data.service"

export default {
  components: {
    Map,
    DateSlider,
  },
  data () {
    return {
      selectedDate: "2020-11-11",
      datePlay: false,
      category: "dailyCase",
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
    
  },
  methods: {
    updateDate(updatedData) {
      this.selectedDate = updatedData;
    }
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>


.lineChart {
  background: black;
}
</style>
