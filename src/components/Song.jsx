import { StyleSheet, View, Pressable, Image, Text } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  withTiming,
  withSpring,
  useAnimatedStyle,
  runOnJS,
} from "react-native-reanimated";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useContext } from "react";
import { PlayerContext } from "../context/PlayerContext";

export default function Song({ item }) {
  const { addToQueue, showQueuePopup, handle_single_play, removeSong } =
    useContext(PlayerContext);
  const position = useSharedValue(0);
  const roundBorder = useSharedValue(0);
  const THRESHOLD = 100;
  const MAX_SWIPE = 130;

  const handleRemoveSong = (track) => {
    removeSong("favourites", track.id);
  };

  const panGesture = Gesture.Pan()
    .activeOffsetX([-20, 20])
    .failOffsetY([-15, 15])
    .shouldCancelWhenOutside(true)
    .onUpdate((e) => {
      if (e.translationX > 0) {
        roundBorder.value = withSpring(10);
        if (e.translationX <= MAX_SWIPE) {
          position.value = e.translationX;
        } else {
          const overflow = e.translationX - MAX_SWIPE;
          position.value = MAX_SWIPE + overflow * 0.2;
        }
      } else if (e.translationX < 0) {
        roundBorder.value = withSpring(10);
        if (Math.abs(e.translationX) <= MAX_SWIPE) {
          position.value = e.translationX;
        } else {
          const overflow = Math.abs(e.translationX) - MAX_SWIPE;
          position.value = -(MAX_SWIPE + overflow * 0.2);
        }
      }
    })
    .onEnd((e) => {
      if (e.translationX > THRESHOLD) {
        runOnJS(addToQueue)(item);
        runOnJS(showQueuePopup)("Added to queue");
      } else if (e.translationX < -THRESHOLD) {
        runOnJS(showQueuePopup)("Removed from favourites");
        runOnJS(handleRemoveSong)(item);
      }
      roundBorder.value = withSpring(0);
      position.value = withTiming(0, { duration: 200 });
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: position.value }],
    zIndex: 2,
    overflow: "hidden",
    backgroundColor: "black",
    borderRadius: roundBorder.value,
    width: "100%",
  }));

  return (
    <GestureDetector gesture={panGesture}>
      <View style={styles.container}>
        <Animated.View style={animatedStyle}>
          <Pressable
            style={styles.song}
            onPress={() => handle_single_play(item)}
          >
            <View style={styles.thumbnail}>
              <Image
                source={{
                  uri: `https://i.ytimg.com/vi/${item.id}/hqdefault.jpg`,
                }}
                style={styles.song_image}
              />
            </View>
            <View style={styles.textContainer}>
              <Text
                style={styles.song_title}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {item.title}
              </Text>
              <Text
                style={styles.song_author}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {item.channel}
              </Text>
            </View>
          </Pressable>
        </Animated.View>
        <View style={{ width: "50%", backgroundColor: "green",position: "absolute", left: 0,zIndex:1,height:"100%"}}>
          <View style={styles.queueIconAdd}>
            <MaterialIcons name="queue-music" size={50} color="white" />
          </View>
        </View>
        <View style={{ width: "50%", backgroundColor: "red" ,position: "absolute",right: 0,zIndex:1,height:"100%"}}>
          <View style={styles.queueIconRemove}>
            <MaterialIcons name="delete-forever" size={50} color="white" />
          </View>
        </View>
      </View>
    </GestureDetector>
  );
}
const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
     flexDirection: "row",

    width: "100%",
  },
  queueIconAdd: {
    height:"100%",
    position: "absolute",
    left: 50,
    alignItems: "center",
    justifyContent:"center"
  },
  queueIconRemove: {
    height:"100%",
    position: "absolute",
    right: 50,
    alignItems: "center",
    justifyContent:"center"
  },
  song_image: {
    borderRadius: 13,
    height: 60,
    width: 60,
  },

  song: {
    height: 70,
    flexDirection: "row",
    alignItems: "center",
  },
  song_title: {
    paddingTop: 3,
    color: "white",
    fontSize: 17,
    fontWeight: "400",
  },
  song_author: {
    color: "#dcdcdc",
    fontSize: 15,
  },
  thumbnail: {
    padding: 13,
  },
  box: { backgroundColor: "green" },
  textContainer: {
    flex: 1,
    minWidth: 0, // 👈 FONDAMENTALE
    paddingRight: 10,
  },
});
