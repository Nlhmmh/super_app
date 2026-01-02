import { AudioPlayer } from "expo-audio";

export type labelValuePair = {
  label: string;
  value: string;
};

export type idNamePair = {
  id: string;
  name: string;
};

export type station = {
  player: AudioPlayer;
  stationuuid: string;
  name: string;
  url: string;
  url_resolved: string;
  homepage: string;
  favicon: string;
  tags: string;
  country: string;
  countrycode: string;
  state: string;
  language: string;
  languagecodes: string;
  codec: string;
  bitrate: number;
  clickcount: number;
  geo_lat: number;
  geo_long: number;
  votes: number;
};
