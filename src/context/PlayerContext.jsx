import { createContext, useEffect, useState, useRef } from "react";
import {
  useAudioPlayer,
  useAudioPlayerStatus,
  setAudioModeAsync,
} from "expo-audio";

import {
  createPlaylist,
  addSongToPlaylist,
  removeSong,
  getData
} from "../storage/playlistStorage";

export const PlayerContext = createContext(null);

export function PlayerProvider({ children }) {
  const [track, setTrack] = useState(null);
  const [playerVisibility, setPlayerVisibility] = useState(false);
  const [trackScreenActive, setTrackScreenActive] = useState(false);
  const [queuePopup, setQueuePopup] = useState(false);
  const queue = useRef([]);

  const BASE_URL = "https://web-production-d23a.up.railway.app";

  useEffect(() => {
    setAudioModeAsync({
      playsInSilentMode: true,
      shouldPlayInBackground: true,
      interruptionMode: "doNotMix",
    });
  }, []);

  const showQueuePopup = () => {
    setQueuePopup(true);
    setTimeout(() => setQueuePopup(false), 1500);
  };

  const player = useAudioPlayer();
  const playerStatus = useAudioPlayerStatus(player);

  const addToQueue = (newTrack) => {
    if (queue.current.length === 0) {
      setTrack(newTrack);
      setPlayerVisibility(true);
    }
    queue.current.push(newTrack);
    fetch(`${BASE_URL}/stream/${newTrack.id}`);
  };

  const handle_single_play = (newTrack) => {
    queue.current = [newTrack];
    setTrack(newTrack);
  };

  const moveForward = () => {
    const currentIndex = queue.current.findIndex((t) => t.id === track.id);
    const nextTrack = queue.current[currentIndex + 1];

    if (nextTrack) {
      setTrack(nextTrack);
    }
  };

  const moveBackward = () => {
    if (playerStatus.currentTime > 5) {
      player.seekTo(0);
    } else {
      const currentIndex = queue.current.findIndex((t) => t.id === track.id);
      const previousTrack = queue.current[currentIndex - 1];

      if (previousTrack) {
        setTrack(previousTrack);
      }
    }
  };

  useEffect(() => {
    if (!track) return;
    player.replace({ uri: `${BASE_URL}/stream/${track.id}` });
    player.play();
    setPlayerVisibility(true);
    player.setActiveForLockScreen(
      true,
      {
        title: track.title,
        artist: track.channel,
        albumTitle: "youtube",
        artworkUrl: `https://i.ytimg.com/vi/${track.id}/hqdefault.jpg`,
      },
      {
        showSeekBackward: true,
        showSeekForward: true,
      },
    );
  }, [track]);

  useEffect(() => {
    if (!track) return;
    if (playerStatus.didJustFinish) {
      const currentIndex = queue.current.findIndex((t) => t.id === track.id);
      const nextTrack = queue.current[currentIndex + 1];

      if (nextTrack) {
        setTrack(nextTrack);
      }
    }
  }, [playerStatus.didJustFinish]);

  return (
    <PlayerContext.Provider
      value={{
        BASE_URL,
        trackScreenActive,
        setTrackScreenActive,
        addToQueue,
        moveForward,
        moveBackward,
        handle_single_play,
        player,
        playerStatus,
        track,
        setTrack,
        playerVisibility,
        setPlayerVisibility,
        createPlaylist,
        addSongToPlaylist,
        removeSong,
        getData,
        queuePopup,
        showQueuePopup,
        handle_single_play
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}
