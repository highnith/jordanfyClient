import '@expo/metro-runtime'; // Necessary for Fast Refresh on Web
import { registerRootComponent } from 'expo';
import TrackPlayer, { Capability,AppKilledPlaybackBehavior } from "react-native-track-player";

import { PlaybackService } from './service';
import { App } from './src/App';



const setup = async () => {
  try {
    await TrackPlayer.setupPlayer();
    await TrackPlayer.updateOptions({
      capabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.SkipToNext,
        Capability.SkipToPrevious,
        Capability.Stop,
      ],
      android: {
        appKilledPlaybackBehavior: AppKilledPlaybackBehavior.StopPlaybackAndRemoveNotification
      },
    });
  } catch (e) {
    if (!e.message.includes("already been initialized")) {
      console.error(e);
    }
  }
};

setup();
// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);

// AppRegistry.registerComponent(...);
TrackPlayer.registerPlaybackService(() => PlaybackService);