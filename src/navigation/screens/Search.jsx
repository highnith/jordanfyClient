import { TextInput, StyleSheet, View, FlatList, Text } from "react-native";
import { useState, useContext, useMemo, useCallback } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import debounce from "lodash.debounce";
import { PlayerContext } from "../../context/PlayerContext";
import Song from "..//../components/Song";
import QueuePopup from "..//../components/QueuePopup";



export function Search() {
  const [value, setValue] = useState("");
  const [setShowPopup] = useState(false);
  const { BASE_URL, createRNTPobject} =
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
  
  const finresults = Array.isArray(results?.entries)
  ? results.entries
  : [];

  const finalresults = finresults.map((item) => createRNTPobject(item))
  return (
    <View style={styles.container}>
      
      <QueuePopup/>
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
        data={finalresults}
        keyExtractor={(item, index) => item.id?.toString() || index.toString()}
        renderItem={({ item }) => (
          <Song
            item={item}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#161A16",
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
