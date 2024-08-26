import { defineStore } from "pinia";
import * as Cesium from "cesium";
import { ref, computed } from "vue";
export const useSetGraph = defineStore("graph", () => {
  const viewer = ref(null);
  const positions = ref([]);
  const set2Viewer = (v) => {
    viewer.value = v;
  };
  // 绘制线段
  const drawPolyline = (coordinates) => {
    const positionsArray = coordinates.map((coord) =>
      Cesium.Cartesian3.fromDegrees(coord.lng, coord.lat)
    );
    console.log("6446", positionsArray);
    viewer.value.entities.add({
      polyline: {
        positions: positionsArray,
        width: 2,
        material: Cesium.Color.BLUE,
      },
    });
  };
  let distance = ref(0);
  const MLine = (coordinates) => {
    distance.value += Cesium.Cartesian3.distance(
      Cesium.Cartesian3.fromDegrees(coordinates[0].lng, coordinates[0].lat),
      Cesium.Cartesian3.fromDegrees(coordinates[1].lng, coordinates[1].lat)
    );
  };

  //
  // const drawPolygon = (coordinates) => {
  //   const positionsArray = coordinates.map((coord) =>
  //     Cesium.Cartesian3.fromDegrees(coord.lng, coord.lat)
  //   );

  //   viewer.value.entities.add({
  //     polygon: {
  //       hierarchy: positionsArray,
  //       material: Cesium.Color.YELLOW.withAlpha(0.5),
  //     },
  //   });
  // };
  // 绘制圆
  const drawCircle = (center, radius) => {
    const centerCartesian = Cesium.Cartesian3.fromDegrees(
      center.lng,
      center.lat
    );

    viewer.value.entities.add({
      position: centerCartesian,
      ellipse: {
        semiMajorAxis: radius,
        semiMinorAxis: radius,
        material: Cesium.Color.GREEN.withAlpha(0.5),
      },
    });
  };
  const gotuMap = (coordinates) => {
    console.log("jisjdoaj", coordinates[0].lat, coordinates[0].lng, 20000);
    viewer.value.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(
        coordinates[0].lng,
        coordinates[0].lat,
        20000
      ),
      orientation: {
        heading: Cesium.Math.toRadians(90.0),
        pitch: Cesium.Math.toRadians(-90.0),
        roll: 0.0,
      },
      duration: 3,
    });
  };
  return {
    viewer,
    set2Viewer,
    drawPolyline,
    drawCircle,
    gotuMap,
    MLine,
    distance,
  };
});
