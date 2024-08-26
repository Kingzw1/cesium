<template>
  <div class="layout">
    <div class="left">
      <Cesium></Cesium>
    </div>
    <div class="right">
      <SetCesium></SetCesium>
    </div>
  </div>
</template>


<script setup>
import Cesium from "./components/Cesium.vue";
import SetCesium from "./components/SetCesium.vue";
</script>


<style scoped lang="scss">
.layout {
  width: 100%;
  height: 100vh;
  display: flex;
  .left {
    flex: 1;
  }
  .right {
    width: 300px;
    height: 100%;
  }
}
</style>
