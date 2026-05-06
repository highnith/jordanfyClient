import { saveLastFMSession, getLastFMSession } from "../storage/playlistStorage";
import md5 from "md5";

const linkLastFM = "https://www.last.fm/api/accounts";
const API_KEY = "94f697efe6288946f6a2dc8b146fcc8a";
const BASE_URL = "http://ws.audioscrobbler.com/2.0/";

const createSignature = (params) => {
  const SHARED_SECRET = "0cc6d64fd8e62f2cbf14955b1198f772";
  const sortedKeys = Object.keys(params).sort();

  let string = "";

  for (const key of sortedKeys) {
    string += key + params[key];
  }

  string += SHARED_SECRET;

  return md5(string);
};

const login = async (username, password) => {
  if(getLastFMSession() != null) return   getLastFMSession();
  const params = {
    method: "auth.getMobileSession",
    username,
    password,
    api_key: API_KEY,
  };

  const api_sig = createSignature(params);

  const body = new URLSearchParams({
    ...params,
    api_sig,
    format: "json",
  });

  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: body.toString(),
  });

  const data = await res.json();

  const key = data?.session?.key;

  if (!key) throw new Error("Login failed");
  
  saveLastFMSession(key)

  return key;
};

const nowPlaying = async (track) => {
  const SESSION_KEY = await login("Jordanfy", "Gsmnppib2007!")

  const params = {
    method: "track.updateNowPlaying",
    artist: track.artist,
    track: track.title,
    api_key: API_KEY,
    sk: SESSION_KEY,
  };

  const api_sig = createSignature(params);

  const body = new URLSearchParams({
    ...params,
    api_sig,
    format: "json",
  });

  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: body.toString(),
  });

  return res.json();
};

const scrobble = async (track) => {
  const SESSION_KEY = await login("Jordanfy", "Gsmnppib2007!")

  const timestamp = Math.floor(Date.now() / 1000);

  const params = {
    method: "track.scrobble",
    artist: track.artist,
    track: track.title,
    timestamp: String(timestamp),
    api_key: API_KEY,
    sk: SESSION_KEY,
  };

  const api_sig = createSignature(params);

  const body = new URLSearchParams({
    ...params,
    api_sig,
    format: "json",
  });

  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: body.toString(),
  });

  const data = await res.json();
  return data;
};

const getTopTracks = async (limit = 50) => {
  const params = new URLSearchParams({
    method: "chart.gettoptracks",
    api_key: API_KEY,
    limit: String(limit),
    format: "json",
  });

  const res = await fetch(`${BASE_URL}?${params.toString()}`);

  const data = await res.json();

  return data;
};


const getTopTracksbyCountry = async (limit = 50) => {
  const params = new URLSearchParams({
    method: "geo.gettoptracks",
    country: "italy",
    api_key: API_KEY,
    limit: String(limit),
    format: "json",
  });

  const res = await fetch(`${BASE_URL}?${params.toString()}`);

  const data = await res.json();

  return data;
};

export const LastFM = {
    scrobble,
    nowPlaying,
    getTopTracks,
    getTopTracksbyCountry
}