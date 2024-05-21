import React, { PureComponent, useState } from 'react';
import * as domHelpers from './utils/domHelpers';
import { FixedSizeList } from '../src';
import { JSDOM } from 'jsdom';
import renderer from 'react-test-renderer';

// 创建一个虚拟的 DOM 环境
const dom = new JSDOM('<!doctype html><html><body></body></html>');

// 将全局变量设置为模拟的 DOM 对象
(global as any).document = dom.window.document;
(global as any).window = dom.window;

function sum(a: number, b: number) {
  return a + b;
}

test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3);
});

describe('FixedSizeList', () => {
  let HTMLElement: any;
  let itemRenderer: any;
  let defaultProps: any;
  let getScrollbarSize;
  let onItemsRendered: any;
  let mockedScrollHeight = Number.MAX_SAFE_INTEGER;
  let mockedScrollWidth = Number.MAX_SAFE_INTEGER;

  // Use PureComponent to test memoization.
  // Pass through to itemRenderer mock for easier test assertions.
  class PureItemRenderer extends PureComponent {
    render() {
      return itemRenderer(this.props);
    }
  }

  beforeEach(() => {
    jest.useFakeTimers();

    mockedScrollHeight = Number.MAX_SAFE_INTEGER;
    mockedScrollWidth = Number.MAX_SAFE_INTEGER;

    // JSdom does not do actual layout and so doesn't return meaningful values here.
    // For the purposes of our tests though, we can mock out semi-meaningful values.
    // This mock is required for e.g. "onScroll" tests to work properly.
    // Object.defineProperties((HTMLElement as any)?.prototype, {
    //   clientWidth: {
    //     configurable: true,
    //     get() {
    //       return parseInt(this.style.width, 10) || 0;
    //     },
    //   },
    //   clientHeight: {
    //     configurable: true,
    //     get() {
    //       return parseInt(this.style.height, 10) || 0;
    //     },
    //   },
    //   scrollHeight: {
    //     configurable: true,
    //     get: () => mockedScrollHeight,
    //   },
    //   scrollWidth: {
    //     configurable: true,
    //     get: () => mockedScrollWidth,
    //   },
    // });

    // Mock the DOM helper util for testing purposes.
    getScrollbarSize = domHelpers!.getScrollbarSize = jest.fn(() => 0);

    onItemsRendered = jest.fn();

    itemRenderer = jest.fn(({ style, ...rest }) => <div style={style}>{JSON.stringify(rest, null, 2)}</div>);
    defaultProps = {
      children: PureItemRenderer,
      height: 100,
      itemCount: 100,
      itemSize: 25,
      onItemsRendered,
      width: 50,
    };
  });

  it('should render an empty list', () => {
    renderer.create(<FixedSizeList {...defaultProps} itemCount={0} />);
    expect(itemRenderer).not.toHaveBeenCalled();
    expect(onItemsRendered).not.toHaveBeenCalled();
  });
});

// test passes

const STATUS = {
  HOVERED: 'hovered',
  NORMAL: 'normal',
};

function Link({ page, children }: any) {
  const [status, setStatus] = useState(STATUS.NORMAL);

  const onMouseEnter = () => {
    setStatus(STATUS.HOVERED);
  };

  const onMouseLeave = () => {
    setStatus(STATUS.NORMAL);
  };

  return (
    <a className={status} href="#" onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      {children}
    </a>
  );
}

// it('changes the class when hovered', () => {
//   const component = renderer.create(<Link page="http://www.facebook.com">Facebook</Link>);
//   let tree = component.toJSON();
//   expect(tree).toMatchSnapshot();

//   // manually trigger the callback
//   renderer.act(() => {
//     tree!.props.onMouseEnter();
//   });
//   // re-rendering
//   tree = component.toJSON();
//   expect(tree).toMatchSnapshot();

//   // manually trigger the callback
//   renderer.act(() => {
//     tree!.props.onMouseLeave();
//   });
//   // re-rendering
//   tree = component.toJSON();
//   expect(tree).toMatchSnapshot();
// });
