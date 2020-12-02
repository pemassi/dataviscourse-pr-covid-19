<template>
  <div>
    <h1 style="text-align: center;">Total Covid-19 Cases in The World</h1>
    <br/>
    <h5 style="text-align: right; ">Click and Play with the Data</h5>
    <div id="my_dataviz" style="position: relative"></div>
    <div ref="tooltip" id="tooltip" class="tooltip elevation-3" style="opacity: 0;"></div>
  </div>
</template>

<script>
import * as d3 from "d3";
import TotalChart from "../components/total.chart.component.vue";
import CoivdData, { CovidData } from "../service/covid.data.service";

var covidRawData = require("@/assets/data/owid-covid-data-2020-11-14.json");

export default {
  components: {
    TotalChart,
    CoivdData,
  },
  data() {
    return {
      selectedDate: "2020-11-13",
      data:[],
    };
  },
  created() {
  },

  watch: {

  },
  computed: {
  },
  mounted() {
    CovidData.initData()
    .then(()=> {
      this.circularPacking();
    })
  },
  updated() {
  },
  methods: {
    wrapperStyles() {
      return `height:${WRAPPER.height}px; width:${WRAPPER.width}px; margin:auto; background:${WRAPPER.background};`;
    },
    covidDataArray() {
      return  CovidData.covidDataArray;
    },
    covidMinDate() {
      return CovidData.minDate;
    },
    covidMaxDate() {
      return CovidData.maxDate;
    },
    circularPacking() {
      let that = this;
      this.data = this.covidDataArray();
      var width = window.innerWidth;
      var height = window.innerHeight;

      var svg = d3.select("#my_dataviz")
        .append("svg")
        .attr("width", width)
        .attr("height", height);


      var arrayData = this.data;
      console.log(arrayData);

      var size = d3.scaleLinear()
        .domain([0, 6000000])
        .range([7,75]);

      var totalCases = [];
      for(let i = 0; i < arrayData.length; i++) {
        let size = arrayData[i].data.length;
        var temp = arrayData[i].data[size-1].total_cases;
        var death = arrayData[i].data[size-1].total_deaths;
        if(temp === undefined) {
          temp = 0;
        }

        arrayData[i].latitude = temp;
        arrayData[i].longitude = death;
      }

      console.log(arrayData);

      var color = d3.scaleOrdinal(["#66c2a5", "#fc8d62", "#8da0cb", "#e78ac3", "#a6d854", "#ffd92f", "#e5c494", "#b3b3b3"]);

      var Tooltip = d3.select("#my_dataviz")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "2px")
        .style("border-radius", "5px")
        .style("padding", "5px");


      var node = svg.append("g")
        .selectAll("circle")
        .data(arrayData)
        .enter()
        .append("circle")
        //.attr("r", 25)
        .attr("r", function (d) {
          return size(d.latitude)
        })
        .attr("cx", width / 2)
        .attr("cy", height / 2)
        //.style("fill", "#69b3a2")
        .style("fill", function (d) {
          return color(d.continent)
        })
        .style("fill-opacity", 0.3)
        .style("stroke-width", 4)
        .on("mouseover mousemove",function (d) {
          let tooltipX = d3.event.pageX + 5;
          let tooltipY = d3.event.pageY;
          d3.select("#tooltip")
            .html(`
                  <img src="static/img/flag/${d.alpha3Code.toLowerCase()}.gif"/>
                  ${d.continent} / ${d.location}</br></br>

                  <div class="row">
                    <div class="col">
                        <img src="static/img/totalCases.png"/>  Total Cases: ${d.latitude ? d.latitude.toLocaleString() : "N/A"}
                    </div>
                    <div class="col">
                        <img src="static/img/population.png"/> Population:  ${d.population ? d.population.toLocaleString() : "N/A"}
                    </div>
                  </div>
                  <div class="row">
                    <div class="col">
                      <img src="static/img/totalDeaths.png"/>  Total Deaths:  ${d.longitude ? d.longitude.toLocaleString() : "N/A"}
                    </div>
                    <div class="col">
                        <img src="static/img/population.png"/>  Population Density:  ${d.population_density ? d.population_density.toLocaleString() : "N/A"}
                    </div>
                  </div>
                  <br/>
                  <div class="row">
                    <div class="col">
                        <img src="static/img/death.png"/>  Death Percentage of Total Cases:  ${(parseInt(d.longitude ? d.longitude.toLocaleString() : "N/A") / parseInt(d.latitude ? d.latitude.toLocaleString() : "N/A")).toFixed(2)}%
                    </div>
                  </div>
                  <hr/>
                  <div class="row">
                    <div class="col">
                        <img src="static/img/gdp.png"/>  GDP per Capita:  ${d.gdp_per_capita ? d.gdp_per_capita.toLocaleString() : "N/A"}
                    </div>
                    <div class="col">
                        <img src="static/img/diabetes.png"/>  Diabetes prevalence:  ${d.diabetes_prevalence ? d.diabetes_prevalence.toLocaleString() : "N/A"}
                    </div>
                  </div>
                   <hr/>
                   <div class="row">
                    <div class="col">
                       <img src="static/img/life.png"/>  Life Expectancy:  ${d.aged_65_older ? d.aged_65_older.toLocaleString() : "N/A"}
                    </div>
                  </div>
                  <hr/>
                  <div class="row">
                    <div class="col">
                        Aged 65 Older:  ${d.aged_65_older ? d.aged_65_older.toLocaleString() : "N/A"}
                    </div>
                    <div class="col">
                        Aged 70 Older:  ${d.aged_70_older ? d.aged_70_older.toLocaleString() : "N/A"}
                    </div>
                  </div>
                  <div class="row">
                    <div class="col">
                        Median Age:  ${d.median_age ? d.median_age.toLocaleString() : "N/A"}
                    </div>
                  </div>



                  </br>

                  Click to see detail information
                `)
            .style('left', `0px`)
            .style('top', `60px`)
            .style('opacity', 0.8);
          d3.select(this)
            .attr('fill', '#fb9f01')
        })
        .on("mouseleave mouseout", function (d) {
          d3.select("#tooltip")
            .style('left', `-9999px`)
            .style('top', `-9999px`)
            .style('opacity', 0);

          d3.select(this)
            .attr('fill', '#FB7E01')
        })
        .on('click', d => {
          that.$router.push(`/detail?selected=${d.alpha3Code}`)
        })
        .call(d3.drag() // call specific function when circle is dragged
          .on("start", function (d) {
            if (!d3.event.active) simulation.alphaTarget(.03).restart();
            d.fx = d.x;
            d.fy = d.y;
          })
          .on("drag", function (d) {
            d.fx = d3.event.x;
            d.fy = d3.event.y;

          })
          .on("end", function (d) {
            if (!d3.event.active) simulation.alphaTarget(.03);
            d.fx = null;
            d.fy = null;

          }));

      // Features of the forces applied to the nodes:
      var simulation = d3.forceSimulation()
        .force("forceX", d3.forceX().strength(.1).x(width * .5))
        .force("forceY", d3.forceY().strength(.1).y(height * .5))
        .force("center", d3.forceCenter().x(width * .5).y(height * .5))
        .force("charge", d3.forceManyBody().strength(-15))
        .force("collide", d3.forceCollide().strength(.2).radius(function(d){ return (size(d.latitude)+3) }).iterations(1));// Force that avoids circle overlapping

      // Apply these forces to the nodes and update their positions.
      // Once the force algorithm is happy with positions ('alpha' value is low enough), simulations will stop.
      simulation
        .nodes(arrayData)
        .on("tick", function (d) {
          node
            .attr("cx", function (d) {
              return d.x;
            })
            .attr("cy", function (d) {
              return d.y;
            })
        });
    },

  },

};
</script>

<style>
  .node circle {
    stroke: #3a403d;
    stroke-width: .5px;
  }
  #my_dataviz {
    text-align: center;
    position: relative;
  }
  .node:hover{
    stroke-width: 7px;
    opacity: 1;
  }
  .tooltip {
    font-size: 1em;
    position: absolute;
    top: 20px;
    left: 20px;
    padding: 10px 20px;
    border-radius: 5px;
    background: #1f8ac0;
    color: white;
    width: 600px;
  }


</style>
