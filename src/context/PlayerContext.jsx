import { createContext, useEffect, useState, useRef } from "react";
import TrackPlayer, {
  useActiveMediaItem, 
  usePlaybackState, 
  useProgress,
  useIsPlaying,
  PlaybackState,
  RepeatMode
} from '@rntp/player';

import {
  createPlaylist,
  addSongToPlaylist,
  removeSong,
  getData,
  deletePlaylist,
  getRNTPobjectscache,
  saveRNTPobjectscache,
  update_server_url
} from "../storage/playlistStorage";

import { LastFM } from "../components/lastFMAPI";



export const PlayerContext = createContext(null);

export function PlayerProvider({ children }) {
  const track = useActiveMediaItem();
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
  const isPlaying = useIsPlaying();
  const [BASE_URL,SET_BASE_URL] = useState()
  
  useEffect(() => {
    if(BASE_URL){
      update_server_url(BASE_URL)
    }
  
  },[BASE_URL]);
  useEffect(() => {
    const data = getData();
    if(data.server_url){
      SET_BASE_URL(data.server_url)
    }else{
      SET_BASE_URL("https://jordanfy-production.up.railway.app")
    }
  })
  const handleRepeatMode = (newRepeatMode) => {
    repeatModePrev.current = repeatMode;
    setRepeatMode(newRepeatMode);
    TrackPlayer.setRepeatMode(newRepeatMode);
  };

  const [suggested, setSuggested] = useState([]);

  
  useEffect(() => {
    const load = async () => {
      const data = await LastFM.getTopTracks();
      const countryTop = await LastFM.getTopTracksbyCountry();
      setSuggested([
        {
          entries: data.tracks.track,
          id: "World Top Tracks",
          image: require("../assets/Top50Global.png")
        },
        {
          entries: countryTop.tracks.track,
          id: "Italy Top Tracks",
          image: require("../assets/Top50Italy.png")
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

      const songIndex = TrackPlayer.getActiveMediaItemIndex();
      const queue = (TrackPlayer.getQueue()) || [];

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
    t?.mediaId && t?.url && t?.title && t?.artist && t?.duration && t?.artworkUrl;

  const createRNTPobject = (track) => {
    if (isRNTPObject(track)) {
      return track;
    }
    const RNTPObject = {
      mediaId: track.id,
      url: `${BASE_URL}/stream/${track.id}`,
      title: track.title,
      artist: track.channel,
      duration: track.duration,
      artworkUrl: `https://i.ytimg.com/vi/${track.id}/hqdefault.jpg`,
    };
    return RNTPObject;
  };

  const showQueuePopup = (text) => {
    setPopupMessage(text);
    setQueuePopup(true);
    setTimeout(() => setQueuePopup(false), 1500);
  };

  useEffect(() => {
    if (track && !trackScreenActive) {
      setPlayerVisibility(true);
    } else {
      setPlayerVisibility(false);
    }
  }, [track, trackScreenActive]);

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
        isPlaying,
        SET_BASE_URL
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}
