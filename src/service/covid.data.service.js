var covidRawData = require("@/assets/data/owid-covid-data-2020-11-14.json")
var latlngMapping = require("@/assets/data/latlng.json")

const CovidData = {

  /**
   * Need to init first.
   */
  covidDataArray: undefined,

  covidDataHashMap: undefined,

  covidRankData: {},

  /**
   * Maximum date in data
   */
  maxDate: "2000-01-01",

  /**
   * Minimum date in data
   */
  minDate: "2099-12-31",
  totalCases: 0,

  maxPopulationDensity: Number.MIN_SAFE_INTEGER,

  maxLifeExpectancy: Number.MIN_SAFE_INTEGER,

  async initData() {
    if(this.covidDataArray)
      return this.covidDataArray

    //console.log(covidRawData)
    //console.log(latlngMapping)

    this.covidDataHashMap = covidRawData
    this.covidDataArray = []

    //Data trasnform
    for(var key in covidRawData)
    {
      let latlng = latlngMapping[key]

      //If we cannot find code, ignore it
      if(latlng == undefined)
        continue

      //Create Array Data
      let temp = {
        "alpha3Code": key,
        ...covidRawData[key],
        "latitude": latlng.Latitude,
        "longitude": latlng.Longitude,

      }
      temp.dataHashMap = {}

      var total =""
      //Make dataHashMap with date
      temp.data.forEach(it => {
        if(it.date < this.minDate)
          this.minDate = it.date


        if(it.date > this.maxDate)
          this.maxDate = it.date


        temp.dataHashMap[it.date] = it
      });

      try
      {
        if(this.maxLifeExpectancy < temp.life_expectancy)
          this.maxLifeExpectancy = temp.life_expectancy
      }
      catch(e)
      {

      }

      try
      {
        if(this.maxPopulationDensity < temp.population_density)
          this.maxPopulationDensity = temp.population_density
      }
      catch(e)
      {

      }

      this.covidDataArray.push(temp)

      //Create HashMap Data
      this.covidDataHashMap[key].dataHashMap = temp.dataHashMap
      this.covidDataHashMap[key].latitude = latlng.Latitude
      this.covidDataHashMap[key].longitude = latlng.Longitude
    }

    //Create New Case Rank Data
    let temp = [...this.covidDataArray]
    temp.sort((a, b) => {
      let aValue = a.data[a.data.length - 1].total_cases
      let bValue = b.data[b.data.length - 1].total_cases

      aValue = aValue ? aValue : 0
      bValue = bValue ? bValue : 0

      return bValue - aValue
    })

    let count = 1
    temp.forEach(d => {
      this.covidRankData[d.alpha3Code] = { total_cases: count++ }
    })

    //Create Death Case Rank Data
    temp.sort((a, b) => {
      let aValue = a.data[a.data.length - 1].total_deaths
      let bValue = b.data[b.data.length - 1].total_deaths

      aValue = aValue ? aValue : 0
      bValue = bValue ? bValue : 0

      return bValue - aValue
    })

    count = 1
    temp.forEach(d => {
      this.covidRankData[d.alpha3Code]["total_deaths"] = count++
    })

    //Population Density Rank Data
    temp.sort((a, b) => {
      let aValue = a.population_density
      let bValue = b.population_density

      aValue = aValue ? aValue : 0
      bValue = bValue ? bValue : 0

      return bValue - aValue
    })

    count = 1
    temp.forEach(d => {
      this.covidRankData[d.alpha3Code]["population_density"] = count++
    })

    //life_expectancy Rank Data
    temp.sort((a, b) => {
      let aValue = a.life_expectancy
      let bValue = b.life_expectancy

      aValue = aValue ? aValue : 0
      bValue = bValue ? bValue : 0

      return bValue - aValue
    })

    count = 1
    temp.forEach(d => {
      this.covidRankData[d.alpha3Code]["life_expectancy"] = count++
    })

    console.log(`Success to init COVID data. [${this.minDate} ~ ${this.maxDate}]`);
    console.log(`[Array]`)
    console.log(this.covidDataArray);
    console.log(`[Hashmap]`)
    console.log(this.covidDataHashMap);
    console.log(`[Rank]`)
    console.log(this.covidRankData);

    return this.covidDataArray
  },

  /**
   * Get data async
   */
  async getData() {
    //If data is already inititalizied, return it.
    if(this.covidDataArray)
      return this.covidDataArray
    else
      return await this.initData()
  }
}

export default CovidData
export {CovidData, covidRawData, latlngMapping}
