<template>
  <div id="app">
    <header>
      <nav class="navbar navbar-light bg-light">
          <span class="navbar-brand mb-0 h1">COVID19</span>
      </nav>
    </header>

    <div class="container-fluid">
      <router-view/>
    </div>

    <footer>
    </footer>

  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
</style>
