<template>
  <div id="cesiumContainer"></div>
</template>

<script setup>
import * as Cesium from "cesium";
import { onMounted, ref, watch } from "vue";
import { useStoreCesium } from "../stores/index";
import { storeToRefs } from "pinia";
import { useSetGraph } from "../stores/useSetCesium";

const CesiumStore = useStoreCesium();
const graphStore = useSetGraph();
const { set2Viewer } = graphStore;
let {
  positions,
  points,
  polyline,
  firstClickCartesian,
  tolerance,
  drawMode,
  center,
  radius,
} = storeToRefs(CesiumStore);
const { setViewer } = CesiumStore;
onMounted(() => {
  Cesium.Ion.defaultAccessToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJhNmFmN2Y2MC0zMmYxLTRlYTQtYWEyNi02ZDcwZWRkODE5Y2UiLCJpZCI6MjM0MDYyLCJpYXQiOjE3MjMzODM1MTB9.F58rWG5ZjLPMpzZa9r72fhHqZnI7Z2S1zWzh_QXHCVo";
  const viewer = new Cesium.Viewer("cesiumContainer", {
    timeline: false, //时间控件
    animation: false, //动画控件
    baseLayerPicker: false, //图层选择按钮
    navigationHelpButton: false, //帮助按钮
    sceneModePicker: false, //取消图层控件
    fullscreenButton: false,
  });
  setViewer(viewer);
  set2Viewer(viewer);
  const handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);

  const setCircle = () => {
    if (drawMode.value === "circle") {
      handler.setInputAction(function (click) {
        const cartesian = viewer.scene.pickPosition(click.position);
        // 添加点击点;
        const point = viewer.entities.add({
          position: cartesian,
          point: {
            pixelSize: 10,
            color: Cesium.Color.RED,
          },
        });
        points.value.push(point);
        positions.value.push(cartesian);

        // 连接线段
        if (positions.value.length > 1) {
          if (polyline) {
            viewer.entities.remove(polyline);
          }
          polyline = viewer.entities.add({
            polyline: {
              positions: positions.value,
              width: 2,
              material: Cesium.Color.BLUE,
            },
          });
        }
        if (!center.value) {
          center.value = cartesian;
        } else {
          radius.value = Cesium.Cartesian3.distance(center.value, cartesian);
          viewer.entities.add({
            position: center.value,
            ellipse: {
              semiMajorAxis: radius.value,
              semiMinorAxis: radius.value,
              material: Cesium.Color.GREEN.withAlpha(0.5),
            },
          });
          center.value = undefined;
        }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    } else if (drawMode.value === "polyline") {
      // 处理鼠标点击事件
      handler.setInputAction(function (click) {
        const cartesian = viewer.scene.pickPosition(click.position);
        if (Cesium.defined(cartesian)) {
          // 如果这是第一次点击，记录第一次点击的位置
          if (positions.value.length === 0) {
            firstClickCartesian.value = cartesian;
          }

          // 添加点击点
          const point = viewer.entities.add({
            position: cartesian,
            point: {
              pixelSize: 10,
              color: Cesium.Color.RED,
            },
          });
          points.value.push(point);
          positions.value.push(cartesian);

          // 连接线段
          if (positions.value.length > 1) {
            if (polyline) {
              viewer.entities.remove(polyline);
            }
            polyline = viewer.entities.add({
              polyline: {
                positions: positions.value,
                width: 2,
                material: Cesium.Color.BLUE,
              },
            });
          }

          // 判断是否形成多边形
          if (
            positions.value.length > 2 &&
            isCloseToFirstClick(
              cartesian,
              firstClickCartesian.value,
              tolerance.value
            )
          ) {
            // 移除最后一个点，并闭合多边形
            positions.value.pop();
            positions.value.push(firstClickCartesian.value);

            // 创建多边形
            viewer.entities.add({
              polygon: {
                hierarchy: new Cesium.PolygonHierarchy(positions.value),
                material: Cesium.Color.YELLOW.withAlpha(0.5),
              },
            });

            // 清空点和线的实体，准备下次绘制
            positions.value = [];
            points.value.forEach((point) => viewer.entities.remove(point));
            points.value = [];
            if (polyline) {
              viewer.entities.remove(polyline);
            }
          }
        }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    } else {
      return;
    }
  };

  // 判断新点击的位置是否接近第一次点击的位置
  function isCloseToFirstClick(cartesian, firstClickCartesian, tolerance) {
    const distance = Cesium.Cartesian3.distance(cartesian, firstClickCartesian);
    return distance < tolerance;
  }

  // 监听要切换的类型
  watch(drawMode, () => {
    setCircle();
  });
});
</script>

<style scoped>
</style>
