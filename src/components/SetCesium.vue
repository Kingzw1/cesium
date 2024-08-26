<template>
  <div class="layout">
    <div class="city-box">
      <p>点击要去到的城市</p>
      <div class="city">
        <el-button @click="toBJ">北京</el-button>
        <el-button @click="toSH">上海</el-button>
        <el-button @click="toGD">广东</el-button>
        <el-button @click="toSZ">深圳</el-button>
      </div>
    </div>
    <div class="view-box">
      <p>点击切换地图视角</p>
      <div class="view">
        <el-button @click="use3D">3D</el-button>
        <el-button @click="use2D">2D</el-button>
        <el-button @click="useFlat">平面</el-button>
      </div>
    </div>
    <div class="line-box">
      <p>设置线段属性</p>
      <div class="head">
        <el-button @click="DrawMode('polyline')" type="primary"
          >点击绘制点线面</el-button
        >
        <el-button @click="DrawMode('circle')" type="primary"
          >点击绘制圆</el-button
        >
      </div>

      <div class="slider-demo-block">
        <p>点与点合并容错{{ tolerance }}</p>
        <el-slider v-model="tolerance" :step="10" :min="10" :max="100" />
      </div>
      <div class="line">
        <div class="lineList">
          <div class="item" v-for="(item, index) in positions" :key="index">
            X:{{ item.x }}<br />Y:{{ item.y }}<br />Z:{{ item.z }}
          </div>
          <p>距离{{ lines.toFixed(2) }}米</p>
          <el-button @click="clear" class="but-right">清除数据</el-button>
        </div>
        <div class="length"></div>
      </div>
    </div>
    <form @submit.prevent="handleSubmit" class="formList">
      <div class="inputBod">
        <label>坐标点（经纬度，以逗号分隔多个点）:</label>
        <textarea v-model="coordinateInput"></textarea>
      </div>

      <div>
        <label>选择图形类型:</label>
        <select v-model="shapeType">
          <option value="line">线段</option>
          <!-- <option value="polygon">多边形</option> -->
          <option value="circle">圆形</option>
        </select>
        <p style="padding-left: 10px">距离{{ distance.toFixed(2) }}米</p>
      </div>

      <div v-if="shapeType === 'circle'">
        <label>半径 (米):</label>
        <input type="number" v-model="radius" />
      </div>

      <button type="submit">绘制</button>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from "vue";
import { useStoreCesium } from "../stores/index";
import * as Cesium from "cesium";
import { storeToRefs } from "pinia";
import { useSetGraph } from "../stores/useSetCesium";
const CesiumStore = useStoreCesium();
const graphStore = useSetGraph();
let { MLine } = graphStore;
let { distance } = storeToRefs(graphStore);
let { positions, tolerance } = storeToRefs(CesiumStore);
const {
  clearGraphics,
  toBeijing,
  toShangHai,
  toGuanGdong,
  toShenZhen,
  morphTo2D,
  morphTo3D,
  morphToFlat,
  setDrawMode,
} = CesiumStore;
const coordinateInput = ref("");
const shapeType = ref("line");
const radius = ref(1000);

const use2D = () => {
  morphTo2D();
};

const use3D = () => {
  morphTo3D();
};

const useFlat = () => {
  morphToFlat();
};

const toBJ = () => {
  toBeijing();
};

const toSH = () => {
  toShangHai();
};

const toGD = () => {
  toGuanGdong();
};

const toSZ = () => {
  toShenZhen();
};

const clear = () => {
  clearGraphics();
};

const lines = computed(() => {
  let distance = 0;
  for (let i = 0; i < positions.value.length - 1; i++) {
    const point1 = positions.value[i];
    const point2 = positions.value[i + 1];
    distance += Cesium.Cartesian3.distance(point1, point2);
  }
  return distance;
});

const DrawMode = (demo) => {
  setDrawMode(demo);
};

const handleSubmit = () => {
  const coordinates = coordinateInput.value.split(";").map((coord) => {
    const [lng, lat] = coord.split(",").map(Number);
    return { lng, lat };
  });
  console.log("???", coordinates);
  graphStore.gotuMap(coordinates);
  if (shapeType.value === "line") {
    graphStore.drawPolyline(coordinates);
    MLine(coordinates);
  } else if (shapeType.value === "circle" && coordinates.length === 1) {
    graphStore.drawCircle(coordinates[0], Number(radius.value));
  }
};

/*
坐标连线测试数据
广州-深圳
113.3307,23.1135;114.0559,22.533
杭州-上海
120.152925,30.248748;121.4992,31.2397
北京-天津
116.3975,39.918;117.186310,39.154161
*/
</script>

<style scoped lang="scss">
.layout {
  width: 300px;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: auto;
  .city-box {
    width: 300px;
    height: 100px;

    p {
      padding-left: 10px;
    }
    .city {
      width: 250px;
      padding-bottom: 10px;
      margin: 0 auto;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      .el-button {
        width: 50px;
        margin-left: 0;
      }
    }
  }
  .view-box {
    height: 85px;
    border-top: 1px solid red;
    p {
      padding-left: 10px;
    }
    .view {
      display: flex;
      justify-content: center;
    }
  }
  .line-box {
    // width: 300px;
    margin-top: 10px;
    border-top: 1px solid red;

    .head {
      height: 60px;
      display: flex;
      justify-content: space-around;
      align-items: center;
    }
    .slider-demo-block {
      width: 250px;
      margin: 0 auto;
    }
    p {
      padding-left: 10px;
    }
    .line {
      display: flex;
      flex-direction: column;
      .lineList {
        width: 300px;
        .item {
          margin-left: 10px;
          margin-top: 10px;
          width: 250px;
          height: 65px;
          text-align: center;
          background-color: rgb(212, 212, 212);
          box-shadow: 5px 5px rgb(185, 185, 185);
        }
        .but-right {
          margin-left: 200px;
        }
      }
    }
  }
  .formList {
    border-top: 1px solid red;
    margin-top: 10px;
    padding-left: 10px;
    .inputBod {
      label {
        margin-top: 10px;
      }
      textarea {
        width: 250px;
        height: 150px;
      }
    }
  }
}
</style>