import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
  FlatList,
  TouchableHighlight,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import getWeather from '../services/weather-api';
import runLLM from '../services/llm-api';
import youtubeSearch from '../services/youtube-api';

const parseSongs = (llmText) =>
  llmText
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean);

const VideoCard = ({ video }) => {
  const navigation = useNavigation();

  return (
    <TouchableHighlight
      onPress={() => navigation.navigate('Detail', { video })}
      underlayColor="#2c2c2e"
      style={styles.touchWrapper}
    >
      <View style={styles.card}>
        <Image
          source={{ uri: video.snippet.thumbnails.default.url }}
          style={styles.thumbnail}
        />

        <View style={styles.textContainer}>
          <Text style={styles.title} numberOfLines={2}>
            {video.snippet.title}
          </Text>
          <Text style={styles.subtitle}>Tap to play</Text>
        </View>
      </View>
    </TouchableHighlight>
  );
};

const VideoList = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const generatePlaylist = async () => {
      try {
        const lat = 43.7022;
        const lon = -72.2896;

        const weather = await getWeather(lat, lon);

        const prompt = `
The current weather conditions are:
- Temperature: ${weather.current.temperature_2m}°C
- Feels like: ${weather.current.apparent_temperature}°C
- Wind speed: ${weather.current.wind_speed_10m} km/h
- Tomorrow's high: ${weather.daily.temperature_2m_max[1]}°C

Recommend 5 songs that match the mood.
Format exactly as: Song Title - Artist
One song per line.
`;

        const llmReply = await runLLM(prompt);
        const songs = parseSongs(llmReply);

        const results = [];

        for (const song of songs) {
          const yt = await youtubeSearch(song);
          if (yt.length > 0) {
            const v = yt[0];
            results.push({
              id: { videoId: v.id.videoId },
              snippet: {
                title: song,
                thumbnails: {
                  default: {
                    url: `https://img.youtube.com/vi/${v.id.videoId}/default.jpg`,
                  },
                },
              },
            });
          }
        }

        setVideos(results);
      } catch (err) {
        console.error('Playlist generation failed:', err);
      } finally {
        setLoading(false);
      }
    };

    generatePlaylist();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" style={styles.loader} />;
  }

  return (
    <View style={styles.screen}>
      <FlatList
        data={videos}
        renderItem={({ item }) => <VideoCard video={item} />}
        keyExtractor={(item, index) =>
          `${item.id.videoId ?? 'video'}-${index}`
        }
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  loader: {
    marginTop: 60,
  },
  screen: {
    flex: 1,
    backgroundColor: '#000000',
  },
  listContent: {
    paddingVertical: 20,
  },
  touchWrapper: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 22,
  },
  card: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 22,
    backgroundColor: '#1c1c1e',
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  thumbnail: {
    width: 92,
    height: 92,
    borderRadius: 16,
    marginRight: 14,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13,
    color: '#a1a1a6',
  },
});

export default VideoList;