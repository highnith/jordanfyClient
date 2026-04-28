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

export default function TrackItem({
  item,
  addToQueue,
  handle_single_play,
  showPopup,
}) {
  const position = useSharedValue(0);
  const roundBorder = useSharedValue(0)
  const THRESHOLD = 100;
  const MAX_SWIPE = 130;

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
      }
    })
    .onEnd((e) => {
      if (e.translationX > THRESHOLD) {
        runOnJS(addToQueue)(item);
        runOnJS(showPopup)();
      }
      roundBorder.value = withSpring(0);
      position.value = withTiming(0, { duration: 200 });
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: position.value }],
    zIndex: 2,
    backgroundColor: "black",
    borderRadius: roundBorder.value,
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
            <View>
              <Text style={styles.song_title}>{item.title}</Text>
              <Text style={styles.song_author}>{item.channel}</Text>
            </View>
          </Pressable>
        </Animated.View>
        <View style={styles.queueIcon}>
          <MaterialIcons name="queue-music" size={50} color="white" />
        </View>
      </View>
    </GestureDetector>
  );
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: "green",
    justifyContent: "center",
  },
  queueIcon: {
    position: "absolute",
    left: 50,
    alignItems: "center",
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
});
