import React, { useState } from 'react';
import type { CSSProperties, ComponentType } from 'react';
import type { DynamicSizeListProps } from './types';
import { estimatedHeight, getItemMetaData, getRangeToRender, measuredData } from './utils';

interface ListItemProps {
  style: CSSProperties;
  ComponentType: ComponentType<any>;
  onSizeChange: Function;
  index: number;
}

class ListItem extends React.Component<ListItemProps> {
  domRef: React.RefObject<HTMLDivElement>;

  resizeObserver: ResizeObserver | null;

  constructor(props: ListItemProps) {
    super(props);
    this.domRef = React.createRef();
    this.resizeObserver = null;
  }

  componentDidMount() {
    if (this.domRef.current && this.domRef.current.firstChild) {
      const domNode = this.domRef.current.firstChild as HTMLElement;
      const { index, onSizeChange } = this.props;
      this.resizeObserver = new ResizeObserver(() => {
        onSizeChange(index, domNode);
      });
      this.resizeObserver.observe(domNode);
    }
  }

  componentWillUnmount() {
    if (!this.domRef.current) {
      return;
    }

    if (this.resizeObserver && this.domRef.current.firstChild) {
      this.resizeObserver.unobserve(this.domRef.current.firstChild as HTMLElement);
    }
  }

  render() {
    const { index, style, ComponentType } = this.props;

    if (!ComponentType) {
      return null; // 如果 ComponentType 不存在或不是有效的 JSX 组件类型，则返回 null 或其他适当的占位符
    }

    return (
      <div style={style} ref={this.domRef}>
        <ComponentType index={index} />
      </div>
    );
  }
}

function DynamicSizeList(props: DynamicSizeListProps) {
  const { height, width, itemCount, itemEstimatedSize = 50, children: Child } = props;
  const [scrollOffset, setScrollOffset] = useState(0);
  const [, setState] = useState({});

  const containerStyle: CSSProperties = {
    position: 'relative',
    width,
    height,
    overflow: 'auto',
    willChange: 'transform',
  };

  const contentStyle = {
    height: estimatedHeight(itemEstimatedSize, itemCount),
    width: '100%',
  };

  const sizeChangeHandle = (index: number, domNode: HTMLElement) => {
    const _height = domNode.offsetHeight;
    const { measuredDataMap, lastMeasuredItemIndex } = measuredData;
    let itemMetaData = measuredDataMap[index];
    itemMetaData.size = _height;
    let offset = 0;
    for (let i = 0; i <= lastMeasuredItemIndex; i++) {
      itemMetaData = measuredDataMap[i];
      itemMetaData.offset = offset;
      offset += itemMetaData.size;
    }
    setState({});
  };

  const getCurrentChildren = () => {
    const [startIndex, endIndex] = getRangeToRender(props, scrollOffset);
    const items = [];
    for (let i = startIndex; i <= endIndex; i++) {
      const item = getItemMetaData(props, i);
      const itemStyle: CSSProperties = {
        position: 'absolute',
        height: item.size,
        width: '100%',
        top: item.offset,
      };

      if (Child) {
        items.push(
          // eslint-disable-next-line comma-dangle
          <ListItem key={i} index={i} style={itemStyle} ComponentType={Child} onSizeChange={sizeChangeHandle} />
        );
      }
    }
    return items;
  };

  const scrollHandle = (event: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop } = event.currentTarget;
    setScrollOffset(scrollTop);
  };

  return (
    <div style={containerStyle} onScroll={scrollHandle}>
      <div style={contentStyle}>{getCurrentChildren()}</div>
    </div>
  );
}

export default DynamicSizeList;
