import AsyncStorage from '@react-native-async-storage/async-storage';

const PLAY_COUNT_KEY = 'playcount';

export const getPlayCount = async () => {
  const data = await AsyncStorage.getItem(PLAY_COUNT_KEY);
  return data ? JSON.parse(data) : {};
};

export const incrementPlayCount = async (musicaId) => {
  const playCount = await getPlayCount();
  playCount[musicaId] = (playCount[musicaId] || 0) + 1;
  await AsyncStorage.setItem(PLAY_COUNT_KEY, JSON.stringify(playCount));
};

export const getMostPlayed = async () => {
  const playCount = await getPlayCount();
  const entries = Object.entries(playCount);
  if (entries.length === 0) return null;
  const [id, count] = entries.reduce((a, b) => (b[1] > a[1] ? b : a));
  return { id, count };
};
