import getWeather from './weather-api.js';
import runLLM from './llm-api.js';
import youtubeSearch from './youtube-api.js';

const parseSongs = (llmText) => {
  return llmText
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0);
};

const main = async () => {
  try {
    const lat = 43.7022;
    const lon = -72.2896;

    const weather = await getWeather(lat, lon);

    const weatherSummary = {
      temperature: weather.current.temperature_2m,
      feelsLike: weather.current.apparent_temperature,
      windSpeed: weather.current.wind_speed_10m,
      tomorrowHigh: weather.daily.temperature_2m_max[1]
    };

    const prompt = `
The current weather conditions are:
- Temperature: ${weatherSummary.temperature}°C
- Feels like: ${weatherSummary.feelsLike}°C
- Wind speed: ${weatherSummary.windSpeed} km/h
- Tomorrow's high: ${weatherSummary.tomorrowHigh}°C

Recommend 5 songs that match the mood.
Format exactly as: Song Title - Artist
One song per line.
`;

    const llmReply = await runLLM(prompt);

    const songs = parseSongs(llmReply);

    console.log('Songs from LLM:', songs);

    const playlist = [];

    for (const song of songs) {
      const videos = await youtubeSearch(song);
      if (videos.length > 0) {
        playlist.push({
          song,
          videoId: videos[0].id.videoId,
          youtubeUrl: `https://www.youtube.com/watch?v=${videos[0].id.videoId}`
        });
      }
    }

    console.log('\nGenerated playlist:\n');
    playlist.forEach((item, i) => {
      console.log(`${i + 1}. ${item.song}`);
      console.log(item.youtubeUrl);
    });

  } catch (error) {
    console.error('Playlist generation failed:', error.message);
  }
};

main();
