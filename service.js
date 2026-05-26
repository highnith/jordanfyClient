import TrackPlayer, { Event } from "@rntp/player";

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
      const progress = await TrackPlayer.getProgress();
      if (progress.position > 5) {
        TrackPlayer.seekTo(0);
      } else {
        TrackPlayer.skipToPrevious();
      }
    }
  }
});
