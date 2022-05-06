import * as EsbuildTemplate from "./src/esjs/EsbuildTemplate.js";
import './src/js/template.js'
let esbuildTemplate = new EsbuildTemplate.TemplateMore0()

import { Viewer } from 'cesium';
import * as Cesium from 'cesium';
import { InitViewer } from "./src/static/lib/initViewer.js";


async function initCesium() {
  let intViewer = new InitViewer()
  const viewer = intViewer.addViewer('cesiumContainer')
  const LNG = 121.52,
    LAT = 38.875;
  viewer.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(LNG, LAT, 300),
    orientation: {
      heading: Cesium.Math.toRadians(0.0),
      pitch: Cesium.Math.toRadians(-90.0),
    }
  });

  let tdtCva = new Cesium.WebMapTileServiceImageryProvider({
    url: "http://{s}.tianditu.gov.cn/img_c/wmts?service=wmts&request=GetTile&version=1.0.0" +
      "&LAYER=img&tileMatrixSet=c&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}" +
      "&style=default&format=tiles&tk=8a7a551905711535885142a660a10111",
    layer: "tdtCva",
    style: "default",
    format: "tiles",
    tileMatrixSetID: "c",
    subdomains: ["t0", "t1", "t2", "t3", "t4", "t5", "t6", "t7"],
    tilingScheme: new Cesium.GeographicTilingScheme(),
    tileMatrixLabels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18"],
    maximumLevel: 18,
    show: false
  });
  let layers = viewer.imageryLayers;
  layers.addImageryProvider(tdtCva);

  let control_point = await fetch('/control_point.geojson');
  let control_point_json = await control_point.json();
  let control_point_json_new
  control_point_json_new.type = control_point_json.type
  control_point_json_new.name = control_point_json.name
  control_point_json_new.crs = control_point_json.crs
  control_point_json_new.features = []

  // 剔除空数据 后放入control_point_json_new
  let features = control_point_json.features
  console.log(features)
  for (let index = 0; index < features.length; index++) {
    const feature = features[index];
    if(feature.geometry) control_point_json_new.features.push(feature)
  }

  // 组织clampToHeightMostDetailed 可以识别的位置数组
  features = control_point_json_new.features
  let positions  = []
  for (let index = 0; index < features.length; index++) {
    const feature = features[index];
    // Cesium.Cartesian3.fromDegrees(86.925145, 27.988257,100000),
    // 100000确保沿大地表面法线将给定的笛卡尔位置固定到场景几何体时为太空到地心方向
    positions.push(Cesium.Cartesian3.fromDegrees(feature.geometry.coordinates[0],feature.geometry.coordinates[1],100000))
  }

  // TODO 每个json地块遍历   去除0 表示没交点  不考虑瓦块空洞   深度检测开启
  viewer.scene.globe.depthTestAgainstTerrain = true






  // fetch('/control_point.geojson')
  // .then(function(response) {
  //   console.log(response.headers.get('Content-Type'))
  // console.log(response.headers.get('Date'))
  // console.log(response.status)
  // console.log(response.statusText)
  //   return response.json()
  // }).then(function(json) {
  //   console.log('parsed json', json)
  // }).catch(function(ex) {
  //   console.log('parsing failed', ex)
  // })




}

initCesium()
console.log('test1')