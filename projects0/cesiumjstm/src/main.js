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
let control_point_json
let features
let hashPoint

let outName = '未识别名字'
$('showPoint').addEventListener('change', showPoint)
$('showPath').addEventListener('change', showPath)
function showPoint(e){
  let files = e.target.files;
  let reader = new FileReader();
  reader.readAsText(files[0]);
  reader.onload = function () {
    if (reader.result) {
      //显示文件内容
      console.log('点击')
      console.log(reader.result)
      
      control_point_json = JSON.parse(reader.result)
      console.log(control_point_json)
      features = control_point_json.features


      outName = files[0].name
    }
  };
}
function showPath(e){
  let files = e.target.files;
  let reader = new FileReader();
  reader.readAsText(files[0]);
  reader.onload = function () {
    if (reader.result) {
      //显示文件内容
      console.log('点击')
      console.log(reader.result)


      hashPoint = JSON.parse(reader.result)
      console.log(hashPoint)
    }
  };
}


async function initCesium() {
  // 1.初始化场景
  let intViewer = new InitViewer()
  const viewer = intViewer.addViewer('cesiumContainer')
  const LNG = 121.52,
    LAT = 38.875;

  // 视角固定
  // viewer.camera.flyTo({
  viewer.camera.setView({
    destination: Cesium.Cartesian3.fromDegrees(LNG, LAT, 10),
    orientation: {
      heading: Cesium.Math.toRadians(0.0),
      pitch: Cesium.Math.toRadians(-90.0),
    }
  });


  //!!!!!!!!!!!!!!!!!!!!!!!!!!!!内网使用暂不使用地图
  // // 天地图底图加载
  // let tdtCva = new Cesium.WebMapTileServiceImageryProvider({
  //   url: "http://{s}.tianditu.gov.cn/img_c/wmts?service=wmts&request=GetTile&version=1.0.0" +
  //     "&LAYER=img&tileMatrixSet=c&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}" +
  //     "&style=default&format=tiles&tk=8a7a551905711535885142a660a10111",
  //   layer: "tdtCva",
  //   style: "default",
  //   format: "tiles",
  //   tileMatrixSetID: "c",
  //   subdomains: ["t0", "t1", "t2", "t3", "t4", "t5", "t6", "t7"],
  //   tilingScheme: new Cesium.GeographicTilingScheme(),
  //   tileMatrixLabels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18"],
  //   maximumLevel: 18,
  //   show: false
  // });
  // let layers = viewer.imageryLayers;
  // // layers.addImageryProvider(tdtCva);

  $('testFunc').onclick = async () => {
    console.log('onclick_testFunc1')

    // 添加3dtiles
    for (const key in hashPoint.hash) {
      debugger
      const url3Dtile = hashPoint.hash[key];
      let tilesetModel = new Cesium.Cesium3DTileset({
        url: hashPoint.url + url3Dtile + "/tileset.json"
      });
      viewer.scene.primitives.add(tilesetModel);
      let toDelFeatures = deepClone(features)
      for (let index = 0; index < toDelFeatures.length; index++) {
        const feature = toDelFeatures[index];
        // const promise =  viewer.scene.clampToHeightMostDetailed(Cesium.Cartesian3.fromDegrees(feature.geometry.coordinates[0], feature.geometry.coordinates[1], 500))
        // promise.then(function (updatedCartesians) {
        //   console.log('aaa'+index,CartesiansToDegrees(updatedCartesians))
        // })
        // 500确保沿大地表面法线将给定的笛卡尔位置固定到场景几何体时为太空到地心方向
        let updatedCartesians = feature.geometry &&
          await getDeep(Cesium.Cartesian3.fromDegrees(feature.geometry.coordinates[0], feature.geometry.coordinates[1], 500))
        // console.log('updatedCartesians', updatedCartesians[0])
          
        // 对应区块高程赋值
        if(updatedCartesians&&updatedCartesians[0]){
          features[index].properties[key] = CartesiansToDegrees(updatedCartesians[0])[2]
          // console.log(index,CartesiansToDegrees(updatedCartesians[0]))
        }else{
          features[index].properties[key] = null
        }

        index%100==1&&console.log(index,control_point_json)
        $('dataListDomId').innerHTML = key+'区块  :  '+((index+1)/toDelFeatures.length*100).toFixed(2)+'%'
     
      }


      viewer.scene.primitives.remove(tilesetModel);
    }

    // 输出成果数据  名字以文件名输入名为准
    let data = JSON.stringify(control_point_json)
    exportRaw(data, outName)

  function exportRaw(data, name) {
    let urlObject = window.URL || window.webkitURL || window
    let export_blob = new Blob([data])
    let save_link = document.createElement('a')
    save_link.href = urlObject.createObjectURL(export_blob)
    save_link.setAttribute('download', name)
    // save_link.download = name
    save_link.click()
  }




  }

  // 获取点位深度  async包裹方便await
  async function getDeep(cartesian) {
    return viewer.scene.clampToHeightMostDetailed([cartesian]);//promise
  }

}

// 获取数组 步长分割  extend array  .next ？？？
initCesium()



/**
 * 慢速递归深拷贝  todo 广度优先遍历
 * @param {Object} target 
 * @returns 
 */
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

/**
 * 笛卡尔{x:,y:,z:}转经纬度高程数组 [x,y,h]
 * @param {*} coor 
 * @returns 
 */
function CartesiansToDegrees(coor)
{
  let cartographic = Cesium.Cartographic.fromCartesian(coor);
  let lon = Cesium.Math.toDegrees(cartographic.longitude);
  let lat = Cesium.Math.toDegrees(cartographic.latitude);
  return [lon, lat, cartographic.height];
}