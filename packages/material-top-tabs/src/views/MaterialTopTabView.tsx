import {
  CommonActions,
  ParamListBase,
  Route,
  TabNavigationState,
  useTheme,
} from '@react-navigation/native';
import * as React from 'react';
import { SceneRendererProps, TabView } from 'react-native-tab-view';

import type {
  MaterialTopTabBarProps,
  MaterialTopTabDescriptorMap,
  MaterialTopTabNavigationConfig,
  MaterialTopTabNavigationHelpers,
} from '../types';
import MaterialTopTabBar from './MaterialTopTabBar';

type Props = MaterialTopTabNavigationConfig & {
  state: TabNavigationState<ParamListBase>;
  navigation: MaterialTopTabNavigationHelpers;
  descriptors: MaterialTopTabDescriptorMap;
};

export default function MaterialTopTabView({
  tabBar = (props: MaterialTopTabBarProps) => <MaterialTopTabBar {...props} />,
  state,
  navigation,
  descriptors,
  sceneContainerStyle,
  ...rest
}: Props) {
  const { colors } = useTheme();

  const renderTabBar = (props: SceneRendererProps) => {
    return tabBar({
      ...props,
      state: state,
      navigation: navigation,
      descriptors: descriptors,
    });
  };

  const focusedOptions = descriptors[state.routes[state.index].key].options;

  return (
    <TabView<Route<string>>
      {...rest}
      onIndexChange={(index) => {
        const route =
          state.routes[index] ?? state.routes[state.routes.length - 1];
        return navigation.dispatch({
          ...CommonActions.navigate({
            name: route.name,
            merge: true,
          }),
          target: state.key,
        });
      }}
      renderScene={({ route }) => descriptors[route.key].render()}
      navigationState={state}
      renderTabBar={renderTabBar}
      renderLazyPlaceholder={({ route }) =>
        descriptors[route.key].options.lazyPlaceholder?.() ?? null
      }
      lazy={({ route }) => descriptors[route.key].options.lazy === true}
      lazyPreloadDistance={focusedOptions.lazyPreloadDistance}
      swipeEnabled={focusedOptions.swipeEnabled}
      onSwipeStart={() => navigation.emit({ type: 'swipeStart' })}
      onSwipeEnd={() => navigation.emit({ type: 'swipeEnd' })}
      sceneContainerStyle={[
        { backgroundColor: colors.background },
        sceneContainerStyle,
      ]}
    />
  );
}
