// import type { ReactNode } from 'react';

/**
 * @api FixedSizeList
 */

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
  itemSize: number;
  /**
   * 元素总数
   */
  itemCount: number;
}
