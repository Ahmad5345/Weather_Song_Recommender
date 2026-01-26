import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import VideoList from '../components/video_list';
import VideoDetail from '../components/video_detail';

const Stack = createStackNavigator();

const SearchTab = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#1c1c1e',
        },
        headerTintColor: '#ffffff',
      }}
    >
      <Stack.Screen
        name="VideoResults"
        component={VideoList}
        options={{ title: 'Weather Playlist' }}
      />
      <Stack.Screen
        name="Detail"
        component={VideoDetail}
        options={{ headerTitle: '' }}
      />
    </Stack.Navigator>
  );
};

export default SearchTab;