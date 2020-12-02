<template>
  <div ref="wrapper">
    <div ref="chart" :id="id"></div>
  </div>
</template>

<script>
import * as d3 from "d3";
import CoivdData, { CovidData } from "../service/covid.data.service"

export default {
  data () {
    return {
    }
  },
  props: {
    id: {
      type: String,
      default: "age-pie-chart",
    },
    selectedCountry: {
      type: String,
      default: "USA",
    },
  },
  data() {
    return {
      width: 0,
      height: 300,
      margin: 40,
      d3Data: {},
      ddd: {},
    }
  },
  watch: {
    selectedCountry (newVal) {
      this.loadData()
      this.draw()
      this.addListeners()
    },
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
    radius() {
      return Math.min(this.width, this.height) / 2 - this.margin
    }
  },
  mounted() {
    CovidData.initData()
      .then(() => {
        this.init()
        this.loadData()
        this.draw()
        this.addListeners()
      })
  },
  methods: {
    init() {
      this.width = this.$refs.wrapper.clientWidth
      window.addEventListener('resize', () => { 
        this.width = this.$refs.wrapper.clientWidth
        
        this.draw();
        this.addListeners();
      })

      this.ddd.tooltip = d3.select('body')
        .append('div')
        .attr('class', 'tooltip elevation-3')
        .style('opacity', 0)
    },
    loadData() {
      let aged65Older = this.selectedCountryData.aged_65_older
      let aged70Older = this.selectedCountryData.aged_70_older
      let younger = 100 - (aged65Older + aged70Older)

      this.d3Data = {
        younger: younger,
        aged65Older: aged65Older,
        aged70Older: aged70Older
      }
    },
    draw() {
      let that = this

      d3.select(`#${this.id}`).selectAll("*").remove()

      this.ddd.svg = d3.select(`#${this.id}`)
        .append("svg")
          .attr("width", this.width)
          .attr("height", this.height)
        .append("g")
          .attr("transform", "translate(" + this.width / 2 + "," + this.height / 2 + ")")

      this.ddd.color = d3.scaleOrdinal()
        .domain(this.d3Data)
        .range(["#05394F", "#E1FF42", "#FF6162"])

      this.ddd.pie = d3.pie()
        .value(d => d.value)

      this.ddd.dataReady = this.ddd.pie(d3.entries(this.d3Data))

      this.ddd.arc = d3.arc()
        .innerRadius(this.radius - 25)
        .outerRadius(this.radius)
        
        
        // .append('path')
        // .attr('d', d3.arc()
        //   .innerRadius(0)
        //   .outerRadius(this.radius)
        // )

      this.ddd.svg
        .selectAll('whatever')
        .data(this.ddd.dataReady)
        .enter()
        .append('path')
        .attr('fill', d => this.ddd.color(d.data.key))
        .attr("stroke", "gray")
        .style("stroke-width", "1px")
        .style("opacity", 1)
        .transition()
        .delay((d, i) => 1000 + (i * 300))
        .attrTween('d', function(d) {
          var i = d3.interpolate(d.startAngle+0.1, d.endAngle);
          return function(t) {
              d.endAngle = i(t);
            return that.ddd.arc(d);
        }})
    },
    addListeners() {
      let component = this

      this.ddd.svg.selectAll("path")
        .on('mouseover', function(d, index) {
          let tooltipX = d3.event.pageX + 5;
          let tooltipY = d3.event.pageY;

          component.ddd.tooltip.html(`${component.keyNametoDataName(d.data.key)}<br><br>${d.data.value.toLocaleString()}%` )
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
    },
    keyNametoDataName(key) {
      switch(key)
      {
        case "younger":
          return "0 ~ 64"
        case "aged65Older":
          return "65 ~ 69"
        case "aged70Older":
          return "70 ~"
      }
    },
  },
}
</script>

<style>
</style>
