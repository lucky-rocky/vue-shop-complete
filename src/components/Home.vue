<template>
  <div id="home"></div>
</template>

<script>
export default {
  name: 'home',
  async mounted() {
    console.log(1)
    await this.$axios.get('categories/6')
  }
}
</script>

<style lang="less" scoped>
#home {
  width: 100%;
  height: 100%;
  background-color: #660088;
}
</style>
