import { Assets as NavigationAssets } from "@react-navigation/elements";
import { DarkTheme, DefaultTheme } from "@react-navigation/native";
import { Asset } from "expo-asset";
import { createURL } from "expo-linking";
import * as SplashScreen from "expo-splash-screen";
import * as React from "react";
import { useColorScheme } from "react-native";
import { Navigation } from "./navigation";
import { navigationRef } from "./components/navigationRef";

import Player from "./components/Player";
import { PlayerProvider } from "./context/PlayerContext";
import { GestureHandlerRootView } from "react-native-gesture-handler";


Asset.loadAsync([
  ...NavigationAssets,
  require("./assets/newspaper.png"),
  require("./assets/bell.png"),
]);

SplashScreen.preventAutoHideAsync();
const BASE_URL = "http://10.108.59.223:8000";

const prefix = createURL("/");

export function App() {


  const colorScheme = useColorScheme();

  const theme = colorScheme === "dark" ? DarkTheme : DefaultTheme;

  return (
    <GestureHandlerRootView>
      <PlayerProvider>
        <Navigation
          ref={navigationRef}
          theme={theme}
          linking={{
            enabled: "auto",
            prefixes: [prefix],
          }}
          onReady={() => {
            SplashScreen.hideAsync();
          }}
        />
        <Player />
      </PlayerProvider>
    </GestureHandlerRootView>
  );
}
