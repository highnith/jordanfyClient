import { createMMKV } from "react-native-mmkv";

const storage = createMMKV();

const KEY = "music_data";

export const getData = () => {
  const raw = storage.getString(KEY);

  const data = raw ? JSON.parse(raw) : {};

  // assicura che playlists esista
  data.playlists = data.playlists || [];

  // controlla se favourites esiste
  const hasFavourites = data.playlists.some((p) => p.id === "favourites");

  // creala automaticamente
  if (!hasFavourites) {
    data.playlists.push({
      id: "favourites",
      name: "Favourites",
      createdAt: Date.now(),
      songs: [],
      fixed: true, // opzionale
    });

    saveData(data);
  }

  return data;
};
export const saveData = (data) => {
  storage.set(KEY, JSON.stringify(data));
};

export const createPlaylist = (name) => {
  const data = getData();

  const newPlaylist = {
    id: Date.now().toString(),
    name,
    createdAt: Date.now(),
    songs: [],
  };

  data.playlists.push(newPlaylist);
  saveData(data);

  return newPlaylist;
};

export const addSongToPlaylist = (playlistId, song) => {
  const data = getData();

  const playlist = data.playlists.find(
    (p) => p.id === playlistId
  );
  
  if (!playlist) return;

  playlist.songs = playlist.songs || [];

  const alreadyExists = playlist.songs.some(
    (oldSong) => oldSong.id === song.id
  );

  if (alreadyExists) return;
  console.log("ADDED")
  playlist.songs.push(song);

  saveData(data);
};

export const removeSong = (playlistId, songId) => {
  const data = getData();

  const playlist = data.playlists.find((p) => p.id === playlistId);
  if (!playlist) return;

  playlist.songs = playlist.songs.filter((s) => s.id !== songId);

  saveData(data);
};


export const deletePlaylist = (playlistId) => {
  const data = getData();

  data.playlists = data.playlists.filter((p) => p.id !== playlistId);

  saveData(data);
};


export const clearPlaylist = (playlistId) => {
  const data = getData();

  const playlist = data.playlists.find(
    p => p.id === playlistId
  );

  if (!playlist) return;

  playlist.songs = [];

  saveData(data);
};

export const sincPlaylists = (playlists) => {
  const data = {
    playlists,
  };

  storage.set(KEY, JSON.stringify(data));
};