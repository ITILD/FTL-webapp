
document.querySelector('#dealData').onclick = splitGeojson

function splitGeojson(params) {
  console.log('分割geojson')
  var zip = new JSZip()

  let nodes =[]
  let filedata

  let list = []
  window.geojson.features.forEach(feature => {
    list.push({
      id:feature.properties.id,
      pid:feature.properties.parent_id,
      full_path:feature.properties.full_path,
      text:feature.properties.name
    })
  })

  
  // 用for循环的方法
  for (var i = 0; i < list.length; i++) {
    for (var j = 0; j < list.length; j++) {
      // 如果有父节点
      if (list[i].pid === list[j].id) {
        // 放进它父节点的children数组中；如果children不存在，初始化为空数组
        list[j].nodes = list[j].nodes || []
        list[j].nodes.push(list[i])
        // 因为每个节点至多有一个父节点，所以这里可以退出本次循环，避免无z意义的运算
        break
      }
    }
    // 如果j的值等于list的长度，说明在内层循环中没有触发break，也就是说这个节点是根节点
    if (j === list.length) nodes.push(list[i])
  }




  filedata = JSON.stringify(nodes)
  zip.file("list.geojson", filedata);


// //分割
  // var geojsonPackage = zip.folder("list");
  // if (window.geojson) {
  //   let fileName, filedata
  //   window.geojson.features.forEach(feature => {
  //     debugger
  //     fileName = feature.properties.full_path + ".json"
  //     filedata = JSON.stringify(feature)
  //     geojsonPackage.file(fileName, filedata);
  //   });  
  // }






  // const buffer = new ArrayBuffer(21) //21bytes  8*21bit
  // const view1 = new DataView(buffer)
  // view1.setUint8(0, 1,true) //1字节无符号整数  默认使用大端法，true设置为小端法
  // view1.setUint32(1, 1,true) // 4字节无符号整数
  // view1.setFloat64(5, 1.123456789,true) //8字节双精度数
  // view1.setFloat64(13, 1.123456789,true)
  // img.file("buffer.txt", buffer);

  zip.generateAsync({ type: "blob" })
    .then(function (content) {
      // see FileSaver.js
      saveAs(content, "example.zip");
    });
}


// nodes: [
//   {
//     text: "大连",
//     tags: ["4"],
//     nodes: [
//       {
//         text: "中山区",
//         tags: ["0"],
//         nodes: [
//           {
//             text: "街道1",
//           },
//         ],
//       },
//       {
//         text: "西岗区",
//         tags: ["1"],
//         nodes: [
//           {
//             text: "街道1",
//           },
//         ],
//       },
//       {
//         text: "沙河口区",
//         tags: ["2"],
//         nodes: [
//           {
//             text: "街道1",
//           },
//         ],
//       },
//       {
//         text: "甘井子区",
//         tags: ["3"],
//         nodes: [
//           {
//             text: "街道1",
//           },
//         ],
//       },
//       {
//         text: "高新园区",
//         tags: ["4"],
//         nodes: [
//           {
//             text: "街道1",
//           },
//         ],
//       },
//     ],
//   },
// ],