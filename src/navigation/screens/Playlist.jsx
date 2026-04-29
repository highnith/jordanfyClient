import { useRoute } from "@react-navigation/native";
import { StyleSheet, View, FlatList, Pressable, Text } from "react-native";
import { useContext } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { PlayerContext } from "../../context/PlayerContext";
import { useNavigation } from "@react-navigation/native";
import Song from "..//../components/Song";
import QueuePopup from "..//../components/QueuePopup";
import Ionicons from "@expo/vector-icons/Ionicons";

export function Playlist() {
  const navigation = useNavigation();
  const route = useRoute();

  const { playlistId } = route.params;

  const { getData } = useContext(PlayerContext);
  const playlists = getData().playlists;
  const playlist = playlists.find((p) => p.id === playlistId);
  const songs = playlist.songs;
  return (
    <LinearGradient style={styles.container} colors={["#355E3B", "#000000"]}>
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
      <FlatList
        scrollEnabled={true}
        nestedScrollEnabled={true}
        data={songs}
        keyExtractor={(item, index) => item.id?.toString() || index.toString()}
        renderItem={({ item }) => <Song item={item} />}
      />
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
});
