import React, { useState } from 'react';
import { getItemMetaData, getRangeToRender } from './utils';
import type { VariableSizeListProps } from './types';

const VirtualList = (props: VariableSizeListProps) => {
  const { height, width, itemSize = 0, itemCount, children: Child } = props;
  // 记录滚动掉的高度
  const [scrollOffset, setScrollOffset] = useState(0);

  // 外部容器高度
  const containerStyle: any = {
    position: 'relative',
    width,
    height,
    overflow: 'auto',
  };

  // 1000个元素撑起盒子的实际高度
  const contentStyle = {
    height: itemSize * itemCount,
    width: '100%',
  };

  const getCurrentChildren = () => {
    const [startIndex, endIndex] = getRangeToRender(props, scrollOffset);
    const items = [];

    for (let i = startIndex; i <= endIndex; i++) {
      const item = getItemMetaData(props, i);
      const itemStyle = {
        position: 'absolute',
        height: item.size,
        width: '100%',
        top: item.offset,
      };
      items.push(<Child key={i} index={i} style={itemStyle} />);
    }
    return items;
  };

  // 当触发滚动就重新计算
  const scrollHandle = (event: any) => {
    const { scrollTop } = event.currentTarget;
    setScrollOffset(scrollTop);
  };

  return (
    <div style={containerStyle} onScroll={scrollHandle}>
      <div style={contentStyle}>{getCurrentChildren()}</div>
    </div>
  );
};

export default VirtualList;
