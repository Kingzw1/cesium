import { defineStore } from "pinia";
import { computed, ref } from "vue";
import * as Cesium from "cesium";

// useStore 可以是 useUser、useCart 之类的任何东西
// 第一个参数是应用程序中 store 的唯一 id
export const useStoreCesium = defineStore("main", () => {
  let positions = ref([]); // 存储点击点的位置
  let points = ref([]); // 存储点实体
  let polyline = ref(null); // 存储线段实体
  let firstClickCartesian = ref(null); // 记录第一次点击的位置
  const tolerance = ref(10); // 定义点击点间的容差（单位：米）
  const drawMode = ref(null);
  const viewer = ref(null);
  let center = ref(null);
  let radius = ref(null);
  const setViewer = (newViewer) => {
    viewer.value = newViewer;
  };

  const morphTo2D = () => {
    if (viewer.value) {
      viewer.value.scene.morphTo2D(2.0);
    }
  };

  const morphTo3D = () => {
    if (viewer.value) {
      viewer.value.scene.morphTo3D(2.0);
    }
  };

  const morphToFlat = () => {
    if (viewer.value) {
      viewer.value.scene.morphToColumbusView(2.0);
    }
  };

  const toBeijing = () => {
    viewer.value.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(116.3975, 39.918, 5000),
      orientation: {
        heading: Cesium.Math.toRadians(-90.0),
        pitch: Cesium.Math.toRadians(-90.0),
        roll: 0.0,
      },
      duration: 3,
    });
  };

  const toShangHai = () => {
    viewer.value.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(121.4992, 31.2397, 4000),
      orientation: {
        heading: Cesium.Math.toRadians(-90.0),
        pitch: Cesium.Math.toRadians(-90.0),
        roll: 0.0,
      },
      duration: 3,
    });
  };

  const toGuanGdong = () => {
    viewer.value.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(113.3307, 23.1135, 5000),
      orientation: {
        heading: Cesium.Math.toRadians(-90.0),
        pitch: Cesium.Math.toRadians(-90.0),
        roll: 0.0,
      },
      duration: 3,
    });
  };

  const toShenZhen = () => {
    viewer.value.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(114.0559, 22.533, 5000),
      orientation: {
        heading: Cesium.Math.toRadians(-90.0),
        pitch: Cesium.Math.toRadians(-90.0),
        roll: 0.0,
      },
      duration: 3,
    });
  };

  const clearGraphics = () => {
    positions.value = []; //点的坐标
    points.value = []; // 存储点实体
    polyline.value = null; // 存储线段实体
    firstClickCartesian.value = null; // 记录第一次点击的位置
    viewer.value.entities.removeAll();
  };

  const setDrawMode = (mode) => {
    drawMode.value = mode;
    // 切换模式时清理之前的绘制
    clearGraphics();
  };

  return {
    positions,
    points,
    polyline,
    firstClickCartesian,
    tolerance,
    viewer,
    setViewer,
    morphTo2D,
    morphTo3D,
    morphToFlat,
    toBeijing,
    toShangHai,
    toGuanGdong,
    toShenZhen,
    clearGraphics,
    drawMode,
    center,
    radius,
    setDrawMode,
  };
});
