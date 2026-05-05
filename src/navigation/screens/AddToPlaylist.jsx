import { PlayerContext } from "../../context/PlayerContext";
import { useNavigation } from "@react-navigation/native";
import { useContext, useEffect, useState, useRef } from "react";
import { StyleSheet, View, FlatList, Text, Pressable } from "react-native";
import { useRoute } from "@react-navigation/native";

export function AddToPlaylist() {
  const { Storage } = useContext(PlayerContext);
  const [selected, setSelected] = useState([]);
  const route = useRoute();
  const navigation = useNavigation();
  const { song } = route.params;

  const handleAddToPlaylist = () => {
    if (selected.length > 0) {
      for (let i = 0; i < selected.length; i++) {
        Storage.addASongToPlaylist(selected[i], song);
      }
    }
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <View style={styles.choose}>
        <Text style={{ fontSize: 25, color: "white", fontWeight: "bold" }}>
          Choose the playlists you want to add the song to:
        </Text>
      </View>

      <FlatList
        scrollEnabled={true}
        style={{width:"100%"}}
        nestedScrollEnabled={true}
        data={Storage.getPlaylistData()}
        keyExtractor={(item, index) => item.id?.toString() || index.toString()}
        renderItem={({ item }) => (
          <View style={styles.playlist}>
            <Pressable
              style={selected.includes(item.id) ? styles.check : styles.nocheck}
              onPress={() => {
                selected.includes(item.id)
                  ? setSelected(
                      selected.filter((playlist) => playlist !== item.id),
                    )
                  : setSelected([...selected, item.id]);
              }}
            ></Pressable>
            <Text style={styles.albumTitle}>{item.name}</Text>
          </View>
        )}
      />
      <Pressable
        style={styles.confirmButton}
        onPress={() => handleAddToPlaylist()}
      >
        <Text style={{ fontSize: 20, color: "white", fontWeight: "bold" }}>
          Confirm
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 30,
    flex: 1,
    backgroundColor: "#161A16",
    alignItems:"center",
  },
  playlist: {
    flexDirection: "row",
    padding: 10,
    marginLeft: 10,
    marginRight: 10,
    borderRadius: 20,
    height: 60,
    margin: 5,
    paddingLeft: 20,
    alignItems: "center",
    justifyContent: "space-between",
    paddingRight: 20,
  },
  albumTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  check: {
    height: 25,
    width: 25,
    borderRadius: 20,
    backgroundColor: "#36C236",
  },
  nocheck: {
    height: 25,
    width: 25,
    borderRadius: 20,
    borderColor: "grey",
    borderWidth: 1,
  },
  confirmButton: {
    backgroundColor: "#36C236",
    borderRadius: 28,
    justifyContent: "center",
    width:"50%",
    alignItems:"center",
    padding: 25,
    paddingVertical: 15,
    bottom: 150,
  },
  choose: {
    padding: 20,
  },
});
