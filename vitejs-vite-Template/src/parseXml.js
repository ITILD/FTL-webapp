import { DateFormat, exportRaw } from "./help.js";

function parseXml(code) {
  console.log('处理xml')
  window.nowFileName = window.nowFileName.replace('.xml','')
  // const xmlDataStr = `<root a="nice" checked><a>wow</a></root>`;
  // const xmlDataStr =window.geojson
  const parser = new XMLParser( {
      ignoreAttributes: false,
      attributeNamePrefix : "@_"
  });
  debugger
  const ccControlJsObj = parser.parse(code);
  let resultjson = {
    "type": "FeatureCollection",
    "name": window.nowFileName,
    "crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } },
    "features": [


    ]
  }
  let features = resultjson.features



  let controlPointsArray = ccControlJsObj.ControlPoints.ControlPoint

  for (let index = 0; index < controlPointsArray.length; index++) {
    const controlPoint = controlPointsArray[index];

    let featurePoint = {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [controlPoint.Position.x, controlPoint.Position.y,controlPoint.Position.z]
      },
      "properties": {
        "Name": controlPoint.Name,
        "HorizontalAccuracy": controlPoint.HorizontalAccuracy,
        "VerticalAccuracy": controlPoint.VerticalAccuracy,
        "HorizontalAccuracy": controlPoint.HorizontalAccuracy,
        'DataPosition':window.nowFileName,
        'x':controlPoint.Position.x,
        'y':controlPoint.Position.y,
        'z':controlPoint.Position.z,
      }
    }
    if(controlPoint.Measurement&&controlPoint.Measurement.length>0){
      // featurePoint.properties.Measurement= controlPoint.Measurement
      featurePoint.properties.use = true
    }else{
      featurePoint.properties.use = false
    }
    
    features.push(featurePoint)
    
  }
  
  let data = JSON.stringify(resultjson)
  let time = new Date()
  // time = DateFormat(time,'hh时mm分ss秒')
  let name = window.nowFileName + '.json'
  exportRaw(data, name)
}



export{parseXml}