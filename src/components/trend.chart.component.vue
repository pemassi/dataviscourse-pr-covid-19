<template>
  <div
    class="elevation-5 pt-4"
    :style="wrapperStyles"
    ref="wrapper"
  >
    <div :id="id" @click="counter++">
    </div>
  </div>
</template>

<script>
import * as d3 from "d3";
import { CovidData } from "../service/covid.data.service"
import moment from 'moment'

const WRAPPER = {
  width: 900,
  height: 300,
  padding: 0,
  background: '#1f2329'
};
const CANVAS = {
  margin: {
    top: 20,
    right: 20,
    bottom: 25,
    left: 70
  }
};
const CHART = {
  width: WRAPPER.width - WRAPPER.padding * 2 - CANVAS.margin.right - CANVAS.margin.left,
  height: WRAPPER.height - WRAPPER.padding * 2 - CANVAS.margin.top - CANVAS.margin.bottom,
  background: '#1f2329',
  barColor: '#104c91',
  barOffset: 0
};

export default {
  data() {
    return {
      axis: {
        x: {},
        y: {}
      },
      ddd: {},
      id: 'trendchart',
      changedDate: "2020-01-01",
      counter:0,
      d3Data: [],
    }
  },
  props: {
    selectedCountry: {
      type: String,
      default: "USA",
    },
    category: {
      type: String,
      default: "daily",
    }
  },
  computed: {
    wrapperStyles () {
      return `height:${WRAPPER.height}px; width: 100%; margin:auto; background:${WRAPPER.background};`;
    },
    covidDataArray() {
      return CovidData.covidDataArray
    },
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
        console.error(e)
        return null
      }
    },
  },
  watch: {
    changedDate(newVal, oldVal) {
    },

    counter(newVal, oldVal) {
      this.$emit('changeDate', this.changedDate);
    },

    selectedCountry (newVal) {
      this.d3Data = this.selectedCountryData.data

      this.draw();
      this.addListeners();
    },

    category(newVal) {
      this.draw();
      this.addListeners();
    }
  },
  mounted () {
    CovidData.initData()
      .then(() => {
        this.init()
        this.draw()
        this.addListeners()
      })
  },
  methods: {
    init() {
      WRAPPER.width = this.$refs.wrapper.clientWidth
      CHART.width = WRAPPER.width - WRAPPER.padding * 2 - CANVAS.margin.right - CANVAS.margin.left
      CHART.height = WRAPPER.height - WRAPPER.padding * 2 - CANVAS.margin.top - CANVAS.margin.bottom

      this.ddd.tooltip = d3.select('body')
        .append('div')
        .attr('class', 'tooltip elevation-3')
        .style('opacity', 0)

      window.addEventListener('resize', () => { 
        WRAPPER.width = this.$refs.wrapper.clientWidth
        CHART.width = WRAPPER.width - WRAPPER.padding * 2 - CANVAS.margin.right - CANVAS.margin.left
        CHART.height = WRAPPER.height - WRAPPER.padding * 2 - CANVAS.margin.top - CANVAS.margin.bottom
        
        this.draw();
        this.addListeners();
      })
    },

    draw () {
      d3.select(`#${this.id}`).selectAll("*").remove()
      
      this.ddd.svg = d3.select(`#${this.id}`)
        .append('svg')
        .attr('width', CHART.width + CANVAS.margin.right + CANVAS.margin.left)
        .attr('height', CHART.height + CANVAS.margin.top + CANVAS.margin.bottom)
        .style('background', CHART.background)
        
      // X axis
      this.axis.x.values = d3.scaleTime()
        .domain([moment(this.d3Data[0].date).toDate(), moment(this.d3Data[this.d3Data.length - 1].date).toDate()])
        .range([0, CHART.width]);

      // x ticks
      this.axis.x.ticks = d3.axisBottom(this.axis.x.values)
        .ticks(10);

      this.axis.x.scale = d3.scaleBand()
        .domain(this.d3Data.map(d => d.date))
        .range([0, CHART.width])
        .paddingInner(CHART.barOffset)
        .paddingOuter(0)

      let xGuide = this.ddd.svg.append('g')
        .attr('transform', `translate(${CANVAS.margin.left}, ${CANVAS.margin.top + CHART.height})`)
        .attr("class", "axis")
        .call(this.axis.x.ticks);

      // Y axis
      this.axis.y.values = d3.scaleLinear()
        .domain([0, d3.max(this.d3Data, d => this.getValue(d))])
        .range([CHART.height, 0]);

      // How many ticks are on the y axis
      this.axis.y.ticks = d3.axisLeft(this.axis.y.values)
        .ticks(3);

      this.axis.y.scale = d3.scaleLinear()
        .domain([0, d3.max(this.d3Data, d => this.getValue(d))])
        .range([0, CHART.height]);

      // translate(x, y) specifies where y axis begins, drawn from top to bottom
      let yGuide = this.ddd.svg.append('g')
        .attr('transform', `translate(${CANVAS.margin.left}, ${CANVAS.margin.top})`)
        .attr("class", "axis")
        .call(this.axis.y.ticks);

      // translate(x, y) specifies where bar begin
      this.ddd.chart = this.ddd.svg.append('g')
        .attr('transform', `translate(${CANVAS.margin.left + 1}, 0)`)
        .selectAll('rect')
        .data(this.d3Data)
        .enter()
        .append('rect');

      this.ddd.chart
        .attr("class", "pointer")
        .attr('fill', (data, index) => {
          return CHART.barColor
        })
        // .width sets width of bar
        .attr('width', this.axis.x.scale.bandwidth())
        .attr('x', (d, i) => this.axis.x.scale(d.date))
        .attr('y', CHART.height + CANVAS.margin.top);

      // .delay sets drawing speed
      this.ddd.chart
        .transition()
        .delay((d, i) => i * 5)
        .duration(100)
        .ease(d3.easeCircleIn)
        .attr('y', d => CHART.height - this.axis.y.scale(this.getValue(d)) + CANVAS.margin.top)
        .attr('height', d => this.axis.y.scale(this.getValue(d)));
    },
    addListeners () {
      let component = this;
      let clickedDate = this.d3Data.x;
      
      this.ddd.chart
        .on('mouseover', function(d, index) {
          let tooltipX = d3.event.pageX + 5;
          let tooltipY = d3.event.pageY;

          component.ddd.tooltip.html(`Date : ${d.date} <br> New Cases : ${component.getValue(d).toLocaleString()}` )
            .style('left', `${tooltipX}px`)
            .style('top', `${tooltipY}px`)
            .style('opacity', 0.8);

          d3.select(this)
            .style('opacity', 0.5)
        })
        .on('mouseout', function(data) {
          component.ddd.tooltip.html('')
            .style('left', `-999px`)
            .style('top', `-999px`)
            .style('opacity', 0);

          d3.select(this)
            .transition()
            .duration(300)
            .style('opacity', 1)
        })
        .on('click', d => {
          component.ddd.tooltip.html('')
            .style('left', `-999px`)
            .style('top', `-999px`)
            .style('opacity', 0);

          this.$emit("on-date-click", d.date, this.selectedCountry)
        })
    },
    getValue(d) {
      switch(this.category)
      {
        case "daily":
          return d.new_cases
        
        case "total":
          return d.total_cases
      }
    }
  },
};
</script>

<style>
.application {
  font-family: 'Raleway', sans-serif;
  line-height: 2rem;
  text-align: center;
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

.axis path {
  stroke: white;
}
.axis line {
  stroke: white;
}
.axis text {
  fill: white;
}

.pointer {cursor: pointer;}
</style>
