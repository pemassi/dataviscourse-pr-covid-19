var covidRawData = require("@/assets/data/owid-covid-data-2020-11-14.json")
var latlngMapping = require("@/assets/data/latlng.json")

const CovidData = {

  /**
   * Need to init first.
   */
  covidDataArray: undefined,

  /**
   * Maximum date in data
   */
  maxDate: "2000-01-01",

  /**
   * Minimum date in data
   */
  minDate: "2099-12-31",

  async initData() {
    console.log(covidRawData)
    console.log(latlngMapping)

    this.covidDataArray = []

    //Data trasnform
    for(var key in covidRawData)
    {
      let latlng = latlngMapping[key]

      //If we cannot find code, ignore it
      if(latlng == undefined)
        continue

      let temp = {"alpha3Code": key, ...covidRawData[key], "latitude": latlng.Latitude, "longitude": latlng.Longitude}
      temp.dataHashMap = {}

      //Make dataHashMap with date
      temp.data.forEach(it => {
        if(it.date < this.minDate)
          this.minDate = it.date

        if(it.date > this.maxDate)
          this.maxDate = it.date

        temp.dataHashMap[it.date] = it
      });

      this.covidDataArray.push(temp)
    }

    console.log(`Success to init COVID data. [${this.minDate} ~ ${this.maxDate}]`)
    console.log(this.covidDataArray)

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