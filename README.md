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
