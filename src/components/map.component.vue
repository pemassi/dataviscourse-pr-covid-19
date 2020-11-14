<template>
  <div>
    <div ref="map" id="map"></div>
  </div>
</template>

<script>
import CoivdData, { CovidData } from "../service/covid.data.service"

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
      }
  },
  data() {
    return {
      padding: 200,
      overlay: undefined,
      layer: undefined,
      projection: undefined,
      circleScale: undefined
    }
  },
  watch: {
    date(newVal, oldVal) {
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
          console.log("REMOVE")
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
            .attr("class", "marker");

          marker.select("circle")
            .attr("cx", that.padding)
            .attr("cy", that.padding)
            .attr("r", that.getRadius)
            .style('opacity', that.getOpacity)
            .attr('fill', d => {
                return '#FB7E01'
            });

          function transform(d) {
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
        .transition().duration(1000)
        .attr("r", this.getRadius)
        .style('opacity', this.getOpacity);
    },
    getOpacity(d) {
      if(d.dataHashMap[this.date])
      {
        if(d.dataHashMap[this.date] <= 0)
          return 0.0
        else
          return 0.5
      }
      else
      {
        return 0.0
      }
    },
    getRadius(d) {
      if(d.dataHashMap[this.date])
      {
        return this.circleScale(d.dataHashMap[this.date].new_cases)
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
            d3.min(filteredCovidData, d => d.dataHashMap[this.date].new_cases), 
            d3.max(filteredCovidData, d => d.dataHashMap[this.date].new_cases)
          ]
        )
        .range([1, 100]).clamp(true);
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
}

</style>