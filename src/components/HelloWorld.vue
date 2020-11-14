<template>
  <div>
    <div id="map"></div>

  </div>
</template>

<script>
  const googleStyles = require("@/assets/data/google-map-style.json");
  const covidData = require("@/assets/data/owid-covid-data-2020-11-14.json");
  const latlngMapping = require("@/assets/data/latlng.json");

  export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },
  mounted() {
    let options = {
      zoom: 4,
      center: new google.maps.LatLng(44.193444, 28.649466),
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      styles: googleStyles
    }

    new google.maps.Map(d3.select("#map").node(), options);

    console.log(covidData);

    for(var key in covidData)
    {
      let temp = latlngMapping[key];

      if(temp == undefined)
        console.log(key);
    }



  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#map {
  width: 100%;
  height: 500px;
}

</style>
