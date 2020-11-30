<template>
  <div style="width: 100%" ref="dateSlider" id="date-slider"></div>
</template>

<script>
import * as d3 from "d3"
import moment from "moment"
import CoivdData, { CovidData } from "../service/covid.data.service"

var formatDateIntoYear = d3.timeFormat("%Y %b");
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
    },
    playing: {
      type: Boolean,
      default: false
    },
    initDate: {
      type: String,
      default: "2020-11-11"
    }
  },
  data() {
    return {
      currentValue: 0,
      margin: {top:25, right:25, bottom:0, left:25},
      handle: undefined,
      label: undefined,
      xScale: undefined,
      timer: undefined,
    }
  },
  watch: {
    playing(newVal) {
      this.onPlayButtonClicked()
    }
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
        .classed("svg-container", true)
        .append("svg")
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("viewBox", `0 0 ${this.width} ${this.height}`)
        .classed("svg-content-responsive", true)

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
          .attr("class", "ticks")
          .attr("text-anchor", "middle")
          .text(formatDate(this.covidMinDate))
          .attr("transform", "translate(0, -25)")

      //Init slider to init date
      this.onSliderUpdated(new Date(this.initDate))
      this.currentValue = this.xScale(new Date(this.initDate))
    },
    onSliderUpdated(date) {
      this.handle.attr("cx", this.xScale(date));
      this.label
        .attr("x", this.xScale(date))
        .text(formatDate(date));

      this.$emit("on-date-update", moment(date).format("YYYY-MM-DD"))
    },
    onPlayButtonClicked() {
      if(this.playing)
      {
        this.timer = setInterval(this.onTimerStep, 250)
      }
      else
      {
        clearInterval(this.timer)
      }
    },
    onTimerStep() {
      let currentDate = this.xScale.invert(this.currentValue)
      let nextDate = moment(currentDate).add(1, 'days').toDate()
      let nextValue = this.xScale(nextDate)

      if (nextValue >= this.calcWidth) 
      {
        clearInterval(this.timer)
        this.$emit("on-play-end")
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
.svg-container {
    display: inline-block;
    position: relative;
    width: 100%;
    padding-bottom: 10%; /* aspect ratio */
    vertical-align: top;
    overflow: hidden;
}
.svg-content-responsive {
    display: inline-block;
    position: absolute;
    top: 10px;
    left: 0;
}

.ticks {
  font-size: 10px;
}
.ticks > text {
  fill: #dcdcdc;
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
