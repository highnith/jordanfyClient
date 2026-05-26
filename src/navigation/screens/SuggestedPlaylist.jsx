import { useRoute } from "@react-navigation/native";
import { StyleSheet, View, FlatList, Pressable, Text } from "react-native";
import { useContext, useEffect, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { PlayerContext } from "../../context/PlayerContext";
import { useNavigation } from "@react-navigation/native";
import Song from "..//../components/Song";
import QueuePopup from "..//../components/QueuePopup";
import Ionicons from "@expo/vector-icons/Ionicons";
import TrackPlayer, { RepeatMode } from '@rntp/player';

export function SuggestedPlaylist() {
  const navigation = useNavigation();
  const route = useRoute();
  const [songs,setSongs] = useState();
  const { playlistId } = route.params;

  const { suggested, handleRepeatMode, createRNTPobject, BASE_URL, Storage } = useContext(PlayerContext);
  const playlist = suggested.find((p) => p.id === playlistId);
  const rawSongs = playlist?.entries || [];

  const singleSearch = async (query) => {
    const params = new URLSearchParams({
      q: query,
      limit: 1,
    });
    if (!query) return;
    const res = await fetch(`${BASE_URL}/search?${params}`);

    if (!res.ok) throw new Error(`Errore server: ${res.status}`);

    const data = await res.json();
    return data.entries[0];
    
  };

  useEffect(() => {
  const load = async () => {
    const results = [];
    const batchSize = 3;

    const songsCached = Storage.getRNTPobjectscache();

    for (let i = 0; i < rawSongs.length; i += batchSize) {
      const batch = rawSongs.slice(i, i + batchSize);

      const batchResults = await Promise.all(
        batch.map(async (item) => {

          // Cerca nella cache
          const cachedSong = songsCached.find(
            song => song.lastfmurl === item.url
          );

          if (cachedSong) {
            return cachedSong;
          }

          // Ricerca online
          const song = await singleSearch(item.name + " " + item.artist.name);

          if (!song) return null;

          const newSong = createRNTPobject(song);
          newSong.lastfmurl = item.url;

          return newSong;
        })
      );

      const validResults = batchResults.filter(Boolean);

      results.push(...validResults);

      // aggiorna UI progressivamente
      setSongs([...results]);

      // salva cache
      Storage.saveRNTPobjectscache(validResults);
    }
  };

  load();
}, []);

  const handlePlayPlaylist = () => {
    TrackPlayer.setMediaItems(songs);
    TrackPlayer.play();
    handleRepeatMode(RepeatMode.All);
  };

  const handlePlayFrom = (item) => {
    let index = songs.findIndex((track) => track.id == item.id);
    TrackPlayer.setMediaItems(songs);
    TrackPlayer.skipToIndex(index);
    TrackPlayer.play();
    handleRepeatMode(RepeatMode.All);
  };

  return (
    <LinearGradient style={styles.container} colors={["#161A16", "#000000"]}>
      <QueuePopup />
      <View style={styles.header}>
        <Pressable style={styles.backIcon} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back-sharp" size={30} color="white" />
        </Pressable>
        <Text
          style={{
            color: "white",
            fontSize: 30,
            fontWeight: "500",
            padding: 10,
          }}
        >
          {playlist.name}
        </Text>
      </View>
      {songs && (
        <View style={styles.reproducePlaylistView}>
          <Pressable
            style={styles.reproducePlaylistButton}
            onPress={() => handlePlayPlaylist()}
          >
            <Text style={styles.reproducePlaylistText}>Reproduce Playlist</Text>
          </Pressable>
        </View>
      )}
      {songs && (
        <FlatList
          scrollEnabled={true}
          nestedScrollEnabled={true}
          data={songs}
          keyExtractor={(item, index) =>
            item.id?.toString() || index.toString()
          }
          renderItem={({ item }) => (
            <Song
              item={item}
              location={playlistId}
              locationName={playlist.name}
              handlePlayFrom={handlePlayFrom}
            />
          )}
        />
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 30,
  },
  backIcon: {
    padding: 5,
    marginLeft: 10,
  },
  reproducePlaylistView: {
    alignItems: "flex-start",
  },
  reproducePlaylistButton: {
    padding: 16,
    backgroundColor: "white",
    borderRadius: 20,
    margin: 15,
  },
  reproducePlaylistText: {
    fontSize: 20,
    color: "black",
    fontWeight: "bold",
  },
});
