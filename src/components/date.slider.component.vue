<template>
  <div>
   <div class="col">
     <div class="row">
       <button class="btn btn-primary" @click="onPlayButtonClicked">{{playing ? "Stop" : "Play"}}</button>
     </div>
     <div class="row">
       <div ref="dateSlider" id="date-slider"></div>
     </div>
   </div>
  </div>
</template>

<script>
import * as d3 from "d3"
import moment from "moment"
import CoivdData, { CovidData } from "../service/covid.data.service"

var formatDateIntoYear = d3.timeFormat("%Y");
var formatDate = d3.timeFormat("%b %Y");
var parseDate = d3.timeParse("%m/%d/%y");

export default {
  data () {
    return {
    }
  },
  props: {
    height: {
      type: Number,
      default: 100
    },
    width: {
      type: Number,
      default: 960
    }
  },
  data() {
    return {
      playing: false,
      currentValue: 0,
      margin: {top:50, right:50, bottom:0, left:50},
      handle: undefined,
      label: undefined,
      xScale: undefined,
      timer: undefined,
    }
  },
  watch: {
  },
  computed: {
    covidDataArray() {
      return CovidData.covidDataArray
    },
    covidMinDate() {
      return new Date(CovidData.minDate)
    },
    covidMaxDate() {
      return new Date(CovidData.maxDate)
    },
    calcWidth() {
      return this.width - this.margin.left - this.margin.right
    },
    calcHeight() {
      return this.height - this.margin.top - this.margin.bottom
    }
  },
  mounted() {
    CovidData.initData().then(() => {
      this.initSlider()
    })
  },
  methods: {
    initSlider() {        
      let svg = d3.select("#date-slider")
        .append("svg")
        .attr("width", this.width)
        .attr("height", this.height)

      this.xScale = d3.scaleTime()
        .domain([this.covidMinDate, this.covidMaxDate])
        .range([0, this.calcWidth])
        .clamp(true)

      let slider = svg.append("g")
        .attr("class", "slider")
        .attr("transform", "translate(" + this.margin.left + "," + this.calcHeight/5 + ")")

      slider.append("line")
          .attr("class", "track")
          .attr("x1", this.xScale.range()[0])
          .attr("x2", this.xScale.range()[1])
        .select(function() { return this.parentNode.appendChild(this.cloneNode(true)) })
          .attr("class", "track-inset")
        .select(function() { return this.parentNode.appendChild(this.cloneNode(true)) })
          .attr("class", "track-overlay")
          .call(d3.drag()
              .on("start.interrupt", () => { slider.interrupt() })
              .on("start drag", () => {
                this.currentValue = d3.event.x
                this.onSliderUpdated(this.xScale.invert(this.currentValue))
              })
          )

      slider.insert("g", ".track-overlay")
          .attr("class", "ticks")
          .attr("transform", "translate(0," + 18 + ")")
        .selectAll("text")
          .data(this.xScale.ticks(10))
          .enter()
          .append("text")
          .attr("x", this.xScale)
          .attr("y", 10)
          .attr("text-anchor", "middle")
          .text((d) => { return formatDateIntoYear(d) })

      this.handle = slider.insert("circle", ".track-overlay")
          .attr("class", "handle")
          .attr("r", 9)

      this.label = slider.append("text")  
          .attr("class", "label")
          .attr("text-anchor", "middle")
          .text(formatDate(this.covidMinDate))
          .attr("transform", "translate(0," + (-25) + ")")
    },
    onSliderUpdated(date) {
      this.handle.attr("cx", this.xScale(date));
      this.label
        .attr("x", this.xScale(date))
        .text(formatDate(date));

      this.$emit("on-date-update", moment(date).format("YYYY-MM-DD"))
    },
    onPlayButtonClicked() {
      if(!this.playing)
      {
        this.timer = setInterval(this.onTimerStep, 250)
      }
      else
      {
        clearInterval(this.timer)
      }

      this.playing = !this.playing
    },
    onTimerStep() {
      let currentDate = this.xScale.invert(this.currentValue)
      let nextDate = moment(currentDate).add(1, 'days').toDate()
      let nextValue = this.xScale(nextDate)

      if (nextValue >= this.calcWidth) 
      {
        clearInterval(this.timer)
        this.playing = false
      }
      else
      {
        this.onSliderUpdated(nextDate)
        this.currentValue = nextValue
      }
    }
  }
}
</script>

<style>
.ticks {
  font-size: 10px;
}
.track,
.track-inset,
.track-overlay {
  stroke-linecap: round;
}

.track {
  stroke: #000;
  stroke-opacity: 0.3;
  stroke-width: 10px;
}

.track-inset {
  stroke: #dcdcdc;
  stroke-width: 8px;
}

.track-overlay {
  pointer-events: stroke;
  stroke-width: 50px;
  stroke: transparent;
  cursor: crosshair;
}

.handle {
  fill: #fff;
  stroke: #000;
  stroke-opacity: 0.5;
  stroke-width: 1.25px;
}
</style>
