import { Button, Text } from "@react-navigation/elements";
import { StyleSheet, View, FlatList, Pressable } from "react-native";
import { useContext, useState, useEffect, useCallback } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { PlayerContext } from "../../context/PlayerContext";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export function Library() {
  const navigation = useNavigation();
  const { Storage } = useContext(PlayerContext);
  const playlists = Storage.getPlaylistData()

  return (
    <LinearGradient style={styles.container} colors={["#161A16", "#000000"]}>
      <Text
        style={{
          color: "white",
          fontSize: 40,
          fontWeight: "bold",
          padding: 15,
        }}
      >
        Your Library
      </Text>
      <Pressable
        style={styles.newLibrary}
        onPress={() => navigation.navigate("NewPlaylist")}
      >
        <Text
          style={{
            color: "#161A16",
            fontSize: 20,
            fontWeight: "bold",
            padding: 10,
            textAlign:"center",
          }}
        >
          Add a new playlist
        </Text>
        <AntDesign name="plus" size={28} color="#161A16" />
      </Pressable>
      <FlatList
        scrollEnabled={true}
        nestedScrollEnabled={true}
        data={playlists}
        keyExtractor={(item, index) => item.id?.toString() || index.toString()}
        renderItem={({ item }) => (
          <View style={styles.playlist}>
            <Pressable
              style={styles.goToPlaylist}
              onPress={() =>
                navigation.navigate("Playlist", {
                  playlistId: item.id,
                })
              }
            >
              <Text style={styles.albumTitle}>{item.name}</Text>
            </Pressable>

            <Pressable
              style={styles.binIcon}
              onPress={() => Storage.deleteAPlaylist(item.id)}
            >
              <MaterialIcons name="delete" size={35} color="#374037" />
            </Pressable>
          </View>
        )}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 30,
    flex: 1,
  },
  playlist: {
    flexDirection: "row",
    padding: 10,
    marginLeft: 10,
    marginRight: 10,
    borderRadius: 25,
    height: 60,
    backgroundColor: "#161A16",
    margin: 5,
    paddingLeft: 20,
    alignItems: "center",
    justifyContent: "space-between",
  },
  albumTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  newLibrary: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10,
    backgroundColor: "white",
    borderRadius: 15,
    width: 220,
    textAlign: "center",
    margin: 20,
  },
  binIcon: {
    right: 10,
  },
 goToPlaylist:{
    flex:1
  }
});
