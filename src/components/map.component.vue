<template>
  <div>
    <div ref="map" id="map"></div>
    <div ref="tooltip" id="tooltip" class="tooltip elevation-3" style="opacity: 0;"></div>
  </div>
</template>

<script>
import * as d3 from "d3";
import { CovidData } from "../service/covid.data.service"

export default {
  data () {
    return {
      map: undefined,
    }
  },
  props: {
    date: {
      type: String,
      default: "2020-11-13",
    },
    category: {
      type: String,
      default: "dailyCase"
    }
  },
  data() {
    return {
      padding: 200,
      overlay: undefined,
      layer: undefined,
      projection: undefined,
      circleScale: undefined,
    }
  },
  watch: {
    date(newVal, oldVal) {
      this.onDateChange()
    },
    category() {
      this.onDateChange()
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
    this.initMap()
  },
  methods: {
    async initMap() {
      let that = this
      let options = {
        zoom: 2,
        center: new google.maps.LatLng(44.193444, 28.649466),
        disableDefaultUI: true,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        styles: require("@/assets/data/google-map-style.json")
      }

      this.map = new google.maps.Map(this.$refs.map, options)
      
      // Limit the zoom level
      google.maps.event.addListener(map, 'zoom_changed', function() {
        if (map.getZoom() < 2) map.setZoom(2);
      });

      await CovidData.initData()

      let overlay = new google.maps.OverlayView()

      overlay.onAdd = function () {

        that.layer = d3.select(this.getPanes().overlayMouseTarget).append("div")
            .attr("class", "covid-case");

        overlay.onRemove = function () {
          d3.select('.covid-case').remove();
        };

        overlay.draw = function () {
          that.projection = this.getProjection()
          that.updateCircleScale()

          let marker = that.layer.selectAll('svg')
            .data(that.covidDataArray);

          let markerEnter = marker.enter().append("svg");

          // add the circle
          markerEnter
            .append("circle");

          marker.exit()
            .remove();

          marker = marker.merge(markerEnter);

          marker
            .each(transform)
            .attr("class", "marker")

          marker.select("circle")
            .attr("class", "marker-circle")
            .attr("cx", that.padding)
            .attr("cy", that.padding)
            .attr("r", that.getRadius)
            .style('opacity', that.getOpacity)
            .attr('fill', '#FB7E01')
          
          marker.select("circle")
            .on("mouseover mousemove", function(d, i) {
              let tooltipX = d3.event.pageX + 5;
              let tooltipY = d3.event.pageY;
              
              d3.select("#tooltip")
                .html(`
                  <img src="static/img/flag/${d.alpha3Code.toLowerCase()}.gif"/>
                  ${d.continent} / ${d.location}</br></br>
                

                  <div class="row">
                    <div class="col">
                      Population
                    </div>
                    <div class="col">
                      Population Density
                    </div>
                  </div>
                  <div class="row">
                    <div class="col">
                      ${d.population ? d.population.toLocaleString() : "N/A"}
                    </div>
                    <div class="col">
                      ${d.population_density ? d.population_density.toLocaleString() : "N/A"}
                    </div>
                  </div>

                  <div class="row">
                    <div class="col">
                      New cases
                    </div>
                    <div class="col">
                      New Deaths
                    </div>
                  </div>
                  <div class="row">
                    <div class="col">
                      ${d.dataHashMap[that.date].new_cases.toLocaleString()}
                    </div>
                    <div class="col">
                      ${d.dataHashMap[that.date].new_deaths.toLocaleString()}
                    </div>
                  </div>

                  </br>

                  Click to see detail information
                `)
                .style('left', `${tooltipX}px`)
                .style('top', `${tooltipY}px`)
                .style('opacity', 0.8);

              d3.select(this)
                .attr('fill', '#fb9f01')

            })
            .on('mouseout', function(d) {
              d3.select("#tooltip")
                .style('left', `-9999px`)
                .style('top', `-9999px`)
                .style('opacity', 0);

              d3.select(this)
                .attr('fill', '#FB7E01')
            })
            .on('click', function(d) {
               d3.select("#tooltip")
                .style('left', `-9999px`)
                .style('top', `-9999px`)
                .style('opacity', 0);

              d3.select(this)
                .attr('fill', '#FB7E01')

              that.$router.push(`/detail?selected=${d.alpha3Code}&date=${that.date}`)
            })

          function transform(d) {
            let data = d

            d = new google.maps.LatLng(+d.latitude, +d.longitude);
            d = that.projection.fromLatLngToDivPixel(d);

            return d3.select(this)
                .style("left", (d.x - that.padding) + "px")
                .style("top", (d.y - that.padding) + "px");
          }
        };
      };
      
      overlay.setMap(this.map);

      this.overlay = overlay;
    },
    async onDateChange() {
      this.updateCircleScale()

      let marker = this.layer.selectAll('svg')
        .data(this.covidDataArray);

      let markerEnter = marker.enter();

      marker = marker.merge(markerEnter);

      marker.select("circle")
        .transition().duration(250)
        .attr("r", this.getRadius)
        .style('opacity', this.getOpacity);
    },
    getOpacity(d) {
      if(d.dataHashMap[this.date])
      {
        let v = this.getValue(d)
        if(v)
          return 0.5
        else
          return 0.0
      }
      else
      {
        return 0.0
      }
    },
    getRadius(d) {
      if(d.dataHashMap[this.date])
      {
        let r = this.circleScale(this.getValue(d))

        //Sometime there is no value with particular date.
        if(r)
        {
          return r
        }
        else
        {
          return 0
        }
      }
      else
      {
        return 0
      }
    },
    updateCircleScale() {
      let filteredCovidData = this.covidDataArray.filter(it => it.dataHashMap[this.date]);

      this.circleScale = d3.scaleLinear()
        .domain(
          [
            d3.min(filteredCovidData, d => this.getValue(d)), 
            d3.max(filteredCovidData, d => this.getValue(d))
          ]
        )
        .range([2, 100]).clamp(true);
    },
    getValue(d) {
      switch(this.category)
      {
        case "dailyCase":
          return d.dataHashMap[this.date].new_cases

        case "deailyDeath":
          return d.dataHashMap[this.date].new_deaths
        
        case "deailyCaseWithPoplulation":
        {
          let population = d.population
          let newCase = d.dataHashMap[this.date].new_cases

          if(population && newCase)
            return newCase / population
          else
            return null
        } 

        case "deailyCaseWithPoplulationDensity":
        {
          let population = d.population_density
          let newCase = d.dataHashMap[this.date].new_cases

          if(population && newCase)
            return newCase / population
          else
            return null
        }

        default:
          console.error(`Unknown category [${this.category}]`)
          return null
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
#map {
  width: 100%;
  height: 500px;
}

.covid-case {
  position: absolute;
}

.covid-case svg {
  width: 500px;
  height: 500px;
  font: 10px sans-serif;
  position: absolute;
  pointer-events: none;
}

.marker-circle {
  pointer-events: all;
}

.tooltip {
  font-size: 1em;
  position: absolute;
  top: 0px;
  left: 0px;
  padding: 10px 20px;
  border-radius: 5px;
  background: #1f8ac0;
  color: white;
}

</style>
