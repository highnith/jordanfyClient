import { Button, Text } from "@react-navigation/elements";
import { StyleSheet, View, FlatList, Pressable } from "react-native";
import { useContext } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { PlayerContext } from "../../context/PlayerContext";
import { useNavigation } from "@react-navigation/native";

export function Library() {
  const navigation = useNavigation();
  const { getData } = useContext(PlayerContext);
  const playlists = getData().playlists;
  return (
    <LinearGradient style={styles.container} colors={["#355E3B", "#000000"]}>
      <Text
        style={{ color: "white", fontSize: 30, fontWeight: "500", padding: 10 }}
      >
        Your Library
      </Text>
      <FlatList
        scrollEnabled={true}
        nestedScrollEnabled={true}
        data={playlists}
        keyExtractor={(item, index) => item.id?.toString() || index.toString()}
        renderItem={({ item }) => (
          <Pressable
            style={styles.playlist}
            onPress={() =>
              navigation.navigate("Playlist", {
                playlistId: "favourites",
              })
            }
          >
            <Text style={styles.albumTitle}>{item.name}</Text>
          </Pressable>
        )}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop:30,
    flex: 1,
  },
  playlist: {
    padding: 10,
    marginLeft: 10,
    marginRight: 10,
    borderRadius: 10,
    height: 70,
  },
  albumTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
});
