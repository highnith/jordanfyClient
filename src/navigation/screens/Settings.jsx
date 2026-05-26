import { Text } from "@react-navigation/elements";
import { StyleSheet, View, TextInput, Pressable } from "react-native";
import { useContext, useState } from "react";
import { PlayerContext } from "../../context/PlayerContext";

export function Settings() {
  const [value, setValue] = useState();
  const { BASE_URL, SET_BASE_URL } = useContext(PlayerContext);
  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 30, fontWeight: "bold" }}>Server Url</Text>
      <Text style={styles.texts}>{BASE_URL}</Text>
      <TextInput
        value={value}
        style={{
          outline: "none",
          fontSize: 17,
          color: "#161A16",
          borderWidth: 1,
          padding: 15,
          borderColor: "gray",
        }}
        onChangeText={(text) => {
          setValue(text);
        }}
        placeholder="Insert new server url"
        placeholderTextColor="gray"
      />
      <Pressable
        style={styles.applyButton}
        onPress={() => {
          if (value) {
            SET_BASE_URL(value);
          }
        }}
      >
        <Text style={{ fontSize: 25, color: "white", fontWeight: "bold" }}>
          Apply
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 20,
    padding: 20,
  },
  texts: {
    fontSize: 20,
  },
  applyButton: {
    alignItems: "center",
    backgroundColor: "green",
    padding: 15,
  },
});
