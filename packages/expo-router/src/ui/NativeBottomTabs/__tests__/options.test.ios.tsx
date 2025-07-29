import React from 'react';
import { View } from 'react-native';

import { screen, renderRouter } from '../../../testing-library';
import { NativeTabs } from '../NativeBottomTabsNavigator';
import type { NativeTabOptions } from '../NativeTabsView';
import { AndroidIcon, Icon, IOSIcon } from '../NavigatorElements';

jest.mock('react-native-screens', () => {
  const { View }: typeof import('react-native') = jest.requireActual('react-native');
  return {
    ...(jest.requireActual('react-native-screens') as typeof import('react-native-screens')),
    BottomTabs: jest.fn(({ children }) => <View testID="BottomTabs">{children}</View>),
    BottomTabsScreen: jest.fn(({ children }) => <View testID="BottomTabsScreen">{children}</View>),
  };
});

it('can pass options via options prop', () => {
  const { BottomTabsScreen } = require('react-native-screens');
  const indexOptions: NativeTabOptions = {
    title: 'Test Title',
    tabBarItemIconColor: 'blue',
  };
  const secondOptions: NativeTabOptions = {
    title: 'Second Title',
    tabBarItemIconColor: 'red',
  };
  renderRouter({
    _layout: () => (
      <NativeTabs>
        <NativeTabs.Trigger name="index" options={{ ...indexOptions }} />
        <NativeTabs.Trigger name="second" options={{ ...secondOptions }} />
      </NativeTabs>
    ),
    index: () => <View testID="index" />,
    second: () => <View testID="second" />,
  });

  expect(screen.getByTestId('index')).toBeVisible();
  expect(screen.getByTestId('second')).toBeVisible();
  expect(BottomTabsScreen).toHaveBeenCalledTimes(2);
  expect(BottomTabsScreen.mock.calls[0][0]).toMatchObject({
    ...indexOptions,
  });
  expect(BottomTabsScreen.mock.calls[1][0]).toMatchObject({
    ...secondOptions,
  });
});

it('can pass options via elements', () => {
  const { BottomTabsScreen } = require('react-native-screens');
  renderRouter({
    _layout: () => (
      <NativeTabs>
        <NativeTabs.Trigger name="index">
          <IOSIcon name="homepod.2.fill" />
        </NativeTabs.Trigger>
      </NativeTabs>
    ),
    index: () => <View testID="index" />,
  });

  expect(screen.getByTestId('index')).toBeVisible();
  expect(BottomTabsScreen).toHaveBeenCalledTimes(1);
  expect(BottomTabsScreen.mock.calls[0][0]).toMatchObject({
    icon: { sfSymbolName: 'homepod.2.fill' },
  } as NativeTabOptions);
});

it('when no options are passed, default ones are used', () => {
  const { BottomTabsScreen } = require('react-native-screens');
  renderRouter({
    _layout: () => (
      <NativeTabs>
        <NativeTabs.Trigger name="index" />
      </NativeTabs>
    ),
    index: () => <View testID="index" />,
  });

  expect(screen.getByTestId('index')).toBeVisible();
  expect(BottomTabsScreen).toHaveBeenCalledTimes(1);
  expect(Object.keys(BottomTabsScreen.mock.calls[0][0])).toEqual([
    'hidden',
    'specialEffects',
    'tabKey',
    'isFocused',
    'onWillAppear',
    'children',
  ]);
  expect(BottomTabsScreen.mock.calls[0][0]).toMatchObject({
    hidden: false,
    specialEffects: {},
    tabKey: expect.stringMatching(/^index-[-\w]+/),
    isFocused: true,
    onWillAppear: expect.any(Function),
    children: expect.objectContaining({}),
  } as NativeTabOptions);
});

describe('Icons', () => {
  it('when using IOSIcon with name prop, it is passed as sfSymbolName', () => {
    const { BottomTabsScreen } = require('react-native-screens');
    renderRouter({
      _layout: () => (
        <NativeTabs>
          <NativeTabs.Trigger name="index">
            <IOSIcon name="homepod.2.fill" />
          </NativeTabs.Trigger>
        </NativeTabs>
      ),
      index: () => <View testID="index" />,
    });

    expect(screen.getByTestId('index')).toBeVisible();
    expect(BottomTabsScreen).toHaveBeenCalledTimes(1);
    expect(BottomTabsScreen.mock.calls[0][0]).toMatchObject({
      icon: { sfSymbolName: 'homepod.2.fill' },
    } as NativeTabOptions);
  });

  it('when using IOSIcon with useAsSelected prop, it is passed as selected icon sfSymbolName', () => {
    const { BottomTabsScreen } = require('react-native-screens');
    renderRouter({
      _layout: () => (
        <NativeTabs>
          <NativeTabs.Trigger name="index">
            <IOSIcon name="homepod.2.fill" useAsSelected />
          </NativeTabs.Trigger>
        </NativeTabs>
      ),
      index: () => <View testID="index" />,
    });

    expect(screen.getByTestId('index')).toBeVisible();
    expect(BottomTabsScreen).toHaveBeenCalledTimes(1);
    expect(BottomTabsScreen.mock.calls[0][0]).toMatchObject({
      selectedIcon: { sfSymbolName: 'homepod.2.fill' },
    } as NativeTabOptions);
  });

  it('when using IOSIcon with and without useAsSelected prop, value is passed correctly', () => {
    const { BottomTabsScreen } = require('react-native-screens');
    renderRouter({
      _layout: () => (
        <NativeTabs>
          <NativeTabs.Trigger name="index">
            <IOSIcon name="stairs" />
            <IOSIcon name="homepod.2.fill" useAsSelected />
          </NativeTabs.Trigger>
        </NativeTabs>
      ),
      index: () => <View testID="index" />,
    });

    expect(screen.getByTestId('index')).toBeVisible();
    expect(BottomTabsScreen).toHaveBeenCalledTimes(1);
    expect(BottomTabsScreen.mock.calls[0][0]).toMatchObject({
      selectedIcon: { sfSymbolName: 'homepod.2.fill' },
      icon: { sfSymbolName: 'stairs' },
    } as NativeTabOptions);
  });

  it('when using AndroidIcon on iOS, no value is passed', () => {
    const { BottomTabsScreen } = require('react-native-screens');
    renderRouter({
      _layout: () => (
        <NativeTabs>
          <NativeTabs.Trigger name="index">
            <AndroidIcon name="stairs" />
          </NativeTabs.Trigger>
        </NativeTabs>
      ),
      index: () => <View testID="index" />,
    });

    expect(screen.getByTestId('index')).toBeVisible();
    expect(BottomTabsScreen).toHaveBeenCalledTimes(1);
    expect(BottomTabsScreen.mock.calls[0][0]).not.toHaveProperty('icon');
    expect(BottomTabsScreen.mock.calls[0][0]).not.toHaveProperty('iconResourceName');
  });
});
