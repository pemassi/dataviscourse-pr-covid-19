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
    <br>
    <br>

    <h3>Facts</h3>
    <hr>

     <div class="row align-items-center" style="text-align: center;">
      <div class="col">
        <span>Age Distribution</span>
      </div>
      <div class="col">
        <span>Population Density</span>
      </div>
      <div class="col">
        <span>Life Expectancy</span>
      </div>
    </div>

    <div class="row align-items-center" style="text-align: center;">
      <div class="col">
        <AgePieChart
          :selectedCountry="selectedCountry"
        />
      </div>
      <div class="col">
        <h2>
          <NumberAnimate :number="populationDensity"/>({{nth(populationDensityRank)}})<br>
          (<NumberAnimate :number="population"/>)
        </h2>
      </div>
      <div class="col">
        <h2>
          <NumberAnimate :number="lifeExpectancy"/>({{nth(lifeExpectancyRank)}})<br>
        </h2>
      </div>
    </div>

    <br>
    <br>
    <br>
    <br>

    <div class="row align-items-center">
      <div class="col">
        <h3>Covid Trend</h3>
      </div>
      <div class="col">
        <ul class="pagination justify-content-end">
          <li :class="`page-item ${category === 'daily' ? 'active' : ''}`" @click="category='daily'"><a class="page-link">Daily</a></li>
          <li :class="`page-item ${category === 'total' ? 'active' : ''}`" @click="category='total'"><a class="page-link">Total</a></li>
        </ul>
      </div>
    </div>
    <hr>

    <h5>New Cases</h5>
    <TrendChart
      :selectedCountry="selectedCountry"
      :category="category"
      @on-date-click="onDateClicked"
    />

    <br>
    <br>

    <h5>Death Cases</h5>
    <DeathTrendChart
      :selectedCountry="selectedCountry"
      :category="category"
      @on-date-click="onDateClicked"
    />


  </div>
</template>

<script>
import { CovidData, covidRawData } from "../service/covid.data.service"
import NumberAnimate from "../components/number.animate.component"
import TrendChart from "../components/trend.chart.component"
import DeathTrendChart from "../components/death.trend.chart.component"
import AgePieChart from "../components/age.pie.chart.component"

export default {
  components: {
    NumberAnimate,
    TrendChart,
    DeathTrendChart,
    AgePieChart
  },
  data() {
    return {
      covidDataArray: [],
      selectedCountry: null,
      category: 'daily'
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
    population() {
      try
      {
        return this.selectedCountryData.population
      }
      catch(e)
      {
        return 0
      }
    },
    populationDensity() {
      try
      {
        return Math.round(this.selectedCountryData.population_density)
      }
      catch(e)
      {
        return 0
      }
    },
    populationDensityRank() {
      try
      {
        return CovidData.covidRankData[this.selectedCountry].population_density
      }
      catch(e)
      {
        return "N/A"
      }
    },
    lifeExpectancy() {
      try
      {
        return Math.round(this.selectedCountryData.life_expectancy)
      }
      catch(e)
      {
        return 0
      }
    },
    lifeExpectancyRank() {
      try
      {
        return CovidData.covidRankData[this.selectedCountry].life_expectancy
      }
      catch(e)
      {
        return "N/A"
      }
    },
    diabetesPrevalence() {
      try
      {
        return Math.round(this.selectedCountryData.diabetes_prevalence)
      }
      catch(e)
      {
        return null
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
    onDateClicked(date, country) {
      this.$router.push(`/daily?selectedDate=${date}&country=${country}&category=${this.category}`)
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

hr {
  border-top: 1px solid rgba(255,255,255,1);
}
</style>
