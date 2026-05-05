import { Button, Text } from "@react-navigation/elements";
import { TextInput, StyleSheet, View, FlatList, Pressable } from "react-native";
import { useContext, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { PlayerContext } from "../../context/PlayerContext";
import { useNavigation } from "@react-navigation/native";
import AntDesign from "@expo/vector-icons/AntDesign";

export function NewPlaylist() {
  const navigation = useNavigation();
  const { Storage } = useContext(PlayerContext);
  const [value, setValue] = useState();

  return (
    <LinearGradient style={styles.container} colors={["green", "#000000"]}>
      <Text
        style={{ color: "white", fontSize: 30, fontWeight: "bold", padding: 10 }}
      >
        Give your playlist a name
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Your new Playlist"
        placeholderTextColor="white"
        value={value}
        onChangeText={(text) => setValue(text)}
      ></TextInput>
      <View style={styles.buttonContainer}>
        <Pressable
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={{ fontSize: 20, color: "white", fontWeight: "bold" }}>
            Cancel
          </Text>
        </Pressable>
        <Pressable
          style={styles.createButton}
          onPress={() => {
            if (value) {
              Storage.createNewPlaylist(value);
            }
            navigation.goBack();
          }}
        >
          <Text style={{ fontSize: 20, color: "black", fontWeight: "bold" }}>
            Create
          </Text>
        </Pressable>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 30,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    fontSize: 20,
    color: "white",
    fontWeight: "bold",
  },
  buttonContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  cancelButton: {
    borderColor: "grey",
    borderRadius: 28,
    borderWidth: 2,
    justifyContent: "center",
    marginRight: 20,
    padding: 25,
    paddingVertical: 15,
  },
  createButton: {
    backgroundColor: "#36C236",
    borderRadius: 28,
    justifyContent: "center",
    marginLeft: 20,
    padding: 25,
    paddingVertical: 15,
  },
});
