<template>
  <div class="wrapper">
    <header>
      <nav class="navbar navbar-expand-sm bg-dark navbar-dark" id="navbar-Container">
        <span class="navbar-brand mb-0 h1">COVID-19</span>

        <ul class="navbar-nav" >
          <li><router-link class="navLink" :to="{ name: 'Summary' }">Summary</router-link></li>
          <li><router-link class="navLink" :to="{ name: 'Daily' }">Daily</router-link></li>
          <li><router-link class="navLink" :to="{ name: 'Detail' }">Detail</router-link></li>

        </ul>
      </nav>
    </header>

    <div class="container-fluid">
      <br/>
      <keep-alive>
        <router-view/>
      </keep-alive>
    </div>

    <footer class="page-footer font-small blue">

      <!-- Copyright -->
      <div class="footer-copyright text-center py-3">
        <p>Data is updated on {{covidMaxDate}}</p>
        <p>© 2020 Copyright Kyungyoon Kim, Daniel Pak</p>
      </div>
      <!-- Copyright -->

    </footer>

  </div>
</template>

<script>
import { CovidData } from "./service/covid.data.service"

export default {
  name: 'App',
  data() {
    return {
      covidMaxDate: "2020-01-01"
    }
  },
  computed: {
  },
  mounted() {
    CovidData.initData()
      .then(() => {
        this.covidMaxDate = CovidData.maxDate
      })
  }
}
</script>

<style>
html, body {
  height: 100%;
  background-color: #1f2329;
  color: #ffffff;
}

.navLink {
  color: #ffffff;
  transition: transform .2s;
  padding: 10px;
}

.navLink:hover {
  color: #ffffff;
}

.container-fluid, .wrapper {
  height: 100%;
}

.content-area, .article-tree{
  overflow:auto;
  height: 100%;
}

.footer-copyright {
  color: gray;
}

</style>
