<template>
  <div class="wrapper">
    <header>
      <nav class="navbar navbar-expand-sm bg-dark navbar-dark">
        <span class="navbar-brand mb-0 h1">COVID-19</span>

        <ul class="navbar-nav">
          <li><router-link class="navLink" :to="{ name: 'Map' }">Map</router-link></li>
          <li><router-link class="navLink" :to="{ name: 'Static' }">Static</router-link></li>
        </ul>
      </nav>
    </header>

    <div class="container-fluid">
      <br/>

      <router-view/>
    </div>

    <footer class="page-footer font-small blue">

      <!-- Copyright -->
      <div class="footer-copyright text-center py-3">© 2020 Copyright
        Kyungyoon Kim, Daniel Pak
      </div>
      <!-- Copyright -->

    </footer>

  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
html, body {
    height: 100%;
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

</style>
