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
  getRNTPobjectscache,
  saveRNTPobjectscache,
} from "../storage/playlistStorage";

import { LastFM } from "../components/lastFMAPI";

const PLAYLIST_IMAGES = {
  world: {
    uri: "data:image/jpeg;base64,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",
  },
  italy: { uri: "https://image-cdn-ak.spotifycdn.com/image/ab67706c0000da84b302acbaf8f051edf3f47d89" },
};

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
  const scrobbledRef = useRef(false);

  const handleRepeatMode = (newRepeatMode) => {
    repeatModePrev.current = repeatMode;
    setRepeatMode(newRepeatMode);
    TrackPlayer.setRepeatMode(newRepeatMode);
  };

  const [suggested, setSuggested] = useState([]);

  const BASE_URL = "https://jordanfy-production.up.railway.app";
  useEffect(() => {
    const load = async () => {
      const data = await LastFM.getTopTracks();
      const countryTop = await LastFM.getTopTracksbyCountry();
      setSuggested([
        {
          entries: data.tracks.track,
          id: "World Top Tracks",
          image: PLAYLIST_IMAGES.world,
        },
        {
          entries: countryTop.tracks.track,
          id: "Italy Top Tracks",
          image: PLAYLIST_IMAGES.italy,
        },
      ]);
    };

    load();
  }, []);

  useEffect(() => {
    if (track == undefined) return;
    LastFM.nowPlaying(track);
    scrobbledRef.current = false;
  }, [track]);

  useEffect(() => {
    if (position > duration / 2 && scrobbledRef.current == false) {
      scrobbledRef.current = true;
      LastFM.scrobble(track);
    }
  }, [position]);

  useEffect(() => {
    const prefetch = async () => {
      const numberOfPrefetched = 1;

      const songIndex = await TrackPlayer.getActiveTrackIndex();
      const queue = (await TrackPlayer.getQueue()) || [];

      if (songIndex == null || !Array.isArray(queue)) return;

      const results = queue.slice(
        Math.max(0, songIndex - numberOfPrefetched),
        songIndex + numberOfPrefetched,
      );

      for (let i = 0; i < results.length; i++) {
        if (results[i]?.url) {
          fetch(results[i].url);
        }
      }
    };

    prefetch();
  }, [track]);

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
    getRNTPobjectscache,
    saveRNTPobjectscache,
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
        suggested,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}
