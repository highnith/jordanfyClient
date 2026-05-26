import { StyleSheet, View, Pressable, Image, Text } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  withTiming,
  withSpring,
  useAnimatedStyle,
  runOnJS,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useContext } from "react";
import { PlayerContext } from "../context/PlayerContext";
import TrackPlayer,{RepeatMode} from "'@rntp/player'";

export default function SongForSuggested({
  item,
  location = "favourites",
  locationName = "Favourites",
  parent,
  handlePlayFrom,
}) {
  const { BASE_URL, showQueuePopup, createRNTPobject, Storage } =
    useContext(PlayerContext);
  const position = useSharedValue(0);
  const roundBorder = useSharedValue(0);
  const THRESHOLD = 100;
  const MAX_SWIPE = 130;

  const handleRemoveSong = (track) => {
    const song = createRNTPobject(search(track.name))
    Storage.removeASong(location, song.mediaId);
  };
  const handleAddToQueue = async (track) => {
    const song = createRNTPobject(search(track.name))
    TrackPlayer.addMediaItem([createRNTPobject(song)]);
  };

  const search = async (query) => {
    const params = new URLSearchParams({
            q: query,
            limit:1 
          });

          const res = await fetch(`${BASE_URL}/search?${params}`);

          if (!res.ok) throw new Error(`Errore server: ${res.status}`);

          const data = await res.json();
        
          return data.entries[0];
  }

  const handleClick = async () => {
    const song = await createRNTPobject(await search(item.name))
    
    if (null) {
      handlePlayFrom(item);
    } else {
      await TrackPlayer.reset();
      await TrackPlayer.setMediaItem(createRNTPobject(song));
      await TrackPlayer.play();
    }
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
        runOnJS(handleAddToQueue)(item);
        runOnJS(showQueuePopup)("Added to queue");
      } else if (e.translationX < -THRESHOLD) {
        runOnJS(showQueuePopup)(`removed from ${locationName}`);
        runOnJS(handleRemoveSong)(item);
      }
      roundBorder.value = withSpring(0);
      position.value = withTiming(0, { duration: 200 });
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: position.value }],
    zIndex: 2,
    overflow: "hidden",
    borderRadius: roundBorder.value,
    backgroundColor: "#161A16",
    width: "100%",
  }));

  return (
    <GestureDetector gesture={panGesture}>
      <View style={styles.container}>
        <Animated.View style={animatedStyle}>
          <Pressable style={styles.song} onPress={() => handleClick()}>
            <View style={styles.thumbnail}>
              <Image
                source={{
                  uri: `https://i.ytimg.com/vi/${item.mediaId}/hqdefault.jpg`,
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
                {item.name}
              </Text>
              <Text
                style={styles.song_author}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {item.artist.name}
              </Text>
            </View>
          </Pressable>
        </Animated.View>
        <View
          style={{
            width: "50%",
            backgroundColor: "green",
            position: "absolute",
            left: 0,
            zIndex: 1,
            height: "100%",
          }}
        >
          <View style={styles.queueIconAdd}>
            <MaterialIcons name="queue-music" size={50} color="white" />
          </View>
        </View>
        <View
          style={{
            width: "50%",
            backgroundColor: "red",
            position: "absolute",
            right: 0,
            zIndex: 1,
            height: "100%",
          }}
        >
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
    height: "100%",
    position: "absolute",
    left: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  queueIconRemove: {
    height: "100%",
    position: "absolute",
    right: 50,
    alignItems: "center",
    justifyContent: "center",
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
    minWidth: 0, 
    paddingRight: 10,
  },
});
