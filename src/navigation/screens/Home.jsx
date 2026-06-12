import { Text } from "@react-navigation/elements";
import { StyleSheet, View, FlatList, Pressable, Image } from "react-native";
import { LastFM } from "../../components/lastFMAPI";
import { useEffect, useState, useContext } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { PlayerContext } from "../../context/PlayerContext";
import { useNavigation } from "@react-navigation/native";
import Feather from '@expo/vector-icons/Feather';


export function Home() {
  const { suggested } = useContext(PlayerContext);

  
  const navigation = useNavigation();
  return (
    <LinearGradient style={styles.container} colors={["#161A16", "#000000"]}>
      <Pressable style={styles.menu} onPress={() =>
              navigation.navigate("Settings")
            }>
        <Feather name="menu" size={24} color="white" />
      </Pressable>
      <Text style={styles.welcome}>Welcome back Jordan</Text>
      <Text style={styles.intro}>
        Having a good day? Here some playlist you may like
      </Text>
      <FlatList
        data={suggested}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={{
          alignItems: "flex-start",
          paddingHorizontal: 10,
        }}
        renderItem={({ item }) => (
          <Pressable
            style={styles.playlist}
            onPress={() =>
              navigation.navigate("SuggestedPlaylist", {
                playlistId: item.id,
              })
            }
          >
          <Image style={styles.playlistImage} source={item.image} />

          </Pressable>
        )}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
    padding: 10,
    flex: 1,
    gap: 10,
  },
  playlistImage: {
    width: "100%",
    height: "100%",
    borderRadius: 20,
  },
  welcome: {
    fontSize: 50,
    color: "white",
    fontWeight: 800,
    fontStyle: "italic",
    margin: 10,
  },
  intro: {
    fontSize: 25,
    color: "white",
    fontWeight: 800,
    fontFamily: "",
    margin: 10,
  },
  playlist: {
    width: 170,
    height: 170,
    margin: 5,
    height: 120,
    borderRadius: 10,
  },
});