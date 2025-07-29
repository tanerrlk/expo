import { Platform } from 'expo-modules-core';
import React from 'react';
import { BottomTabs, BottomTabsScreen, enableFreeze, featureFlags } from 'react-native-screens';

import type { NativeTabsViewProps } from './types';

const isControlledMode = Platform.OS === 'android';
featureFlags.experiment.controlledBottomTabs = isControlledMode;

enableFreeze(false);
export function NativeTabsView(props: NativeTabsViewProps) {
  const { builder, style, minimizeBehavior, disableIndicator } = props;
  const { state, descriptors, navigation } = builder;
  const { routes } = state;

  const children = routes
    .map((route, index) => ({ route, index }))
    .filter(({ route: { key } }) => !descriptors[key].options.hidden)
    .map(({ route, index }) => {
      const descriptor = descriptors[route.key];
      const isFocused = state.index === index;

      return (
        <BottomTabsScreen
          key={route.key}
          {...descriptor.options}
          tabKey={route.key}
          isFocused={isFocused}
          onWillAppear={() => {
            console.log('On will appear', route.name);
            if (!isControlledMode) {
              navigation.dispatch({
                type: 'JUMP_TO',
                target: state.key,
                payload: {
                  name: route.name,
                },
              });
            }
          }}>
          {descriptor.render()}
        </BottomTabsScreen>
      );
    });

  return (
    <BottomTabs
      tabBarItemTitleFontColor={style?.color}
      tabBarItemTitleFontFamily={style?.fontFamily}
      tabBarItemTitleFontSize={style?.fontSize}
      tabBarItemTitleFontWeight={style?.fontWeight}
      tabBarItemTitleFontStyle={style?.fontStyle}
      tabBarBackgroundColor={style?.backgroundColor}
      tabBarBlurEffect={style?.blurEffect}
      tabBarTintColor={style?.tintColor}
      tabBarItemBadgeBackgroundColor={style?.badgeBackgroundColor}
      tabBarItemRippleColor={style?.rippleColor}
      tabBarItemLabelVisibilityMode={style?.labelVisibilityMode}
      tabBarItemIconColor={style?.iconColor}
      tabBarItemIconColorActive={style?.['&:active']?.iconColor ?? style?.tintColor}
      tabBarItemTitleFontColorActive={style?.['&:active']?.color ?? style?.tintColor}
      tabBarItemTitleFontSizeActive={style?.['&:active']?.fontSize}
      tabBarItemActiveIndicatorColor={style?.['&:active']?.indicatorColor}
      tabBarItemActiveIndicatorEnabled={!disableIndicator}
      tabBarMinimizeBehavior={minimizeBehavior}
      onNativeFocusChange={({ nativeEvent: { tabKey } }) => {
        console.log('onNativeFocusChange', tabKey);
        if (isControlledMode) {
          const descriptor = descriptors[tabKey];
          const route = descriptor.route;
          navigation.dispatch({
            type: 'JUMP_TO',
            target: state.key,
            payload: {
              name: route.name,
            },
          });
        }
      }}>
      {children}
    </BottomTabs>
  );
}
