<template>
  <icon :name="awesomeClass" aria-hidden="true"></icon>
</template>

<script>
    export default {
      name: "Awesome",
      props:{
        awesclass: {
          type: String,
          required: true
        }
      },
      computed: {
        awesomeClass(){
          return this.awesclass
        }
      }
    }
</script>

<style scoped>
  .fa-icon{
    color: #FFFFFF;
    width: 1em;
    height: 1em;
    vertical-align: middle;
    fill: currentColor;
    overflow: hidden;
  }
</style>
