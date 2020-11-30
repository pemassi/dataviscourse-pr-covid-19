<template>
  <div>
    <select class="browser-default custom-select" v-model="selectedCountry">
        <option :value="null">Please select country</option>
        <option 
          v-for="countrie in covidDataArray" 
          :key="countrie.alpha3Code" 
          :value="countrie.alpha3Code"
        >
          {{`${countrie.location} (${countrie.continent})`}}
        </option>
    </select>

    <br>
    <br>

    <div class="row align-items-center" style="text-align: center;">
      <div class="col">
        <h1>Total Cases</h1>
      </div>
      <div class="col">
        <h1>Total Deaths</h1>
      </div>
    </div>

    <div class="row align-items-center" style="text-align: center;">
      <div class="col">
        <h1>
         <span class="pointer" v-if="covidTotalCasesRank > 1" @click="lookCaseRank(covidTotalCasesRank - 1)">&lt;</span> 
         <NumberAnimate :number="covidTotalCases"/> 
         ({{nth(covidTotalCasesRank)}})
         <span class="pointer" v-if="covidDataArray.length >= covidTotalCasesRank" @click="lookCaseRank(covidTotalCasesRank + 1)">&gt;</span> 
        </h1>
      </div>
      <div class="col">
        <h1>
          <span class="pointer" v-if="covidDeathCasesRank > 1" @click="lookDeathRank(covidDeathCasesRank - 1)">&lt;</span> 
          <NumberAnimate :number="covidDeathCases"/> 
          ({{nth(covidDeathCasesRank)}})
          <span class="pointer" v-if="covidDataArray.length >= covidDeathCasesRank" @click="lookDeathRank(covidDeathCasesRank + 1)">&gt;</span> 
        </h1>
      </div>
    </div>

    <br>
    <br>

    <div class="row align-items-center">
      <div class="col">
        <h3>Covid Trend</h3>
      </div>
      <div class="col">
      </div>
    </div>

    <TrendChart
      :selectedCountry="selectedCountry"
    />

    <br>
    <br>


    <DeathTrendChart
      :selectedCountry="selectedCountry"
    />


  </div>
</template>

<script>
import { CovidData, covidRawData } from "../service/covid.data.service"
import NumberAnimate from "../components/number.animate.component"
import TrendChart from "../components/trend.chart.component"
import DeathTrendChart from "../components/death.trend.chart.component"

export default {
  components: {
    NumberAnimate,
    TrendChart,
    DeathTrendChart
  },
  data() {
    return {
      covidDataArray: [],
      selectedCountry: null,
    }
  },
  computed: {
    covidMinDate() {
      return CovidData.minDate
    },
    covidMaxDate() {
      return CovidData.maxDate
    },
    selectedCountryData() {
      try
      {
        return CovidData.covidDataHashMap[this.selectedCountry]
      }
      catch(e)
      {
        return null
      }
    },
    covidTotalCases() {
      try
      {
        return this.selectedCountryData.data[this.selectedCountryData.data.length - 1].total_cases
      }
      catch(e)
      {
        return 0
      }
    },
    covidDeathCases() {
      try
      {
        return this.selectedCountryData.data[this.selectedCountryData.data.length - 1].total_deaths
      }
      catch(e)
      {
        return 0
      }
    },
    covidTotalCasesRank() {
      try
      {
        return CovidData.covidRankData[this.selectedCountry].total_cases
      }
      catch(e)
      {
        return "N/A"
      }
    },    
    covidDeathCasesRank() {
      try
      {
        return CovidData.covidRankData[this.selectedCountry].total_deaths
      }
      catch(e)
      {
        return "N/A"
      }
    },
  },
  watch: {
    selectedCountryData(newVal) {
      
    }
  },
  activated() {
    let preSelectedCountry = this.$route.query.selected

    if(preSelectedCountry)
        this.selectedCountry = preSelectedCountry
  },
  mounted() {
    let preSelectedCountry = this.$route.query.selected

    CovidData.initData()
      .then(() => {
        this.covidDataArray = CovidData.covidDataArray

        if(preSelectedCountry)
          this.selectedCountry = preSelectedCountry
        else
          this.selectedCountry = "USA"
      })
  },
  methods: {
    lookCaseRank(rank) {
      for(var key in CovidData.covidRankData)
      {
        if(CovidData.covidRankData[key].total_cases == rank)
        {
          this.selectedCountry = key
          return
        }
      }
    },
    lookDeathRank(rank) {
      for(var key in CovidData.covidRankData)
      {
        if(CovidData.covidRankData[key].total_deaths == rank)
        {
          this.selectedCountry = key
          return
        }
      }
    },
    nth(n) {
      return n + '' + (["st","nd","rd"][((n+90)%100-10)%10-1]||"th")
    }
  },
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.pointer {cursor: pointer;}
</style>
