
import { BigString } from "./BigString.js";
import { parseXml } from "./parseXml.js";
const $ = id => document.getElementById(id)
const $file = $('file')
const $content = $('content')
const $readBtn = $('readFile')
const $infos = $('infos')
const $logs = $('logs')
const $progress = $('progress')
const $progressText = $('progressText')

const fileReader = new FileReader()

// 分片步进
const STEP = 1024//b
* 1024//kb
* 10//mb

// 保存当前文件域引用
let currentFile = null
// 用来标注是否已停止读取
let isStopRead = true
// 当前索引
let startIndex = 0
// 当前分片
let currentSeg = 1
// 文件总大小
let totalSize = 0
// 文件总片段数
let totalSegs = 0
// 已读字节数
let loadedSize = 0

window.thisvalue = [0,'']//
function readFile() {
  let bigString = new BigString()

  fileReader.onloadend = function(evt) {
    const content = evt.target.result
    // 为了防止内存溢出，这里仅显示当前读取的内容，可在实际测试中改为内容拼接的形式
    // $content.value += content
    // $content.value = content
    // $content.focus()
    // let reg = new RegExp('\\r');
    // let a = content.replace(/[\r\n\t]/g, "");
    // debugger
    // window.thisvalue += content
    // window.thisvalue += a
    bigString.push(content.replace(/[\r\n\t]/g, ""))
    // 递归继续读取
    if (startIndex < totalSize) {
      if (!isStopRead) {
        currentSeg++
        readFile()
      }
    } else {
      $readBtn.textContent = '读取完毕'
      $readBtn.setAttribute('disabled', 'disabled')
      let test = bigString.substringByStr('<ControlPoints>','</ControlPoints>')+'</ControlPoints>'
      // console.log(test)
      parseXml(test)
      // console.log(bigString)
    }
  }

  // 读取进度
  fileReader.onprogress = function(evt) {
    if (evt.lengthComputable) {
      // 当前片段的读取进度，在片段很小的时候基本看不到效果
      const segProgress = evt.loaded / evt.total
      loadedSize += evt.loaded
      // 在startIndex字节的基础上加上当前片段的读取加载字节就可以算出总文件的读取进度
      // 使用loadedSize / totalSize 包含单分片超出索引过大问题
      const totalProgress = Math.min(1, currentSeg / totalSegs)
      $progress.value = totalProgress
      $progressText.textContent = Math.round(totalProgress * 100) + '%'
    }
  }

  const readFile = () => {
    const end = Math.min(startIndex + STEP, totalSize)
    const blob = currentFile.slice(startIndex, end)
    startIndex = end
    fileReader.readAsText(blob, 'utf-8')
    updatelogs()
  }

  readFile()
}

function updatelogs() {
  $logs.innerHTML = `
    <li>已读取：${loadedSize}/${totalSize} Bytes</li>
    <li>正在读取: ${currentSeg}/${totalSegs} 分片</li>
  `
}

// 重新初始化全局变量
function init() {
  $readBtn.removeAttribute('disabled')
  $readBtn.textContent = '开始'
  isStopRead = true
  currentSeg = 1
  startIndex = 0
  loadedSize = 0
  totalSize = currentFile.size
  totalSegs = Math.ceil(totalSize / STEP)
  $logs.innerHTML = ''
  $progress.value = 0
  $progressText.textContent = ''
  $content.value = ''
}

// 文件域改变时触发
$file.onchange = evt => {
  const file = evt.target.files[0]
  if (file.size < STEP) {
    alert(`请上传至少${STEP}字节的文件`)
    return
  }
  currentFile = file
  $infos.innerHTML = `
  <li>文件名称：${file.name}</li>
  <li>文件大小：${file.size} Bytes</li>
  `


  window.nowFileName=file.name
  evt.value = null
  init()
}

// 开始暂停的切换
$readBtn.addEventListener('click', () => {
  if (loadedSize >= totalSize) {
    alert('文件已读取完毕，请重新选择文件')
    return
  }
  if (isStopRead) {
    isStopRead = false
    $readBtn.textContent = '暂停'
    readFile()
  } else {
    isStopRead = true
    $readBtn.textContent = '开始'
  }
})