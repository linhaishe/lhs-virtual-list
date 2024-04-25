import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import VirtualList from '../index';
import '../index.css';

type RowProps = {
  index: number;
  style: React.CSSProperties;
};

const rowSizes = new Array(1000).fill(true).map(() => 25 + Math.round(Math.random() * 55));
const getItemSize = (index: number) => rowSizes[index];

const Row = ({ index, style }: RowProps) => (
  <div className={index % 2 ? 'list-item-odd' : 'list-item-even'} style={style}>
    {`Row ${index}`}
  </div>
);

const meta = {
  title: 'Example/VirtualList',
  component: VirtualList,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  args: {},
} satisfies Meta<typeof VirtualList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FixedSizeListDemo: Story = {
  args: {
    height: 200,
    width: 200,
    itemSize: 50,
    itemCount: 1000,
    children: Row,
    itemSizeType: 'stableSize',
  },
};

export const VariableSizeListDemo: Story = {
  args: {
    height: 200,
    width: 200,
    itemCount: 1000,
    children: Row,
    itemSizeType: 'variableSize',
    getItemSize,
  },
};
