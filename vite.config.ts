const path = require('path')
import { fileURLToPath } from 'node:url'
const { defineConfig } = require('vite')
const fs = require('fs')
import dts from 'vite-plugin-dts'
import cmj from 'rollup-plugin-commonjs'
import resolveNode from 'rollup-plugin-node-resolve'
import { visualizer } from 'rollup-plugin-visualizer'

const MODULE_SPLIT_FLAG = '_'

const getEntryMap = () => {
  const modulesMap: any = {}
  const group = ['modules'];
  // const group = ['modules', 'plugins'];

  group.map((item) => {

    const moduleDir = `src/${item}`;
    const moduleDirs = fs.readdirSync(path.resolve(moduleDir))
    moduleDirs.forEach((dir) => {
      modulesMap[`${item}${MODULE_SPLIT_FLAG}${dir}`] = path.resolve(__dirname, `${moduleDir}/${dir}/index.ts`)
    })
  })

  return modulesMap;
}

const modulesMap = getEntryMap();

module.exports = defineConfig({
  build: {
    minify: "terser", 
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      }
    },
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'front-end-functions',
      formats: ['es'],
      fileName: (format) => `front-end-functions.${format}.js`,
    },
    plugins: [dts(), resolveNode(), cmj(),
      visualizer({
        open: true, // 注意这个需打开true，否则无效
        gzipSize: true
      })
    ],
    rollupOptions: {
      // 确保外部化处理那些你不想打包进库的依赖
      external: ['vue'],
      input: {
        index: 'src/index.ts',
        ...modulesMap,
      },
      output: {
        entryFileNames: (dir) => {
          if (dir.name.includes(MODULE_SPLIT_FLAG)) {
            const [dirName, fileName] = dir.name.split(MODULE_SPLIT_FLAG);
            return  `${dirName}/${fileName}/index.js`;
          } 
          return '[name].js';
        }, // 输出文件名
        exports: 'named',
        // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
        globals: {
          vue: 'Vue',
        },
        manualChunks: {
          // react: ['react', 'react-router-dom'],
          // echarts: ['echarts'],
          lodash: ['lodash-es'],
          // antd: ['antd'],
          // moment: ['moment'],
          // ahooks: ['ahooks'],
          // reactJss: ['react-jss'],
          // exceljs: ['exceljs'],
          // html2canvas: ['html2canvas']
      }
      },
    }
  },
})
