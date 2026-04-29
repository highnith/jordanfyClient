import { useContext, useEffect, useState, useRef } from "react";
import { useNavigation } from "@react-navigation/native";
import { StyleSheet, View, Text, Image, Pressable } from "react-native";
import { PlayerContext } from "../../context/PlayerContext";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { LinearGradient } from "expo-linear-gradient";
import Feather from "@expo/vector-icons/Feather";
import { Gesture, GestureDetector } from "react-native-gesture-handler";

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
    addSongToPlaylist,
  } = useContext(PlayerContext);
  if (!track) return;

  const [width, setWidth] = useState(0);
  const [addedToPlaylist, setAddedToPlaylist] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const show = () => {
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 1500);
  };

  useEffect(() => {
    setAddedToPlaylist(false);
  }, [track]);

  useEffect(() => {
    setTrackScreenActive(true);
    return () => setTrackScreenActive(false);
  }, []);

  const iconsSize = 40;

  const progress = useSharedValue(0);

  const playTrack = () => {
    player.play();
  };

  const pauseTrack = () => {
    player.pause();
  };

  const seekTrack = (time) => {
    player.seekTo(time);
  };

  const panGesture = Gesture.Pan()
    .onBegin(() => {
      runOnJS(pauseTrack)();
    })
    .onUpdate((e) => {
      progress.value = e.x / width;
    })
    .onEnd(() => {
      runOnJS(seekTrack)(Math.floor(playerStatus.duration * progress.value));
      runOnJS(playTrack)();
    });

  useEffect(() => {
    if (!playerStatus.duration) {
      progress.value = 0;
      return;
    }
    if (
      Math.abs(
        progress.value - playerStatus.currentTime / playerStatus.duration,
      ) > 0.05 &&
      playerStatus.currentTime != 0
    )
      return;
    progress.value = playerStatus.currentTime / playerStatus.duration;
  }, [playerStatus.currentTime, playerStatus.duration]);

  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);

    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }
  const animatedStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }));

  const navigation = useNavigation();

  const addToFavourites = (track) => {
    addSongToPlaylist("favourites", track);
  };

  return (
    <LinearGradient
      style={styles.container}
      colors={["white", "grey", "#000000"]}
    >
      {showPopup && (
              <View style={styles.popup}>
                <Text style={{ color: "black" }}>Add to favourites</Text>
              </View>
            )}
      <Pressable onPress={() => navigation.goBack()}>
        <Feather name="chevron-down" size={34} color="grey" />
      </Pressable>

      <Image
        style={styles.cover}
        source={{ uri: `https://i.ytimg.com/vi/${track.id}/hqdefault.jpg` }}
      />
      <View style={styles.mid}>
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
        <Pressable
          style={styles.addPlaylistIcon}
          onPress={() => {
            setAddedToPlaylist(true);
            addToFavourites(track);
            show();
          }}
        >
          {addedToPlaylist ? (
            <Ionicons name="checkbox" size={iconsSize} color="#0BDA51" />
          ) : (
            <MaterialIcons
              name="my-library-add"
              size={iconsSize}
              color="white"
            />
          )}
        </Pressable>
      </View>
      <GestureDetector gesture={panGesture}>
        <View style={styles.statusBar}>
          <View
            style={styles.barBackground}
            onLayout={(e) => {
              setWidth(e.nativeEvent.layout.width);
            }}
          >
            <Animated.View style={[styles.barFill, animatedStyle]} />
          </View>
        </View>
      </GestureDetector>
      <View style={styles.songTime}>
        <Text
          style={{
            fontSize: 15,
            textAlign: "left",
            color: "#c0c0c0",
            fontWeight: "bold",
            width: "50%",
          }}
        >
          {formatTime(playerStatus.currentTime)}
        </Text>
        <Text
          style={{
            fontSize: 15,
            textAlign: "right",
            color: "#c0c0c0",
            fontWeight: "bold",
            width: "50%",
          }}
        >
          {formatTime(playerStatus.duration)}
        </Text>
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
    gap: 5,
  },
  mid: {
    marginTop: 40,
    flexDirection: "row",
    width: "80%",
  },
  popup: {
    position: "absolute",
    bottom: 180,
    left:20,
    right: 20,
    alignSelf: "center",
    backgroundColor: "white",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    zIndex: 999,
  },
  addPlaylistIcon: {
    width: "20%",
    alignItems: "center",
    justifyContent: "center",
  },
  statusBar: {
    width: "80%",
    justifyContent: "center",
    alignItems: "center",
    height: 20,
  },
  songTime: {
    flexDirection: "row",
    width: "80%",
  },
  cover: {
    width: "80%",
    height: "40%",
    borderRadius: 20,
  },
  info: {
    marginBottom: 20,
    width: "80%",
  },
  controls: {
    flexDirection: "row",
    marginTop: 20,
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
    width: "100%",
    height: 4,
    backgroundColor: "#33333348",
    borderRadius: 4,
    overflow: "hidden",
  },

  barFill: {
    height: "100%",
    backgroundColor: "white",
  },
});
