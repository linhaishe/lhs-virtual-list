// import type { ReactNode } from 'react';

/**
 * @api
 */

export interface FixedSizeListProps {
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
  itemSize: number;
  /**
   * 元素总数
   */
  itemCount: number;
}

export interface VariableSizeListProps {
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
   * 元素总数
   */
  itemCount: number;
  /**
   * 获取元素高度，'variableSize'时使用
   */
  getItemSize: Function;
  /**
   * 元素预计高度，不定高度的虚拟列表计算所需值，默认50
   */
  itemEstimatedSize?: number;
}
