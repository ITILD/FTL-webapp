(() => {
  // const $ = document.getElementById
  const $ = id => document.getElementById(id)
  const $$ = className => document.querySelector(className)
  $('testFunc').onclick = () => {
    console.log('onclick_testFunc')
  }
  console.log('template')
})()