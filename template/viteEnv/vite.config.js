import { defineConfig } from 'vite';
import { Envtools } from "./tools/Envtools.js";//环境变量工具


export default ({ mode }) => {
  Envtools.getNodeEnv([".env." + mode])
  console.log('vite_mode 环境变量：',mode);
  console.log('node_env  环境变量：', process.env.NODE_ENV);

  return defineConfig({
    // plugins: [cesium()],
  })
}