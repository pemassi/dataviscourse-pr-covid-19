<template>
  <div>
    <div class="input-group mb-3">
      <input v-model="selectedDate" type="text" class="form-control">
      <div class="input-group-append">
        <button class="btn btn-outline-secondary" type="button">Button</button>
      </div>
    </div>


  </div>
</template>

<script>

export default {
  components: {
  },
  data () {
    return {
      selectedDate: "2020-11-13"
    }
  },
  computed: {
  },
  mounted() {
  },
  methods: {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
</style>
