<template>
  <div>
    <div id="map"></div>
  </div>
</template>

<script>


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
      styles: require("@/assets/data/google-map-style.json")
    }

    new google.maps.Map(d3.select("#map").node(), options);
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
