## QA

1. ts问题

最开始的写法是：

```ts
interface MeasuredData {
  measuredDataMap: {
    LastMeasuredItemIndex: string;
  };
  LastMeasuredItemIndex: number;
}

const measuredData: MeasuredData = {
  measuredDataMap: {
    LastMeasuredItemIndex: '',
  },
  LastMeasuredItemIndex: -1,
};

使用的时候会有如下报错：
const lastMeasuredItem = measuredDataMap[LastMeasuredItemIndex]
// 元素隐式具有 "any" 类型，因为类型为 "number" 的表达式不能用于索引类型 "{ LastMeasuredItemIndex: string; }"。在类型 "{ LastMeasuredItemIndex: string; }" 上找不到具有类型为 "number" 的参数的索引签名。

// 这个错误是因为你正在尝试使用一个类型为number的表达式来索引一个类型为{ LastMeasuredItemIndex: string; }的对象。在 TypeScript 中，当你使用一个不是字符串的值作为对象的索引时，TypeScript 会给出这个错误。

// 修正如下
interface MeasuredData {
  measuredDataMap: {
    [key: string]: string;
  };
  LastMeasuredItemIndex: number;
}
```

2. 其他问题：更多的属于是没有进行判空而导致的报错。

```ts
const getCurrentChildren = () => {
  // 可视区起始索引
  const startIndex = Math.floor(scrollOffset / itemSize);
  // 上缓冲区起始索引
  const finialStartIndex = Math.max(0, startIndex - 2);
  // 可视区能展示的元素的最大个数
  const numVisible = Math.ceil(height / itemSize);
  // 下缓冲区结束索引
  const endIndex = Math.min(itemCount, startIndex + numVisible + 2);
  const items = [];
  // 根据上面计算的索引值，不断添加元素给container
  for (let i = finialStartIndex; i < endIndex; i++) {
    const itemStyle = {
      position: 'absolute',
      height: itemSize,
      width: '100%',
      // 计算每个元素在container中的top值
      top: itemSize * i,
    };

    if (Child) {
      // 需要判空的例子
      items.push(<Child key={i} index={i} style={itemStyle} />);
    }
  }
  return items;
};
```

```
const shouldRecalculate = recalculate ?? false; // 默认值移到函数内部

这行代码使用了 TypeScript 中的空值合并操作符 (??)。空值合并操作符用于判断其左侧的值是否为 null 或 undefined，如果是，则返回右侧的值，否则返回左侧的值。在这里，它的作用是判断 recalculate 是否为 null 或 undefined，如果是，则将 shouldRecalculate 设置为 false，否则将 shouldRecalculate 设置为 recalculate 的值。

这行代码的含义可以理解为：

如果 recalculate 不是 null 或 undefined，则将 shouldRecalculate 设置为 recalculate 的值。
如果 recalculate 是 null 或 undefined，则将 shouldRecalculate 设置为 false。
这样就可以确保即使调用函数时未提供 recalculate 参数，也能在函数内部得到一个默认值 false，从而避免了 TypeScript 中参数不能同时有默认值和可选标记的问题。

```

## wait to fix:

1. 动态高度虚拟列表中，光标和滚动条在动态高度的时候，是脱轨的。
2. 滚动速度过快产生的白屏现象 : 采用类似图片懒加载的方式，滚动期间以骨架屏等方式过度，仅生成较少内容，滚动结束或说用户行为结束后，再进行试图内子项的完整渲染 / 参考别的组件看看如何处理白屏
3. 优化算法
4. setScrollTop 太频繁了，可以改成先把 StartIndex 求出来，如果 startIndex 变化了再触发 react 更新
5. 组件如果大部分的计算逻辑都不相同的时候，分为不同的组件文件进行开发和维护。不需要硬融在一个组件里面处理。
6. add test...

问题：
业务实际当中table往往需要很多复杂表结构，同时也会有大数据渲染卡顿，页面僵死，甚至崩溃的情况

解决方案：
其实问题往往有很多的解决方案，从问题本身上发现问题，你需要做的只是先一步一步地分析各种场景，解剖场景使问题清晰明了，然后思考每一种场景可能出现的问题以及其解决途经。

比如业务显示40条数据的场景下，通常是使用表复杂结构进行各种操作；但导出数据分析场景下，他是不会对表单进行过普通操作，他只会导出数据。
这时，你可以考虑显示40条数据时使用antd.Table组件，在显示1000条以上的数据时，使用ant-virtual-table来解决渲染卡顿问题，这时不支持表单的各种操作。

## Refs:

1. [三种虚拟列表原理与实现](https://juejin.cn/post/7232856799170805820#heading-17)
1. [浅说虚拟列表的实现原理](https://github.com/dwqs/blog/issues/70)
1. [react-virtualized 组件的虚拟列表实现](https://github.com/dwqs/blog/issues/72)

## refs npm/repo

1. https://github.com/bvaughn/react-virtualized
2. https://github.com/dwqs/react-virtual-list/blob/develop/README-CN.md
3. https://github.com/bvaughn/react-window/tree/master
4. https://github.com/ant-design/ant-design/blob/master/components/table/InternalTable.tsx
5. https://www.npmjs.com/package/ant-virtual-table?activeTab=readme

## FOR TEST

1. https://github.com/dwqs/react-virtual-list/blob/develop/tests/index.test.js
2. https://github.com/bvaughn/react-window/blob/master/src/__tests__/FixedSizeList.js
3. https://github.com/ant-design/ant-design/blob/master/components/table/__tests__/Table.virtual.test.tsx

## for build and publish

1. https://betterprogramming.pub/how-to-publish-a-react-component-library-c89a07566770
2. https://hackernoon.com/how-to-publish-a-react-component-as-a-package-to-npm
3. https://levelup.gitconnected.com/publish-react-components-as-an-npm-package-7a671a2fb7f
4. [package json config docs](https://docs.npmjs.com/cli/v10/configuring-npm/package-json/)
5. [webpack official docs](https://webpack.js.org/guides/getting-started/)
6. [webpack crash course](https://www.youtube.com/watch?v=IZGNcSuwBZs)
7. [webpack-starter](https://github.com/bradtraversy/webpack-starter/blob/main/webpack.config.js)
8. [Webpack组件库打包超详细指南](https://juejin.cn/post/7082738107237433375)
9. https://github.com/dwqs/react-virtual-list/blob/develop/webpack.build.config.js

```
const path = require('path')

module.exports = {
  mode: 'production',
  entry: {
    index: path.resolve(__dirname, './src/index')
  },

  output: {
    path: path.join(__dirname, './dist'),
    filename: '[name].js',
    library: 'ReactVirtualList',
    libraryTarget: 'commonjs2'
  },

  module: {
    rules: [{
      test: /\.(js|jsx)$/,
      exclude: /node_modules/,
      loader: 'babel-loader'
    }]
  },

  resolve: {
    extensions: ['.jsx', '.ts', '.js'],
    modules: [path.join(__dirname, './node_modules')]
  },

  optimization: {
    minimize: false
  },

  externals: [{
    'react': {
      root: 'React',
      commonjs2: 'react',
      commonjs: 'react',
      amd: 'react'
    }
  }]
}
```

## How to bundle your React UI Library component with Webpack step-by-step (2024 ver)

此文档的打包流程是建立在项目已经开发完毕，需要进行打包处理的基础上的内容。是我自己打包时所遇到的问题和一些流程上的心得。

这次我打包的是一个ui组件库，是一个mini虚拟列表组件的组件库。所以这篇文章是针对ui组件库的一个打包的操作。如果是网页项目的打包则这篇文章会不符合你的预期。

### 为什么需要打包

前端项目之所以要打包，是为了优化代码、减少资源文件大小、降低网络请求次数、提高网站性能。解决兼容性问题、静态资源处理和优化、代码分割和按需加载、开发环境支持、性能提升、多技术支持、自动化工作流程、第三方库管理和可定制化等方面的需求。有时候也会想要自己编写一些包，提供给别人使用。

### JavaScript模块格式

打包的时候，我们会碰到一些打包模式的选择，就是我们需要把我们的代码打包成什么模式，或是需要打包出所有的模式。不同的模式会对应不同的打包方式。

JavaScript 主要有以下几种模块格式，它们在不同的环境和应用中有不同的用途和特点：

- **ESM(ECMAScript Modules)**：现代 JavaScript 应用和前端开发。**在 Node 及 浏览器中均会支持**。`esm` 为静态导入，正因如此，可在编译期进行 **Tree Shaking**，减少 js 体积。
- **CJS(CommonJS)**：Node.js 应用和服务器端开发。但不能在浏览器中*直接*使用。`cjs` 为动态加载
- **AMD(Asynchronous Module Definition)**：需要异步加载模块的浏览器应用。
- **UMD(Universal Module Definition)**：需要兼容多种环境的库和工具。一种兼容 `cjs` 与 `amd` 的模块，既可以在 node/webpack 环境中被 `require` 引用，也可以在浏览器中直接用 CDN 被 `script.src` 引入。示例: react-table, antd
- **SystemJS**：需要动态加载和支持多种模块格式的应用。

目前，在浏览器与 node.js 中均原生支持 esm。

cjs 模块输出的是一个值的拷贝，esm 输出的是值的引用。
cjs 模块是运行时加载，esm 是编译时加载。

[前端打包时 cjs、es、umd 模块有何不同](https://q.shanyue.tech/fe/engineering/475)

在看一篇文章分析ant-design、arco-design、semi-design三个组件打包出的模块中，会同时打包出 commonjs/esm/umd 三种模块化格式，供不同需求的业务使用。基本上业务都会打包这三种基础的模块格式。由于ESM是JavaScript语言实现的模块规范，建议大家都是用ESM开发新的包。

### 什么是运行时，什么是编译时

编译：在 JavaScript 中，编译通常指的是解析（parsing）和转换（transformation）代码的过程。现代 JavaScript 引擎会先解析代码，将其转换成抽象语法树（AST），然后进行优化和生成可执行的机器代码。
加载：加载是指将代码从文件系统或其他存储介质读取到内存中，以便进一步解析和执行。

- **浏览器中的传统脚本**：加载和编译在 `<script>` 标签被解析到时立即进行，然后执行。
- **浏览器中的 ESM 模块**：加载是递归的，所有模块及其依赖在执行前会被解析和编译，然后按依赖顺序执行。
- **Node.js 中的 CommonJS 模块**：模块在 `require` 时同步加载、编译并立即执行。
- **Node.js 中的 ESM 模块**：模块在 `import` 时异步加载，所有模块及其依赖在执行前会被解析和编译，然后按依赖顺序执行。

#### CommonJS 模块

加载：当 Node.js 遇到 require 语句时，它会同步加载所需的模块文件。
编译：加载的模块文件会立即被解析和编译。
执行：编译完成后，模块代码会立即执行，导出其接口。

`const myModule = require('./myModule.js');`

在这种情况下，myModule.js 文件会被同步加载、编译并执行，然后将导出的接口赋值给 myModule。

#### ESM 模块

Node.js 也支持 ESM 模块，但它的处理方式与浏览器稍有不同：

加载：当 Node.js 遇到 import 语句或加载 ESM 模块时，它会异步加载所需的模块文件。
编译：所有的模块及其依赖模块会在执行前被解析和编译。
执行：编译完成后，代码按照模块的依赖关系顺序执行。

`import { myFunction } from './myModule.mjs';`

在这种情况下，myModule.mjs 文件会被异步加载、编译，然后按照依赖关系执行。

### package.json 打包文件读取入口

[package.json 非官方字段集合](https://segmentfault.com/a/1190000016365409)

[package配置相关](https://qinzhen001.github.io/2020/10/24/package%E9%85%8D%E7%BD%AE%E7%9B%B8%E5%85%B3-myblog/)

通常我们会将打包的内容放到指定的文件夹下，名字和位置都可以自定义。

dist - umd / lib - cjs / es - esm，当你用 require 引入的就是 lib 下的组件，用 import 引入的就是 es 下的组件，而直接 script 标签引入的就是 unpkg 下的组件。

```json
 // 打包后，引用时，读取文件的指定入口。
 "main": "lib/src/index.js",
 "module": "es/src/index.js",
 "_unpkg": true,
 "unpkgFiles": [
    "dist/*.js"
  ],s
  // "unpkg": "dist/antd.min.js"
 "typings": "es/src/index.d.ts",
```

| Config/Field Name | Description / Usage                                                                                                                                                                                                                                                                 | docs link                                                                                                                                                                                                            | ps                                                                                   |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| main              | The main field is a module ID that is the primary entry point to your program. That is, if your package is named `foo`, and a user installs it, and then does `require("foo")`, then your main module's exports object will be returned.                                            | https://docs.npmjs.com/cli/v10/configuring-npm/package-json#main                                                                                                                                                     | Usually for cjm                                                                      |
| module            | The main field makes sure that Node users using require will be served the UMD version. The module field is not an official npm feature but a common convention among bundlers to designate how to import an ESM version of our library.<br />定义一个针对 es6 模块及语法的入口文件 | https://esbuild.github.io/api/#main-fields<br />https://stackoverflow.com/questions/42708484/what-is-the-module-package-json-field-for<br />https://github.com/rollup/rollup/wiki/pkg.module                         | For esm                                                                              |
| \_unpkg           | 让 npm 上所有的文件都开启 cdn 服务。<br />`unpkg` 字段是一个字符串，用于指定入口文件（即主要资源），该文件将在访问 unpkg CDN 时加载。可以是一个`.js`、`.json` 或 `.html` 文件的 URL。当未指定`unpkg` 字段时，默认情况下，unpkg 将加载通过`main` 字段指定的主要文件。                | https://unpkg.com/<br />==未找到相关字段的正式文档说明==                                                                                                                                                             | 非官方字段                                                                           |
| unpkgFiles        | unpkgFiles 字段是一个数组，用于指定应该在访问 unpkg CDN 时加载的其他文件。可以指定多个文件的路径，这些文件将作为附加资源加载到入口文件的环境中。                                                                                                                                    | ==未找到相关字段的正式文档说明==                                                                                                                                                                                     | 非官方字段                                                                           |
| unpkg             | 直接指定具体文件                                                                                                                                                                                                                                                                    | ==未找到相关字段的正式文档说明==                                                                                                                                                                                     |                                                                                      |
| typings           | 就像 main 字段一样，定义一个针对 TypeScript 的入口文件。                                                                                                                                                                                                                            | [TypeScript documentation](https://link.segmentfault.com/?enc=0K%2FNGNY66hvmCCJTFmm9KA%3D%3D.6oRy7ETw0KN4i4rTLC%2BggEFSHSPEFEdA8GDv8ygPs39iY%2FBQd9n%2FfS3b9YmAh2rguDGW%2BKfAGTtwvLCiX9j7aE0l1mtouX65jZfuVZTxS8Q%3D) | 非官方字段<br />走tsc的时候会自动导出一个types.d.ts文件，在typings指定到这个文件即可 |

### pkgjson build command

在构建一个 JavaScript 组件库时，通常会打包出三种模块格式的代码：ESM（ES Modules）、CommonJS（CJS）、和 UMD（Universal Module Definition）。这些代码分别放在 lib、es、和 dist 目录下，并在 package.json 文件中声明不同模块规范的入口。umd 的代码用 webpack 打包就行。esm 和 commonjs 的不用打包，只需要用 tsc 或者 babel 编译下就好了。

```json
{
  // pkg build command
  "scripts": {
    "build": "webpack --config webpack.prod.js --progress & rm -rf dist && tsc -p tsconfig.json && tsc -p tsconfig-esm.json"
  }
}
```

### 相关打包文件

#### 项目文件树

```
lhs-virtual-list
├─ .gitignore
├─ .husky
│  ├─ _
│  │  ├─ .gitignore
│  │  └─ husky.sh
│  ├─ commit-msg
│  └─ pre-commit
├─ .prettierrc.json
├─ .storybook
│  ├─ main.ts
│  └─ preview.ts
├─ LICENSE
├─ README.md
├─ babel.config.js
├─ commitlint.config.js
├─ package.json
├─ pnpm-lock.yaml
├─ src
│  ├─ DynamicSizeList.tsx
│  ├─ FixedSizeList.tsx
│  ├─ VariableSizeList.tsx
│  ├─ index.css
│  ├─ index.ts
│  └─ utils.ts
├─ tsconfig.json
├─ tsconfig-esm.json
├─ webpack.base.js
├─ webpack.config.js
└─ webpack.prod.js
```

#### 打包文件内容

相关的打包文件有以下这几个：webpack.base.js、webpack.prod.js、tsconfig-esm.json、tsconfig.json、babel.config.js

webpack.base.js、webpack.prod.js这两个其实可以合成一份webpack.config.js文件，我这里就拆分成了prod和base两份，想用于区分prod环境和dev环境的配置。dev的配置文件我还没加上。

```js
// babel.config.js
module.exports = {
  presets: ['@babel/preset-env', ['@babel/preset-react', { runtime: 'automatic' }], '@babel/preset-typescript'],
};

```

```js
// tsconfig-esm.json

{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "target": "es2015",
    "module": "es6",
    "outDir": "./es",
    "moduleResolution": "node",
    "noUnusedParameters": false,
    "noUnusedLocals": false,
    "declaration": true, // for 生成d.ts文件，不然引入组件的时候会把错，找不到相关声明文件
    "baseUrl": "./",
    "sourceMap": true,
    "allowJs": true,
    "lib": ["es7", "dom"],
    "noImplicitAny": false,
    "jsx": "react",
    "forceConsistentCasingInFileNames": true,
    "allowSyntheticDefaultImports": true,
    "experimentalDecorators": true,
    "noImplicitReturns": true,
    "noImplicitThis": false,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "strictNullChecks": false,
    "strict": true
  }
}

```

```js
// tsconfig.json

{
  "compilerOptions": {
    "baseUrl": "./",
    "strictNullChecks": true,
    "experimentalDecorators": true,
    "jsx": "react",
    "jsxFactory": "React.createElement",
    "jsxFragmentFactory": "React.Fragment",
    "noUnusedParameters": false,
    "noUnusedLocals": false,
    "noImplicitAny": true,
    "lib": ["dom", "es2017"],
    "skipLibCheck": true,
    "stripInternal": true,
    "resolvePackageJsonExports": false,
    "target": "ES2015",
    "module": "commonjs",
    "outDir": "./lib",
    "esModuleInterop": true,
    "moduleResolution": "node"
  },
  "include": ["**/*"],
  "exclude": ["node_modules", "lib", "es"]
}

```

```js
// webpack.base.js
const path = require('path');
const webpack = require('webpack');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = {
  module: {
    rules: [
      {
        test: /\.(scss|css)$/i,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.(tsx|ts|js|)$/i,
        exclude: /node_modules/,
        // use: {
        //   loader: 'babel-loader',
        //   options: {
        //     presets: ['@babel/preset-env'],
        //   },
        // },
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                '@babel/preset-react',
                [
                  '@babel/preset-env',
                  {
                    modules: false,
                    targets: {
                      browsers: ['> 0.5%', 'last 2 versions', 'Firefox ESR', 'not dead', 'not IE 11'],
                    },
                  },
                ],
              ],
              plugins: ['lodash'],
            },
          },
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
              happyPackMode: false,
              appendTsSuffixTo: [],
            },
          },
        ],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
    ],
  },
  // add ts and tsx suffix to resolve entry，使编译能自动匹配后缀
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
  },
};

if (process.env.npm_config_report) {
  module.exports.plugins = (module.exports.plugins || []).concat([new BundleAnalyzerPlugin()]);
}

```

```js
// webpack.prod.js
const path = require('path');
const webpack = require('webpack');
const { merge } = require('webpack-merge');

const { DefinePlugin } = webpack;
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const WebpackBarPlugin = require('webpackbar');

const { HashedModuleIdsPlugin } = webpack.ids;
const webpackBaseConfig = require('./webpack.base');

module.exports = merge(webpackBaseConfig, {
  mode: 'production',
  bail: true,
  devtool: 'source-map',
  entry: path.resolve(__dirname, './src/index'),
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'lhs.js', // 输出文件名
    library: 'lhscomponents', // 组件库名称
    libraryTarget: 'umd', // 模块化格式
    umdNamedDefine: true,
  },
  externals: {
    react: {
      root: 'React',
      commonjs2: 'react',
      commonjs: 'react',
      amd: 'react',
    },
    'react-dom': {
      root: 'ReactDOM',
      commonjs2: 'react-dom',
      commonjs: 'react-dom',
      amd: 'react-dom',
    },
  },
  plugins: [
    new DefinePlugin({
      'process.env': { NODE_ENV: '"production"', PUBLIC_URL: undefined },
    }),
    new CaseSensitivePathsPlugin(),
    new WebpackBarPlugin(),
    new HashedModuleIdsPlugin(),
  ],
});

```

### keywords:

keywords: Webpack, bundle, ui library, react component, build, npm package
