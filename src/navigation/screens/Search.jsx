import { TextInput, StyleSheet, View, FlatList, Text } from "react-native";
import { useState, useContext, useMemo, useCallback } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import debounce from "lodash.debounce";
import { PlayerContext } from "../../context/PlayerContext";
import TrackItem from "..//../components/TrackItem";
import Player from "../../components/Player";


export function Search() {
  const [value, setValue] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const { handle_single_play, addToQueue, BASE_URL,player , setPlayerVisibility} =
    useContext(PlayerContext);

  function useSearch() {
    const [results, setResults] = useState([]);
    const search = useMemo(
      () =>
        debounce(async (query) => {
          const params = new URLSearchParams({
            q: query,
          });

          const res = await fetch(`${BASE_URL}/search?${params}`);

          if (!res.ok) throw new Error(`Errore server: ${res.status}`);

          const data = await res.json();
          setResults(data);
        }, 300),
      [],
    );
    return { results, search };
  }
  const { results, search } = useSearch();

  const show = () => {
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 1500);
  };

  let finresults = results.entries || [];

  return (
    <View style={styles.container}>
      {showPopup && (
        <View style={styles.popup}>
          <Text style={{ color: "black" }}>Add to queue</Text>
        </View>
      )}
      <View style={styles.searchBar}>
        <Ionicons
          name="search"
          color={"white"}
          size={23}
          style={{ paddingLeft: 10, paddingRight: 20 }}
        />
        <TextInput
          value={value}
          style={{ flex: 1, outline: "none", fontSize: 17, color: "white" }}
          onChangeText={(text) => {
            search(text);
            setValue(text);
          }}
          placeholder="What do you want to listen to?"
          placeholderTextColor="gray"
        />
      </View>
      <FlatList
        scrollEnabled={true}
        nestedScrollEnabled={true}
        data={finresults}
        keyExtractor={(item, index) => item.id?.toString() || index.toString()}
        renderItem={({ item }) => (
          <TrackItem
            showPopup={show}
            item={item}
            addToQueue={addToQueue}
            handle_single_play={handle_single_play}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    gap: 10,
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
  searchBar: {
    flexDirection: "row",
    backgroundColor: "#313131",

    paddingLeft: 15,
     
    fontSize: 12,
    color: "grey",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
  },
});
