import React from 'react';
import { mount } from 'enzyme';
import { ApplicationLauncher, DropdownItem, Dropdown, DropdownToggle } from '@patternfly/react-core';
import { capitalize, getUniqueId, debounce, isElementInView, sideElementIsOutOfView } from './util';
import { KEY_CODES, SIDE } from './constants';

test('capitalize', () => {
  expect(capitalize('foo')).toBe('Foo');
});

test('getUniqueId', () => {
  expect(getUniqueId()).not.toBe(getUniqueId());
});

test('getUniqueId prefixed', () => {
  expect(getUniqueId().substring(0, 3)).toBe('pf-');
  expect(getUniqueId('pf-switch').substring(0, 10)).toBe('pf-switch-');
});

test('debounce', () => {
  jest.useFakeTimers();
  const callback = jest.fn();
  const debouncedFunction = debounce(callback, 50);

  debouncedFunction();
  // At this point in time, the callback should not have been called yet
  expect(callback).toHaveBeenCalledTimes(0);

  for (let i = 0; i < 10; i++) {
    jest.advanceTimersByTime(50);
    debouncedFunction();
  }

  expect(callback).toBeCalledTimes(10);
});

test('isElementInView should be true when partial out of view and with partial true', () => {
  const container = { scrollLeft: 0, clientWidth: 200 };
  const element = { offsetLeft: 10, clientWidth: 200 };
  expect(isElementInView(container, element, true)).toBe(true);
});

test('isElementInView should be false when partial out of view and with partial false ', () => {
  const container = { scrollLeft: 0, clientWidth: 200 };
  const element = { offsetLeft: 10, clientWidth: 200 };
  expect(isElementInView(container, element, false)).toBe(false);
});

test('isElementInView should be false completely out of view ', () => {
  const container = { scrollLeft: 0, clientWidth: 200 };
  const element = { offsetLeft: 200, clientWidth: 100 };
  expect(isElementInView(container, element, true)).toBe(false);
});

test('isElementInView should be false completely out of view when partial false ', () => {
  const container = { scrollLeft: 0, clientWidth: 200 };
  const element = { offsetLeft: 200, clientWidth: 100 };
  expect(isElementInView(container, element, false)).toBe(false);
});

test('sideElementIsOutOfView Returns left when off on left side', () => {
  const container = { scrollLeft: 20, clientWidth: 200 };
  const element = { offsetLeft: 10, clientWidth: 200 };
  expect(sideElementIsOutOfView(container, element)).toBe(SIDE.LEFT);
});

test('sideElementIsOutOfView Returns right when off on right side', () => {
  const container = { scrollLeft: 0, clientWidth: 200 };
  const element = { offsetLeft: 210, clientWidth: 200 };
  expect(sideElementIsOutOfView(container, element)).toBe(SIDE.RIGHT);
});

test('sideElementIsOutOfView Returns NONE when in view', () => {
  const container = { scrollLeft: 0, clientWidth: 200 };
  const element = { offsetLeft: 10, clientWidth: 100 };
  expect(sideElementIsOutOfView(container, element)).toBe(SIDE.NONE);
});

describe('keyHandler works on ApplicationLauncher', () => {
  document.body.innerHTML = '<!doctype html><html><body></body></html>';
  const dropdownItems = [
    <DropdownItem key="link" id="first">
      Link
    </DropdownItem>,
    <DropdownItem key="action" id="second" component="button">
      Action
    </DropdownItem>,
    <DropdownItem key="disabled link" id="third" isDisabled>
      Disabled Link
    </DropdownItem>
  ];
  const view = mount(<ApplicationLauncher dropdownItems={dropdownItems} isOpen />, {
    attachTo: document.getElementsByName('div')[0]
  });
  const firstDropdownItem = view.find('#first').first();
  const secondDropdownItem = view.find('#second').first();
  const thirdDropdownItem = view.find('#third').first();

  test('keyHandler advances forward', () => {
    firstDropdownItem.simulate('keydown', {
      key: 'ArrowDown',
      keyCode: KEY_CODES.ARROW_DOWN,
      which: KEY_CODES.ARROW_DOWN
    });
    expect(secondDropdownItem === document.activeElement);
  });

  test('keyHandler regresses backward', () => {
    secondDropdownItem.simulate('keydown', { key: 'ArrowUp', keyCode: KEY_CODES.ARROW_UP, which: KEY_CODES.ARROW_UP });
    expect(firstDropdownItem === document.activeElement);
  });

  test('keyHandler skips disabled items and loops down to top', () => {
    secondDropdownItem.simulate('keydown', {
      key: 'ArrowDown',
      keyCode: KEY_CODES.ARROW_DOWN,
      which: KEY_CODES.ARROW_DOWN
    });
    expect(firstDropdownItem === document.activeElement);
  });

  test('keyHandler loops top to bottom', () => {
    firstDropdownItem.simulate('keydown', { key: 'ArrowUp', keyCode: KEY_CODES.ARROW_UP, which: KEY_CODES.ARROW_UP });
    expect(secondDropdownItem === document.activeElement);
  });
});

describe('keyHandler works on Dropdown', () => {
  document.body.innerHTML = '<!doctype html><html><body></body></html>';
  const dropdownItems = [
    <DropdownItem key="link" id="first">
      Link
    </DropdownItem>,
    <DropdownItem key="action" id="second" component="button">
      Action
    </DropdownItem>,
    <DropdownItem key="disabled link" id="third" isDisabled>
      Disabled Link
    </DropdownItem>
  ];
  const view = mount(
    <Dropdown dropdownItems={dropdownItems} isOpen toggle={<DropdownToggle>Expanded Dropdown</DropdownToggle>} />,
    {
      attachTo: document.getElementsByName('div')[0]
    }
  );
  const firstDropdownItem = view.find('#first').first();
  const secondDropdownItem = view.find('#second').first();
  const thirdDropdownItem = view.find('#third').first();

  test('keyHandler advances forward', () => {
    firstDropdownItem.simulate('keydown', {
      key: 'ArrowDown',
      keyCode: KEY_CODES.ARROW_DOWN,
      which: KEY_CODES.ARROW_DOWN
    });
    expect(secondDropdownItem === document.activeElement);
  });

  test('keyHandler regresses backward', () => {
    secondDropdownItem.simulate('keydown', { key: 'ArrowUp', keyCode: KEY_CODES.ARROW_UP, which: KEY_CODES.ARROW_UP });
    expect(firstDropdownItem === document.activeElement);
  });

  test('keyHandler skips disabled items and loops down to top', () => {
    secondDropdownItem.simulate('keydown', {
      key: 'ArrowDown',
      keyCode: KEY_CODES.ARROW_DOWN,
      which: KEY_CODES.ARROW_DOWN
    });
    expect(firstDropdownItem === document.activeElement);
  });

  test('keyHandler loops top to bottom', () => {
    firstDropdownItem.simulate('keydown', { key: 'ArrowUp', keyCode: KEY_CODES.ARROW_UP, which: KEY_CODES.ARROW_UP });
    expect(secondDropdownItem === document.activeElement);
  });
});
