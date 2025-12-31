import BackBtnWithTitle from "@/components/BackBtnWithTitle";
import CustomScrollView from "@/components/CustomScrollView";
import Loading from "@/components/Loading";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useTheme } from "@/theme/ThemeContext";
import { safeAPICall } from "@/utils/api";
import { useCommonStyles } from "@/utils/useCommonStyles";
import { AudioPlayer, createAudioPlayer } from "expo-audio";
import { useCallback, useEffect, useState } from "react";
import { TouchableOpacity } from "react-native";

type station = {
  stationuuid: string;
  name: string;
  url_resolved: string;
  player: AudioPlayer;
};

const RadioPage = () => {
  const theme = useTheme();
  const commonStyles = useCommonStyles();

  const [stations, setStations] = useState<station[]>([]);
  const [searchTerm, setSearchTerm] = useState("cherry");
  const [currentStation, setCurrentStation] = useState<station | undefined>(
    undefined
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStations();
  }, [fetchStations]);

  const fetchStations = useCallback(async () => {
    safeAPICall({
      fn: async () => {
        const API_URL =
          "https://de2.api.radio-browser.info/json/stations/search";
        const limit = 10;
        const url = `${API_URL}?name=${searchTerm}&limit=${limit}&hidebroken=true&order=votes&reverse=true`;
        const resp = await fetch(url);
        if (!resp.ok) return;
        const stations = await resp.json();
        if (!stations) return;
        for (const station of stations) {
          if (station.url_resolved) {
            station.player = createAudioPlayer(station.url_resolved);
          }
        }
        setStations(stations);
      },
      catchCb: (error) => {
        console.debug(error);
        setError(
          "Could not load radio stations. Please check the network or API."
        );
      },
      finallyCb: () => {
        setLoading(false);
      },
    });
  }, [searchTerm]);

  const StationCard = ({
    station,
    onPress,
  }: {
    station: station;
    onPress: () => void;
  }) => {
    const [pressed, setPressed] = useState(false);
    return (
      <TouchableOpacity
        style={[
          {
            borderRadius: 16,
            backgroundColor: theme.primaryContainer,
            borderWidth: 1,
            borderColor: theme.outline,
            padding: 16,
            alignContent: "center",
          },
          !pressed ? commonStyles.lightShadow : undefined,
        ]}
        disabled={
          station.stationuuid != currentStation?.stationuuid &&
          currentStation?.player?.playing
        }
        onPress={onPress}
        onPressIn={() => setPressed(true)}
        onPressOut={() => setPressed(false)}
        activeOpacity={0.8}
      >
        <ThemedText>{station.player.playing ? "Pause" : "Play"}</ThemedText>
        <ThemedText>{station.name}</ThemedText>
      </TouchableOpacity>
    );
  };

  return (
    <ThemedView style={{ flex: 1 }} useTheme>
      <BackBtnWithTitle title="Radio" />
      <CustomScrollView>
        <ThemedView
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 12,
            padding: 12,
          }}
        >
          {stations.length > 0 &&
            stations.map((station) => {
              return (
                <StationCard
                  key={station.stationuuid}
                  station={station}
                  onPress={() => {
                    const player = station.player;
                    console.log(station);
                    console.log(player);
                    if (!player.isLoaded) return;
                    if (player.playing) {
                      player.pause();
                      setCurrentStation(undefined);
                      return;
                    }
                    setCurrentStation(station);
                    player.play();
                  }}
                />
              );
            })}
          {loading && <Loading />}
        </ThemedView>
      </CustomScrollView>
    </ThemedView>
  );
};

export default RadioPage;
