import { StyleSheet, View, Pressable, Image, Text } from "react-native";
import { useContext } from "react";
import { PlayerContext } from "../context/PlayerContext";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { navigate } from "./navigationRef";
import { LinearGradient } from "expo-linear-gradient";
import TrackPlayer, { State,} from "react-native-track-player";

export default function Player() {
  const {
    trackScreenActive,
    playerVisibility,
    setPlayerVisibility,
    playbackState,
    track
  } = useContext(PlayerContext);
  if (!track) return null;
  if (!playerVisibility || trackScreenActive ) return null;
  return (
    <LinearGradient colors={[ "#006400", "green"]} style={styles.playerContainer}>
      <Image style={styles.cover} source={{ uri: `https://i.ytimg.com/vi/${track.id}/hqdefault.jpg` }} />
      <Pressable style={styles.info} onPress={() => navigate("TrackScreen")}>
        <Text style={styles.title}>{track.title}</Text>
        <Text style={styles.subtitle}>{track.artist}</Text>
      </Pressable>
      <View style={styles.controls}>
        <Pressable style={styles.playButton} onPress={() => (playbackState.state === State.Playing? TrackPlayer.pause() : TrackPlayer.play())}>
          {playbackState.state === State.Paused? <FontAwesome5 name="play" size={24} color="white" /> : <FontAwesome5 name="pause" size={24} color="white" />}
        </Pressable><Pressable style={styles.playButton} onPress={() => TrackPlayer.skipToNext()}>
          <MaterialIcons name="skip-next" size={40} color="white" />
        </Pressable>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  playerContainer: {
    position: "absolute",
    bottom:110,
    left:20,
    right: 20,
    borderRadius:10,

    height: 70,
    backgroundColor: "#121212",

    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,

    borderTopWidth: 1,
    borderTopColor: "#2a2a2a",

    elevation: 10, // Android shadow
  },

  cover: {
    width: 50,
    height: 50,
    borderRadius: 6,
    backgroundColor: "#333",
  },

  info: {
    flex: 1,
    marginLeft: 10,
    justifyContent: "center",
  },

  title: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },

  subtitle: {
    color: "#b3b3b3",
    fontSize: 12,
  },

  controls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  playButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
});
