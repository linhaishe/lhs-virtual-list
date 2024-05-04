import type { DynamicSizeListProps, VariableSizeListProps } from './types';

interface MeasuredDataItem {
  offset: number;
  size: number;
}

interface MeasuredData {
  measuredDataMap: {
    [key: string]: MeasuredDataItem;
  };
  lastMeasuredItemIndex: number;
}

// 元数据
const measuredData: MeasuredData = {
  measuredDataMap: {
    lastMeasuredItemIndex: {
      offset: 0,
      size: 0,
    },
  },
  lastMeasuredItemIndex: -1,
};

// 这是在计算什么？没看懂，好像是在计算top; 计算容纳所有itemCount的盒子高度
/**
 * 用来估算整个列表的总高度。在这段代码中，列表中的每一项都有一个预估的高度，如果某些项的真实高度已经被测量过，那么就会使用真实的高度来计算总高度；而对于那些未被真实测量过的项，就会使用默认的预估高度来进行估算。最终得到的 totalEstimatedHeight 就是整个列表的预估总高度。
 *
 * 首先初始化 measuredHeight 为 0。
 * 然后判断是否已经有项的真实高度被测量过（lastMeasuredItemIndex >= 0），如果是，则将 measuredHeight 设置为最后一个被测量项的 offset 加上其 size。
 * 接着计算未被测量过的项数（unMeasuredItemsCount），即列表总数减去最后一个被测量项的索引减一。
 * （这里计算未被测量过的项数是因为，如果某些项的真实高度已经被测量过，那么在计算整个列表的总高度时，就可以使用这些项的真实高度，而不是默认的预估高度。因此，未被测量过的项数就是需要使用默认预估高度来计算其高度的项的个数。计算方法是：列表总数减去最后一个被测量项的索引再减一。其中，最后一个被测量项的索引是 lastMeasuredItemIndex，由于数组索引从0开始，因此未被测量过的项数应该是 itemCount - lastMeasuredItemIndex - 1。）
 * 最后根据已测量高度和未测量项数乘以默认预估高度，计算出整个列表的总预估高度，并返回这个值。
 */
const estimatedHeight = (itemCount: number, defaultEstimatedItemSize = 50) => {
  let measuredHeight = 0;
  const { measuredDataMap, lastMeasuredItemIndex } = measuredData;
  // 计算已经获取过真实高度的项的高度之和
  if (lastMeasuredItemIndex >= 0) {
    const lastMeasuredItem = measuredDataMap[lastMeasuredItemIndex];
    measuredHeight = lastMeasuredItem.offset + lastMeasuredItem.size;
  }
  // 未计算过真实高度的项数
  const unMeasuredItemsCount = itemCount - measuredData.lastMeasuredItemIndex - 1;
  // 预测总高度
  const totalEstimatedHeight = measuredHeight + unMeasuredItemsCount * defaultEstimatedItemSize;
  return totalEstimatedHeight;
};

const getItemMetaData = (props: VariableSizeListProps | DynamicSizeListProps, index: number) => {
  // console.log('index', index);
  // 这里打印会无限循环，为什么？好像不是循环，是昂贵计算
  // const { getItemSize } = props;
  const { measuredDataMap, lastMeasuredItemIndex } = measuredData;
  // 如果当前索引比已记录的索引要大，说明要计算当前索引的项的size和offset
  if (index > lastMeasuredItemIndex) {
    let offset = 0;
    // 计算当前能计算出来的最大offset值
    if (lastMeasuredItemIndex >= 0) {
      const lastMeasuredItem = measuredDataMap[lastMeasuredItemIndex];
      offset += lastMeasuredItem.offset + lastMeasuredItem.size;
    }
    // 计算直到index为止，所有未计算过的项
    for (let i = lastMeasuredItemIndex + 1; i <= index; i++) {
      const currentItemSize = (props as VariableSizeListProps)?.getItemSize
        ? (props as VariableSizeListProps)?.getItemSize(i)
        : (props as DynamicSizeListProps)?.itemEstimatedSize || 50;
      measuredDataMap[i] = { size: currentItemSize, offset };
      offset += currentItemSize;
    }
    // 更新已计算的项的索引值
    measuredData.lastMeasuredItemIndex = index;
  }
  return measuredDataMap[index];
};

const getStartIndex = (props: VariableSizeListProps | DynamicSizeListProps, scrollOffset: number) => {
  const { itemCount } = props;
  let index = 0;
  while (true) {
    const currentOffset = getItemMetaData(props, index).offset;
    console.log('currentOffset', currentOffset);
    // 在当前元素的scrollOffset > 列表滑动的scrollOffset 则使用这个元素的index作为index
    if (currentOffset >= scrollOffset) return index;
    // 当滑动到最后的时候，只选取列表最大的index作为index
    if (index >= itemCount) return itemCount;
    index++;
  }
};

const getEndIndex = (props: VariableSizeListProps | DynamicSizeListProps, startIndex: number) => {
  const { height, itemCount } = props;
  // 获取可视区内开始的项
  const startItem = getItemMetaData(props, startIndex);
  // 可视区内最大的offset值
  const maxOffset = startItem.offset + height;
  // 开始项的下一项的offset，之后不断累加此offset，直到等于或超过最大offset，就是找到结束索引了
  let offset = startItem.offset + startItem.size;
  // 结束索引
  let endIndex = startIndex;
  // 累加offset
  // 函数会在 while 循环结束后才返回 endIndex，而不是在循环中的每次迭代都返回
  while (offset <= maxOffset && endIndex < itemCount - 1) {
    endIndex++;
    const currentItem = getItemMetaData(props, endIndex);
    offset += currentItem.size;
  }
  return endIndex;
};

/**
 * 获取起始索引和结束索引
 */
const getRangeToRender = (props: VariableSizeListProps | DynamicSizeListProps, scrollOffset: number) => {
  const { itemCount } = props;
  const startIndex = getStartIndex(props, scrollOffset);
  console.log('startIndex', startIndex);
  const endIndex = getEndIndex(props, startIndex);
  return [Math.max(0, startIndex - 2), Math.min(itemCount - 1, endIndex + 2), startIndex, endIndex];
};

export { estimatedHeight, getItemMetaData, getStartIndex, getEndIndex, getRangeToRender, measuredData };
