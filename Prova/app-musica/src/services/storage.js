import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'playlists';

export const getPlaylists = async () => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Erro ao buscar playlists:", error);
    return [];
  }
};

export const savePlaylists = async (playlists) => {
  try {
    console.log('Salvando playlists:', playlists);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(playlists));
  } catch (error) {
    console.error("Erro ao salvar playlists:", error);
  }
};

export const addPlaylist = async (playlist) => {
  try {
    const playlists = await getPlaylists();
    console.log('Playlists antes de adicionar:', playlists);
    playlists.push(playlist);
    console.log('Playlists após adicionar:', playlists);
    await savePlaylists(playlists);
  } catch (error) {
    console.error("Erro no addPlaylist:", error);
  }
};

export const updatePlaylist = async (id, newData) => {
  let playlists = await getPlaylists();
  playlists = playlists.map(p => p.id === id ? { ...p, ...newData } : p);
  await savePlaylists(playlists);
};

export const deletePlaylist = async (id) => {
  let playlists = await getPlaylists();
  playlists = playlists.filter(p => p.id !== id);
  await savePlaylists(playlists);
};