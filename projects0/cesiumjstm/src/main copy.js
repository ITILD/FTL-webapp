import * as EsbuildTemplate from "./esjs/EsbuildTemplate.js";
import './js/template.js'
let esbuildTemplate = new EsbuildTemplate.TemplateMore0()
debugger
import { Viewer } from 'cesium';
import * as Cesium from 'cesium';
import { InitViewer } from "./static/lib/initViewer.js";
const $ = id => document.getElementById(id)
const $$ = className => document.querySelector(className)
let cartesians = []
async function initCesium() {
  // 1.初始化场景
  let intViewer = new InitViewer()
  const viewer = intViewer.addViewer('cesiumContainer')
  const LNG = 121.52,
    LAT = 38.875;

  // 视角固定
  // viewer.camera.flyTo({
  viewer.camera.setView({
    destination: Cesium.Cartesian3.fromDegrees(LNG, LAT, 50000),
    orientation: {
      heading: Cesium.Math.toRadians(0.0),
      pitch: Cesium.Math.toRadians(-90.0),
    }
  });



  // 天地图底图加载
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

  // let setPoint = new Set()

  // 点位数据
  let control_point = await fetch('/control_point.geojson');
  let control_point_json = await control_point.json();
  let control_point_json_new = {}
  control_point_json_new.type = control_point_json.type
  control_point_json_new.name = control_point_json.name
  control_point_json_new.crs = control_point_json.crs
  control_point_json_new.features = []

  // 剔除空数据 后放入control_point_json_new
  let features = control_point_json.features
  console.log(features)
  for (let index = 0; index < features.length; index++) {
    const feature = features[index];
    if (feature.geometry) control_point_json_new.features.push(feature)
    // setPoint.add(feature.properties.DataPosition)
  }
  // console.log('set', setPoint)

  // 组织clampToHeightMostDetailed 可以识别的位置数组
  features = control_point_json_new.features

  debugger
  for (let index = 0; index < features.length; index++) {
    const feature = features[index];
    // Cesium.Cartesian3.fromDegrees(86.925145, 27.988257,100000),
    // 100000确保沿大地表面法线将给定的笛卡尔位置固定到场景几何体时为太空到地心方向
    cartesians.push(Cesium.Cartesian3.fromDegrees(feature.geometry.coordinates[0], feature.geometry.coordinates[1], 500))
  }
  debugger
  // TODO 每个json地块遍历   去除0 表示没交点  不考虑瓦块空洞   深度检测开启
  viewer.scene.globe.depthTestAgainstTerrain = true

  var tilesetModel = new Cesium.Cesium3DTileset({
    url: "http://172.41.10.201/3DTiles/dalian_3dtiles/tileset.json"
  });
  viewer.scene.primitives.add(tilesetModel);
  // tilesetModel.show = false

  $('testFunc').onclick =async () => {
    console.log('onclick_testFunc1')
    let deepFull = deepClone(cartesians)
    // const promise = viewer.scene.clampToHeightMostDetailed([deepFull[0],deepFull[1],deepFull[2],deepFull[3],deepFull[4],deepFull[5]]);
    // promise.then(function (updatedCartesians) {
    //   debugger
    //   let a = updatedCartesians
    //   console.log('原始', features)
    //   console.log('原始cartesians', deepClone(cartesians))
    //   console.log('结果cartesians', updatedCartesians)
    //   let wgs84 = []

    //   for (let index = 0; index < updatedCartesians.length; index++) {
    //     debugger
    //     const element = updatedCartesians[index];
    //     if (!element) continue
    //     let resultposition = CartesiansToDegrees(element)
    //     // if(Math.abs(resultposition[2])>0.5)
    //     wgs84.push(resultposition)


    //   }
    //   console.log('结果', wgs84)
    // })
    let result = await getDeep([deepFull[0],deepFull[1],deepFull[2],deepFull[3],deepFull[4],deepFull[5]], 0, [])
    console.log('result',result)
    // let result = await getDeep(deepFull, 0, [])
  }

  async function getDeep(cartesians, index, resultArray) {
    const promise = viewer.scene.clampToHeightMostDetailed([cartesians[index]]);
    promise.then(function (updatedCartesians) {
      resultArray.push(updatedCartesians[0])
      index++
      if (index % 100 == 1) console.log(index)
      if (index < cartesians.length) {
        getDeep(cartesians, index, resultArray)
      } else {
        console.log('结束resultArray', index, resultArray)
        let wgs84 = []
        for (let index = 0; index < resultArray.length; index++) {
          debugger
          const element = resultArray[index];
          if (!element) continue
          let resultposition = CartesiansToDegrees(element)
          // if(Math.abs(resultposition[2])>0.5)
          wgs84.push(resultposition)
        }

        console.log('结束Degrees', index, wgs84)
        return wgs84
      }
    })
  }


}
// 获取数组 步长分割  extend array  .next ？？？

initCesium()
debugger
console.log('test1')



function deepClone(target) {
  let result
  if (typeof target === 'object') { // 如果当前需要深拷贝的是一个对象
    if (Array.isArray(target)) { // 如果是一个数组
      result = [] // 将result赋值为一个数组，并且执行遍历
      for (let i in target) {
        result.push(deepClone(target[i])) // 递归克隆数组中的每一项
      }
    } else if (target === null) {
      result = null // 判断如果当前的值是null，直接赋值为null
    } else if (target.constructor === RegExp) {
      result = target // 判断如果当前的值是一个RegExp对象，直接赋值
    } else {
      result = {} // 否则是普通对象，直接for in循环，递归赋值对象的所有值
      for (let i in target) {
        result[i] = deepClone(target[i])
      }
    }
  } else {
    result = target // 如果不是对象，就是基本数据类型，直接赋值
  }
  return result // 返回最终结果
}



function CartesiansToDegrees(coor)
{
  let cartographic = Cesium.Cartographic.fromCartesian(coor);
  let lon = Cesium.Math.toDegrees(cartographic.longitude);
  let lat = Cesium.Math.toDegrees(cartographic.latitude);
  return [lon, lat, cartographic.height];
}


let hashPoint = {
  "DL_10_Block_9": "/2016-2019/DL_10/DL_10_B_1",
  // "DL_11_Block_1": "",
  // "DL_11_Block_1_bu": "",
  "DL_11_Block_2": "/2016-2019/DL_11/DL_11_B_2",
  // "DL_11_Block_2_bu_1": "",
  // "DL_11_Block_2_bu_2": "",
  // "DL_11_Block_3": "",
  // "DL_12_Block_1": "",
  // "DL_12_Block_2": "",
  // "DL_12_Block_3": "",
  // "DL_12_Block_4": "",
  // "DL_13_Block_1_1": "",
  // "DL_13_Block_1_1_bu": "",
  // "DL_13_Block_1_2": "",
  // "DL_13_Block_2_2": "",
  // "DL_13_Block_2_200m": "",
  // "DL_13_Block_2_400m": "",
  // "DL_13_Block_3": "",
  // "DL_13_Block_4": "",
  // "DL_13_Block_5": "",
  // "DL_13_Block_6": "",
  // "DL_13_Block_7": "",
  // "DL_13_Block_8": "",
  // "DL_7_Block_1": "",
  // "DL_7_Block_2": "",
  // "DL_7_Block_3": "",
  // "DL_7_Block_4": "",
  // "DL_7_Block_5": "",
  // "DL_9_Block_1": "",
  // "DL_9_Block_2": "",
  // "DL_9_Block_4": "",
  // "DL_9_Block_4_bu_you": "",
  // "DL_9_Block_4_bu_zuo": "",
}

{}