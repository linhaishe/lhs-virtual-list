import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import '../index.css';
import { VariableSizeList } from '../index';

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
  title: 'Example/VariableSizeList',
  component: VariableSizeList,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  args: {},
} satisfies Meta<typeof VariableSizeList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const VariableSizeListDemo: Story = {
  args: {
    height: 200,
    width: 200,
    itemCount: 1000,
    children: Row,
    getItemSize,
  },
};
