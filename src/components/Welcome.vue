<template>
  <div id="welcome">
    <div class="text">
      <span>有一美人兮,见之不忘</span>
      <br />
      <span>一日不见兮,思之如狂</span>
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style lang="less" scoped>
#welcome {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-image: url('../assets/welcome_bg.jpg');
  background-repeat: no-repeat;
  background-size: cover;
  .text {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
  span {
    font-size: 50px;
    background: linear-gradient(-3deg, #e6d70f 0%, #ee04b4 100%);
    background-clip: text;
    color: transparent;
  }
}
</style>
