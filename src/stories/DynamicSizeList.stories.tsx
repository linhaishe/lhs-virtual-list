/* eslint-disable comma-dangle */
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import '../index.css';
import { DynamicSizeList } from '../index';

// type RowProps = {
//   index: number;
//   style: React.CSSProperties;
// };

const items: any = [];
const itemCount = 1000;
for (let i = 0; i < itemCount; i++) {
  const height = 30 + Math.floor(Math.random() * 30);
  const style = {
    height,
    width: '100%',
  };
  items.push(
    <div className={i % 2 ? 'list-item-odd' : 'list-item-even'} style={style}>
      Row {i}
    </div>
  );
}
const Row: React.FC<{ index: number }> = ({ index }) => items[index];

const meta = {
  title: 'Example/DynamicSizeList',
  component: DynamicSizeList,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  args: {},
} satisfies Meta<typeof DynamicSizeList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DynamicSizeListDemo: Story = {
  args: {
    height: 200,
    width: 200,
    itemCount: 1000,
    children: Row,
  },
};
