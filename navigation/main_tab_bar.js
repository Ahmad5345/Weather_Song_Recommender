import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome } from '@expo/vector-icons';

import WeatherCard from '../components/about';
import SearchTab from './search_tab';

const Tab = createBottomTabNavigator();

const MainTabBar = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="Search"
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused }) => {
            const iconName =
              route.name === 'About' ? 'info-circle' : 'search';

            return (
              <FontAwesome
                name={iconName}
                size={24}
                color={focused ? '#0a84ff' : '#8e8e93'}
              />
            );
          },
          headerShown: false,
          tabBarStyle: {
            backgroundColor: '#1c1c1e',
            borderTopColor: '#2c2c2e',
          },
        })}
      >
        <Tab.Screen name="Search" component={SearchTab} />
        <Tab.Screen name="About" component={WeatherCard} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default MainTabBar;