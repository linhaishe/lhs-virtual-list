import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import { FixedSizeList } from '../index';
import '../index.css';

type RowProps = {
  index: number;
  style: React.CSSProperties;
};

const Row = ({ index, style }: RowProps) => (
  <div className={index % 2 ? 'list-item-odd' : 'list-item-even'} style={style}>
    {`Row ${index}`}
  </div>
);

const meta = {
  title: 'Example/FixedSizeList',
  component: FixedSizeList,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  args: {},
} satisfies Meta<typeof FixedSizeList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FixedSizeListDemo: Story = {
  args: {
    height: 200,
    width: 200,
    itemSize: 50,
    itemCount: 1000,
    children: Row,
  },
};
