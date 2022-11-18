import fs from "fs";
import esbuild from "esbuild";
/**
 * ESBuild 打包设置
 * 等价于package添加CLI
 * "build_esm_sourcemap": "esbuild index.js --bundle --format=esm --minify --sourcemap --outfile=out4.js",
 * https://esbuild.github.io/api/#log-level
 * 
 */
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'))
let out = esbuild.buildSync({
  entryPoints: [packageJson.main], //entryPoints: ['index.js'] 
  outfile: 'dist/' + packageJson.name + '.js', //outfile: 'out.js',
  sourcemap: true, //调试关联
  bundle: true, //单一文件
  minify: true, //压缩
  format: 'esm',
  logLevel: 'info', //控制台信息
  tsconfig: 'tsconfig.json', //指定tsconfig.json
})