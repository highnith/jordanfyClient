import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { HeaderButton, Text } from "@react-navigation/elements";
import { LinearGradient } from "expo-linear-gradient";
import {
  createStaticNavigation,
  StaticParamList,
} from "@react-navigation/native";

import { StyleSheet, View } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Home } from "./screens/Home";
import { Profile } from "./screens/Profile";
import { Settings } from "./screens/Settings";
import { Search } from "./screens/Search";
import { NotFound } from "./screens/NotFound";
import { Library } from "./screens/Library";
import {TrackScreen} from "./screens/TrackScreen";
import {Playlist} from "./screens/Playlist";
import { NewPlaylist } from "./screens/NewPlaylist";
import { AddToPlaylist } from "./screens/AddToPlaylist";

import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

const HomeTabs = createBottomTabNavigator({
  screenOptions: {
    tabBarShowLabel: true,
    tabBarActiveTintColor: "white",
    tabBarBackground: () => (
      <LinearGradient
        colors={["rgba(0,0,0,0)", "rgba(0,0,0,0.6)"]}
        //locations={[0, 0.75]}
        style={{ flex: 1 }}
      />
    ),
    tabBarStyle: {
      backgroundColor: "transparent",
      position: "absolute",
      height: 130,
      borderTopWidth: 0,
      borderTopColor: "transparent",
      elevation: 0,
      shadowOpacity: 0,
    },
    tabBarItemStyle: {
      flex: 1,
      paddingTop: 35,
      justifyContent: "center",
      alignItems: "center",
      height: 60,
    },
  },
  screens: {
    Home: {
      screen: Home,
      options: {
        title: "Home",
        tabBarIcon: ({ size }) => (
          <View>
            <Ionicons name="home" color={"white"} size={size} />
          </View>
        ),
        headerShown: false,
      },
    },
    Search: {
      screen: Search,
      options: {
        tabBarIcon: ({ size }) => (
          <View>
            <Ionicons name="search" color={"white"} size={size} />
          </View>
        ),
        headerShown: false,
      },
    },
    Library: {
      screen: Library,
      options: {
        tabBarIcon: ({ size }) => (
          <View>
            <MaterialIcons name="my-library-music" color="white" size={size} />
          </View>
        ),
        headerShown: false,
      },
    },
  },
});

const RootStack = createNativeStackNavigator({
  screens: {
    HomeTabs: {
      screen: HomeTabs,
      options: {
        title: "Home",
        headerShown: false,
      },
    },
    Profile: {
      screen: Profile,
      linking: {
        path: ":user(@[a-zA-Z0-9-_]+)",
        parse: {
          user: (value) => value.replace(/^@/, ""),
        },
        stringify: {
          user: (value) => `@${value}`,
        },
      },
    },
    Settings: {
      screen: Settings,
      options: ({ navigation }) => ({
        presentation: "modal",
        headerRight: () => (
          <HeaderButton onPress={navigation.goBack}>
            <Text>Close</Text>
          </HeaderButton>
        ),
      }),
    },
    NotFound: {
      screen: NotFound,
      options: {
        title: "404",
      },
      linking: {
        path: "*",
      },
    },
    TrackScreen: {
      screen :TrackScreen,
      options: {
        headerShown: false
      }
    },
    Playlist :{
      screen :Playlist,
      options: {
        headerShown: false
      }
    },
    NewPlaylist:{
      screen : NewPlaylist,
      options: {
        headerShown: false
      }
    },
    AddToPlaylist:{
      screen : AddToPlaylist,
      options: {
        headerShown: false
      }
    },
  },
});

export const Navigation = createStaticNavigation(RootStack);

