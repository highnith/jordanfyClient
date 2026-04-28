import { useContext, useEffect, useCallback } from "react";
import { useNavigation } from "@react-navigation/native";
import { StyleSheet, View, Text, Image, Pressable } from "react-native";
import { PlayerContext } from "../../context/PlayerContext";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Ionicons from "@expo/vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import Feather from "@expo/vector-icons/Feather";

import Animated, {
  useSharedValue,
  withTiming,
  withSpring,
  useAnimatedStyle,
  runOnJS,
} from "react-native-reanimated";

export function TrackScreen() {
  const {
    player,
    playerStatus,
    trackScreenActive,
    setTrackScreenActive,
    track,
    moveBackward,
    moveForward,
  } = useContext(PlayerContext);
  if (!track) return;

  useEffect(() => {
    setTrackScreenActive(true);
    return () => setTrackScreenActive(false);
  }, []);

  const iconsSize = 40;

  const progress = useSharedValue(0);
  useEffect(() => {
    if (!playerStatus.duration) {
    progress.value = 0;
    return;
  }
    progress.value = playerStatus.currentTime / playerStatus.duration;
  }, [playerStatus.currentTime, playerStatus.duration]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }));

  const navigation = useNavigation();

  return (
    <LinearGradient
      style={styles.container}
      colors={["white", "grey", "#000000"]}
    >
      <Pressable onPress={() => navigation.goBack()}>
        <Feather name="chevron-down" size={34} color="grey" />
      </Pressable>

      <Image
        style={styles.cover}
        source={{ uri: `https://i.ytimg.com/vi/${track.id}/hqdefault.jpg` }}
      />
      <View style={styles.info}>
        <Text
          style={{
            fontSize: 20,
            textAlign: "left",
            color: "white",
            fontWeight: "bold",
          }}
        >
          {track.title}
        </Text>
        <Text
          style={{
            fontSize: 15,
            textAlign: "left",
            color: "#c0c0c0",
            fontWeight: "bold",
          }}
        >
          {track.channel}
        </Text>
      </View>
      <View style={styles.barBackground}>
        <Animated.View style={[styles.barFill, animatedStyle]} />
      </View>
      <View style={styles.controls}>
        <Pressable style={styles.controlsButton} onPress={() => moveBackward()}>
          <Ionicons name="play-skip-back" size={iconsSize} color="white" />
        </Pressable>

        <Pressable
          style={styles.playButton}
          onPress={() =>
            playerStatus.playing ? player.pause() : player.play()
          }
        >
          {player.paused ? (
            <FontAwesome5 name="play" size={iconsSize} color="white" />
          ) : (
            <FontAwesome5 name="pause" size={iconsSize} color="white" />
          )}
        </Pressable>
        <Pressable style={styles.controlsButton} onPress={() => moveForward()}>
          <Ionicons name="play-skip-forward" size={iconsSize} color="white" />
        </Pressable>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingTop: 50,
    padding: 10,
    flex: 1,
    gap: 10,
  },
  cover: {
    width: "80%",
    height: "40%",
    borderRadius: 20,
  },
  info: {
    marginTop: 60,
    width: "80%",
  },
  controls: {
    flexDirection: "row",
    marginTop: 30,
  },
  controlsButton: {
    paddingLeft: 50,
    paddingRight: 50,
  },
  playButton: {
    paddingLeft: 50,
    paddingRight: 50,
  },
  barBackground: {
    width: "80%",
    height: 4,
    backgroundColor: "#33333348",
    borderRadius: 4,
    overflow: "hidden",
    marginTop: 30,
  },

  barFill: {
    height: "100%",
    backgroundColor: "white",
  },
});
