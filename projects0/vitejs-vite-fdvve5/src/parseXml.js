
document.querySelector('#dealData').onclick = splitGeojson

function splitGeojson(params) {
  // store a reference to our file handle
let fileHandle;
getFile()
async function getFile() {
  // open file picker
  [fileHandle] = await window.showOpenFilePicker();

  if (fileHandle.kind === 'file') {
    // run file code
  } else if (fileHandle.kind === 'directory') {
    // run directory code
  }

  
    // 如果没有选择文件，就不需要继续执行了
    if (!fileHandle) {
      return;
    }

    // 这里的 options 用来声明对文件的权限，能否写入
    const options = {
      writable: true,
      mode: "readwrite"
    };
    // 然后向用户要求权限
    if (
      (await fileHandle.queryPermission(options)) !== "granted" &&
      (await fileHandle.requestPermission(options)) !== "granted"
    ) {
      alert("Please grant permissions to read & write this file.");
      return;
    }

    // 前面获取的是 FileHandle，需要转换 File 才能用
    const file = await fileHandle.getFile();
    // 接下来，`file` 就是普通 File 实例，你想怎么处理都可以，比如，获取文本内容
    const code = await file.text();
    

    debugger
     console.log('处理xml')
  // const xmlDataStr = `<root a="nice" checked><a>wow</a></root>`;
  // const xmlDataStr =window.geojson
  const parser = new XMLParser( {
      ignoreAttributes: false,
      attributeNamePrefix : "@_"
  });
  debugger
  const output = parser.parse(code);
  debugger
  window.output = output
}

}
  // console.log('处理xml')
  // // const xmlDataStr = `<root a="nice" checked><a>wow</a></root>`;
  // const xmlDataStr =window.geojson
  // const options = {
  //     ignoreAttributes: false,
  //     attributeNamePrefix : "@_"
  // };
  // const parser = new XMLParser(options);
  // const output = parser.parse(xmlDataStr);
  // window.output = output
