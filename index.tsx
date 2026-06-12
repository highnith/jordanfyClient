import "@expo/metro-runtime"; // Necessary for Fast Refresh on Web
import { registerRootComponent } from "expo";
import TrackPlayer, { Event, PlayerCommand, } from "@rntp/player";

import { App } from "./src/App";

const setup = async () => {
  TrackPlayer.registerBackgroundEventHandler(() => async (event) => {
    switch (event.type) {
      case Event.RemotePlay:
        TrackPlayer.play();
        break;
      case Event.RemotePause:
        TrackPlayer.pause();
        break;
      case Event.RemoteNext:
        TrackPlayer.skipToNext();
        break;
      case Event.RemotePrevious: {
        const progress = TrackPlayer.getProgress();
        if (progress.position > 5) {
          TrackPlayer.seekTo(0);
        } else {
          TrackPlayer.skipToPrevious();
        }
      }
    }
  });
  
  TrackPlayer.setupPlayer({
    contentType: "music",
    taskRemovedBehavior: "stop"
  });
  TrackPlayer.setCommands({
    capabilities: [
      PlayerCommand.PlayPause,
      PlayerCommand.Next,
      PlayerCommand.Previous,
    ],
  });
};

setup();
// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);

// AppRegistry.registerComponent(...);

