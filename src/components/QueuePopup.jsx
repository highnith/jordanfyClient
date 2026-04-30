import { useContext } from "react";
import { PlayerContext } from "../context/PlayerContext";
import { StyleSheet, View,  Text } from "react-native";

export default function QueuePopup() {
  const {queuePopup,popupMessage} = useContext(PlayerContext)
  return (
    <>
      {queuePopup && (
        <View style={styles.popup}>
          <Text style={{ color: "black" }}>{popupMessage}</Text>
        </View>
      )}
    </>
  );
}
const styles = StyleSheet.create({
  popup: {
    position: "absolute",
    bottom: 180,
    left: 20,
    right: 20,
    alignSelf: "center",
    backgroundColor: "white",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    zIndex: 999,
  },
});
