import React from 'react';
import { View, StyleSheet } from 'react-native';
import WebView from 'react-native-webview';

const VideoDetail = (props) => {
  const { route } = props;
  const { video } = route.params;

  return (
    <View style={styles.container}>
      <WebView
        source={{ uri: `https://www.youtube.com/watch?v=${video.id.videoId}` }}
        automaticallyAdjustContentInsets={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
});

export default VideoDetail;
