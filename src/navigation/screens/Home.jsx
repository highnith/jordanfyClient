import { Text } from "@react-navigation/elements";
import { StyleSheet, View, FlatList, Pressable } from "react-native";

export function Home() {
  let playlists = [{ id: 1, name: "your daily" },{id:2}];
  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>Welcome back Jordan</Text>
      <Text style={styles.intro}>
        Having a good day? Here some playlist you may like
      </Text>
      <FlatList
        data={playlists} // ← array di dati
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={{
         alignItems: "flex-start",
          paddingHorizontal: 10,
        }}
        renderItem={(
          { item },
        ) => <Pressable style={styles.playlist}><Text>{item.name}</Text></Pressable>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "green",
    paddingTop: 50,
    padding: 10,
    flex: 1,
    gap: 10,
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
    flex: 0.5,
  backgroundColor: "black",
  margin: 5,
  height: 120,
  borderRadius: 10,
  },
});
