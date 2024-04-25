// import type { ReactNode } from 'react';

/**
 * @api FixedSizeList
 */

export enum ItemSizeTypeE {
  /**
   * 是否每个元素是固定高度
   */
  stableSize = 'stableSize',
  /**
   * 是否列表元素是不确定高度
   */
  variableSize = 'variableSize',
  /**
   * 是否列表元素是动态高度
   */
  dynamicSize = 'dynamicSize',
}

export interface ListsProps {
  // children?: ReactNode;
  children?: any;
  /**
   * 列表高度
   */
  height: number;
  /**
   * 列表宽度
   */
  width: number;
  /**
   * 单个元素高度
   */
  itemSize?: number;
  /**
   * 元素总数
   */
  itemCount: number;
  /**
   * 获取元素高度，'variableSize'时使用
   */
  getItemSize?: Function;
  /**
   * 元素预计高度，不定高度的虚拟列表计算所需值，默认50
   */
  itemEstimatedSize?: number;
  /**
   * 列表元素高度类型，默认固定高度
   */
  itemSizeType?: 'stableSize' | 'variableSize' | 'dynamicSize';
}
