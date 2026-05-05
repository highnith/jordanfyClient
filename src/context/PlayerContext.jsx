import { createContext, useEffect, useState, useRef } from "react";
import TrackPlayer, {
  useActiveTrack, // traccia corrente
  usePlaybackState, // stato play/pausa/stop
  useProgress,
  State,
  RepeatMode, // posizione e durata
} from "react-native-track-player";

import {
  createPlaylist,
  addSongToPlaylist,
  removeSong,
  getData,
  deletePlaylist,
} from "../storage/playlistStorage";

export const PlayerContext = createContext(null);

export function PlayerProvider({ children }) {
  const track = useActiveTrack();
  const playbackState = usePlaybackState();
  const { position, buffered, duration } = useProgress();
  const [playerVisibility, setPlayerVisibility] = useState(false);
  const [trackScreenActive, setTrackScreenActive] = useState(false);
  const [queuePopup, setQueuePopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState();
  const [playlists, setPlaylists] = useState([]);
  const repeatModePrev = useRef(RepeatMode.Off);
  const [repeatMode, setRepeatMode] = useState(RepeatMode.Off);

  const handleRepeatMode = (newRepeatMode) => {
    repeatModePrev.current = repeatMode;
    setRepeatMode(newRepeatMode);
    TrackPlayer.setRepeatMode(newRepeatMode);
  };

  useEffect(() => {
    const numberOfPrefetched = 5;
    const song_index = TrackPlayer.getActiveTrackIndex();
    const queue = TrackPlayer.getQueue();
    const results = queue.slice(
      song_index - numberOfPrefetched,
      song_index + numberOfPrefetched,
    );
    for (let i = 0; i < results.length; i++) {
      fetch(results[i].url);
    }
  }, [track]);

  const BASE_URL = "https://web-production-d23a.up.railway.app";

  const Storage = {
    createNewPlaylist(name) {
      createPlaylist(name);
      setPlaylists(getData().playlists);
    },
    addASongToPlaylist(playlistId, song) {
      addSongToPlaylist(playlistId, song);
      setPlaylists(getData().playlists);
    },
    removeASong(playlistId, songId) {
      removeSong(playlistId, songId);
      setPlaylists(getData().playlists);
    },
    getPlaylistData() {
      return getData().playlists;
    },
    deleteAPlaylist(playlistId) {
      deletePlaylist(playlistId);
      setPlaylists(getData().playlists);
    },
  };

  useEffect(() => {
    setPlaylists(getData().playlists);
  }, []);

  const isRNTPObject = (t) =>
    t?.id && t?.url && t?.title && t?.artist && t?.duration && t?.artwork;

  const createRNTPobject = (track) => {
    if (isRNTPObject(track)) {
      return track;
    }
    const RNTPObject = {
      id: track.id,
      url: `${BASE_URL}/stream/${track.id}`,
      title: track.title,
      artist: track.channel,
      duration: track.duration,
      artwork: `https://i.ytimg.com/vi/${track.id}/hqdefault.jpg`,
    };
    return RNTPObject;
  };

  const showQueuePopup = (text) => {
    setPopupMessage(text);
    setQueuePopup(true);
    setTimeout(() => setQueuePopup(false), 1500);
  };

  useEffect(() => {
    if (playbackState.state !== State.None && !trackScreenActive) {
      setPlayerVisibility(true);
    } else {
      setPlayerVisibility(false);
    }
  }, [playbackState, trackScreenActive]);

  return (
    <PlayerContext.Provider
      value={{
        BASE_URL,
        trackScreenActive,
        setTrackScreenActive,
        track,
        playerVisibility,
        setPlayerVisibility,
        queuePopup,
        showQueuePopup,
        popupMessage,
        setPopupMessage,
        createRNTPobject,
        playbackState,
        position,
        duration,
        Storage,
        repeatModePrev,
        handleRepeatMode,
        repeatMode,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}
