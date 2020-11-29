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
          <NumberAnimate :number="covidTotalCases"/> ({{covidTotalCasesRank}})
        </h1>
      </div>
      <div class="col">
        <h1>
          <NumberAnimate :number="covidDeathCases"/> ({{covidDeathCasesRank}})
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

  </div>
</template>

<script>
import { CovidData, covidRawData } from "../service/covid.data.service"
import NumberAnimate from "../components/number.animate.component"
import TrendChart from "../components/trend.chart.component"

export default {
  components: {
    NumberAnimate,
    TrendChart
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
        return this.selectedCountryData.dataHashMap[this.covidMaxDate].total_cases
      }
      catch(e)
      {
        return 0
      }
    },
    covidDeathCases() {
      try
      {
        return this.selectedCountryData.dataHashMap[this.covidMaxDate].total_deaths
      }
      catch(e)
      {
        return 0
      }
    },
    covidTotalCasesRank() {
      try
      {
        return this.nth(CovidData.covidRankData[this.selectedCountry].total_cases)
      }
      catch(e)
      {
        return "N/A"
      }
    },    
    covidDeathCasesRank() {
      try
      {
        return this.nth(CovidData.covidRankData[this.selectedCountry].total_deaths)
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
    nth(n) {
      return n + '' + (["st","nd","rd"][((n+90)%100-10)%10-1]||"th")
    }
  },
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

</style>
