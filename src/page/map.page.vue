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
  computed: {
    covidDataArray() {
      return CovidData.covidDataArray
    },
    covidMinDate() {
      return CovidData.minDate
    },
    covidMaxDate() {
      return CovidData.maxDate
    }
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
        console.log(this.getPanes());

        let layer = d3.select(this.getPanes().overlayMouseTarget).append("div")
            .attr("class", "covid-case");

        overlay.onRemove = function () {
            d3.select('.covid-case').remove();
        };

        overlay.draw = function () {

            let projection = this.getProjection(),
                padding = 200;

            let circleScale = d3.scaleLinear()
                .domain([d3.min(that.covidDataArray, d => d.data[d.data.length - 1].new_cases), d3.max(that.covidDataArray, d => d.data[d.data.length - 1].new_cases)])
                .range([1, 100]).clamp(true);

            let marker = layer.selectAll('svg')
                .data(that.covidDataArray);

            let markerEnter = marker.enter().append("svg");

            // add the circle
            markerEnter.append("circle");

            marker.exit().remove();

            marker = marker.merge(markerEnter);

            marker
                .each(transform)
                .attr("class", "marker");

            marker.select("circle")
                .attr("r", d => circleScale(d.data[d.data.length - 1].new_cases))
                .attr("cx", padding)
                .attr("cy", padding)
                .style('opacity', .5)
                .attr('fill', d => {
                    return '#FB7E01'
                })
                .on('click', d => console.log(d));

            function transform(d) {
              d = new google.maps.LatLng(+d.latitude, +d.longitude);
              d = projection.fromLatLngToDivPixel(d);

              return d3.select(this)
                  .style("left", (d.x - padding) + "px")
                  .style("top", (d.y - padding) + "px");
            }
        };
      };
      // Bind our overlay to the map…
      overlay.setMap(this.map);

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
