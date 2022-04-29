/**
 * @description 日期格式化(插件)
 * new Date().Format('yyyy-MM-dd')
 * new Date().Format('hh时mm分ss秒')
 * @param {String} fmt 
 * @returns 
 */
let DateFormat = (date, fmt) => { //author: meizz 
  var o = {
    "M+": date.getMonth() + 1, //月份 
    "d+": date.getDate(), //日 
    "h+": date.getHours(), //小时 
    "m+": date.getMinutes(), //分 
    "s+": date.getSeconds(), //秒 
    "q+": Math.floor((date.getMonth() + 3) / 3), //季度 
    "S": date.getMilliseconds() //毫秒 
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}


/**
 * @description 导出文件
 * let jsonStr = {name: '000',url: '111',}
 * let time= new Date().Format('hh时mm分ss秒')
 * let name = 'mockdata'+time+'.json'
 * @param {String} data 
 * @param {String} name 
 */
let exportRaw = (data, name) => {
  let urlObject = window.URL || window.webkitURL || window
  let export_blob = new Blob([data])
  let save_link = document.createElement('a')
  save_link.href = urlObject.createObjectURL(export_blob)
  debugger
  save_link.setAttribute('download', name) // save_link.download = name
  save_link.click()
}

export { DateFormat, exportRaw }