/*
 * @Description: 脚手架(vue cli)配置入口
 * @Author: 毛瑞
 * @Date: 2019-06-18 16:18:18
 * @LastEditors: 毛瑞
 * @LastEditTime: 2019-07-15 13:35:54
 */
// TODO: 环境变量/入口文件 改变热更新
const path = require('path')

const environment = process.env // 环境变量
const isProd = environment.NODE_ENV === 'production' // 是否生产环境

const pages = require('./getPages')(isProd) // 自动检测并返回页面入口设置
const chainWebpack = require(isProd
  ? './production.config' // 生产环境配置
  : './development.config') // 开发环境配置

const updateJSON = require('./updateJSON')

// 命名缩写记录
let DIC
// 字符串缩写函数
const short = require('./shortString')(
  {
    // 指定chunk名缩写 eg: index: 'i'
  },
  (name, n) => {
    if (!DIC) {
      DIC = {}
      setTimeout(() => updateJSON('fileName.map', 'chunkName', DIC))
    }

    DIC[n] = name
  }
)

const TS_CONFIG_FILE = 'tsconfig.json'
const TS_PATHS_KEY = 'compilerOptions.paths'
const TS_PATHS = {
  // ts 目录别名
  '@/*': ['src/*'],
}
const CURRENT_DIR = path.join(process.cwd(), '/')

/// 【配置项】 ///
// https://cli.vuejs.org/zh/config
module.exports = {
  /// 普通 ///
  publicPath: './', // 发布路径（./: 相对路径）
  lintOnSave: !isProd, // 保存时检查代码
  productionSourceMap: false, // 生产环境不要sourceMap
  transpileDependencies: ['vuex-module-decorators'], // babel转码, 默认不转依赖包

  /// 【配置样式选项】 ///
  css: {
    // https://cli.vuejs.org/zh/config/#css-loaderoptions
    loaderOptions: {
      css: {
        // class名 内容哈希5个字符足够（数字开头的会自动补个下划线）
        // https://github.com/webpack-contrib/css-loader#localidentname
        // https://github.com/webpack/loader-utils#interpolatename
        localIdentName: isProd ? '[hash:5]' : '[folder]-[name]-[local][emoji]',
        camelCase: 'only', // 驼峰化class名，不保留非驼峰class名
      },
      sass: {
        data: '@import "@/scss/var.scss";', // 全局引入
      },
    },
  },

  /// 【配置页面入口】https://cli.vuejs.org/zh/config/#pages ///
  pages,

  /// 【开发服务器配置】 ///
  devServer: {
    // lint
    overlay: { errors: true },
    port: environment.DEV_SERVER_PORT,
    host: environment.DEV_SERVER_HOST,
    proxy: (() => {
      const REG_PROXY = /^BASE_URL(\d*)$/
      const TARGET = 'PROXY_TARGET'

      let proxyList = {}

      let tmp
      for (let key in environment) {
        tmp = REG_PROXY.exec(key)
        if (tmp) {
          key = environment[key]
          proxyList[key] = {
            target: environment[TARGET + tmp[1]],
            changeOrigin: true,
            pathRewrite: url => url.replace(new RegExp(`^/${key}/`), '/'),
          }
        }
      }

      return proxyList
    })(),
  },

  /// 【webpack配置】 ///
  // https://github.com/neutrinojs/webpack-chain#getting-started
  chainWebpack(config) {
    /// 【设置目录别名 已有: @ => src 】 ///
    let alias = '@com'
    let folderName = path.resolve('src/components')

    const SUFFIX = '/*'
    const REG_BACKSLASH = /\\/g
    const setAlias = () => {
      config.resolve.alias.set(alias, folderName)

      TS_PATHS[alias + SUFFIX] = [
        folderName.replace(CURRENT_DIR, '').replace(REG_BACKSLASH, '/') +
          SUFFIX,
      ]
    }
    setAlias()

    let tmp
    for (let entryName in pages) {
      tmp = pages[entryName]
      if (tmp.alias) {
        alias = '@' + entryName
        folderName = tmp.alias
        setAlias()

        alias = '@' + entryName + 'Com'
        folderName = path.join(tmp.alias, 'components')
        setAlias()
      }
    }
    updateJSON(TS_CONFIG_FILE, TS_PATHS_KEY, TS_PATHS)

    /// 【优化(optimization)】 ///
    // https://webpack.docschina.org/configuration/optimization 使用默认就好
    // config.optimization.mangleWasmImports(true) // WebAssembly短名【暂不支持短方法】
    // config.optimization.runtimeChunk('single') // 所有chunk共享一个运行时文件

    /// 【代码分割(optimization.splitChunks 不能config.merge({}))】 ///
    // https://webpack.docschina.org/plugins/split-chunks-plugin
    config.optimization.splitChunks({
      chunks: 'all', // 包含所有类型包（同步&异步 用insert-preload补齐依赖）

      // 分割优先级: maxInitialRequest/maxAsyncRequests < maxSize < minSize
      // 最小分包大小 122k, 183k(122*1.5)
      minSize: 124928,
      // webpack 5
      // minSize: {
      //   javascript: 124928,
      //   style: 187392,
      // },
      // 最大分包大小 244k, 366k(244*1.5) （超过后尝试分出大于minSize的包）
      maxSize: 249856,
      // maxSize: {
      //   javascript: 249856,
      //   style: 374784,
      // },
      // 超过maxSize分割命名 true:hash(长度8，不造哪儿改)[默认] false:路径
      // hidePathInfo: true, // 也没个文件名配置啊...
      minChunks: 3, // 某个chunk被超过该数量的chunk依赖时才拆分出来
      maxAsyncRequests: 6, // 最大异步代码请求数【http <= 1.1 浏览器同域名并发请求上限: 6】
      maxInitialRequests: 3, // 最大初始化时异步代码请求数

      automaticNameDelimiter: '.', // 超过大小, 分包时文件名分隔符
      // automaticNameMaxLength: 15, // 分包文件名自动命名最大长度【文档有写，但是报错unknown】
      name:
        isProd &&
        // 生产环境缩写 vendors.main.other.user.d0ae3f07.77d.js => v.wzS.d0ae3f07.77d.js
        (module => {
          let name = 'v.' // 前缀
          for (let chunk of module.chunksIterable) {
            name += short(chunk.name)
          }

          // 又过时
          // module.forEachChunk(chunk => (name += short(chunk.name)))
          // 过时
          // for (let item of module.chunks) {
          //   name += short(chunk.name)
          // }

          return name
        }),
      cacheGroups: {
        /// 【 js 】 ///
        // 所有其他依赖的模块
        dll: {
          name: 'dll',
          chunks: 'initial',
          reuseExistingChunk: true,
          test: /[\\/]node_modules[\\/]/,
        },
        // polyfills
        plf: {
          name: 'plf',
          chunks: 'initial',
          priority: 6,
          reuseExistingChunk: true,
          test: /[\\/]node_modules[\\/]core-js(?:-pure)?[\\/]/,
        },
        // configs
        conf: {
          name: 'conf',
          chunks: 'all',
          enforce: true, // 确保会创建这个chunk (否则可能会根据splitChunks选项被合并/拆分)
          priority: 666,
          test: /[\\/]config[\\/]/,
        },
        // json文件 (-> json.*.*.js)
        // json: {
        //   name: 'json',
        //   chunks: 'all',
        //   enforce: true,
        //   priority: 668,
        //   test: /[\\/]?.+\.json(?:[^\w].*)?$/,
        // },
        // elementUI (建议按需引入)
        eui: {
          name: 'eui',
          chunks: 'all',
          priority: 66,
          reuseExistingChunk: true,
          test: /[\\/]node_modules[\\/]element-ui[\\/]/,
        },
        // d3.js
        d3: {
          name: 'd3',
          chunks: 'all',
          priority: 66,
          reuseExistingChunk: true,
          test: /[\\/]node_modules[\\/]d3[\\/]/,
        },
        // zrender (二维绘图引擎)
        zrd: {
          name: 'zrd',
          chunks: 'all',
          priority: 66,
          reuseExistingChunk: true,
          test: /[\\/]node_modules[\\/]zrender[\\/]/,
        },
        // echarts (依赖 zrender)
        ect: {
          name: 'ect',
          chunks: 'all',
          priority: 66,
          reuseExistingChunk: true,
          test: /[\\/]node_modules[\\/]echarts[\\/]/,
        },

        /// 【 css 】(多数情况下不需要，webpack 5可以去掉) ///
        // 提取各入口的 css 到单独文件(还抽了一个空数组的 [entryName].*.*.js 出来???)
        // ...(() => {
        //   /** 获取模块是否是指定入口的
        //    * @param {Object} module webpack module 对象
        //    * @param {String} name 入口名
        //    *
        //    * @returns {Boolean}
        //    */
        //   const isBelong = (module, name) =>
        //     module.name === name ||
        //     (!!module.issuer && isBelong(module.issuer, name))

        //   const TYPE = 'css/mini-extract'

        //   let css = {}
        //   let chunkName
        //   for (let entryName in pages) {
        //     chunkName = entryName + '_' // 多页时与入口名重了要报错

        //     css[chunkName] = {
        //       name: chunkName,
        //       // 异步chunk的css合并可能存在因加载顺序改变导致的样式优先级问题，
        //       // 但这绝大多数都是异步chunk里存在覆盖全局的样式的全局样式
        //       // 减少使用全局样式，用好CSSModule可以避免
        //       chunks: 'async', // 'initial'、'all'
        //       enforce: true,
        //       priority: 66,
        //       // https://github.com/webpack-contrib/mini-css-extract-plugin
        //       // test: module =>
        //       //   module.constructor.name === 'CssModule' &&
        //       //   isBelong(module, entryName),
        //       test: module =>
        //         module.type === TYPE && isBelong(module, entryName),
        //     }
        //   }

        //   return css
        // })(),
      },
    })

    /// 插件 ///
    /// 【全局scss】【弃】 ///
    // https://www.npmjs.com/package/sass-resources-loader
    // config.module.rule('scss').oneOfs.store.forEach(item =>
    //   item
    //     .use('sass-resources-loader')
    //     .loader('sass-resources-loader')
    //     .options({
    //       resources: 'src/scss/var.scss', // 字符串或字符串数组
    //     })
    //     .end()
    // )
    // 补全html插入资源
    config.plugin('insert-preload').use(path.resolve('insertPreload.js'))

    /// 【不同环境配置】 ///
    chainWebpack(config)

    /// 【不处理的依赖库】 ///
    // 一般情况不建议使用，在html模板引入了会创建全局变量的js后可以设置以在src中使用这个全局变量
    // config.externals({
    //   global: 'global',
    // })

    /// 【增加一个入口】 ///
    // config
    //   .entry('polyfill')
    //   .add(path.resolve('src/libs/polyfill'))
    //   .end()

    // config.output.hashDigest('base64')
    // config.output.hashFunction('md5')
    // config.output.hashFunction(require('metrohash').MetroHash64)
    // config.output.hashDigestLength(5) // 全局hash长度
  },
}
