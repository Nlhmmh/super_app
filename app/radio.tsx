import BackBtnWithTitle from "@/components/BackBtnWithTitle";
import CustomScrollView from "@/components/CustomScrollView";
import Loading from "@/components/Loading";
import Pad from "@/components/Pad";
import SearchBar from "@/components/SearchBar";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useTheme } from "@/theme/ThemeContext";
import { safeAPICall } from "@/utils/api";
import { useCommonStyles } from "@/utils/useCommonStyles";
import { Ionicons } from "@expo/vector-icons";
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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStations();
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      // fetchStations();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const createStationPlayer = (url: string) => {
    const player = createAudioPlayer(url);
    return player;
  };

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
        const mapStations: station[] = stations.map((stationData: any) => {
          const url = stationData.url_resolved.endsWith("/")
            ? stationData.url_resolved.slice(0, -1)
            : stationData.url_resolved;
          return {
            stationuuid: stationData.stationuuid,
            name: stationData.name,
            url_resolved: url,
            player: createStationPlayer(url),
          };
        });
        setStations(mapStations);
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

  return (
    <ThemedView style={{ flex: 1 }} useTheme>
      <BackBtnWithTitle title="Radio" />
      <CustomScrollView>
        <ThemedView style={{ flex: 1, padding: 12 }}>
          <SearchBar
            placeholder="Search stations"
            searchText={searchTerm}
            setSearchText={setSearchTerm}
          />
          <Pad height={16} />
          <ThemedView
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            {stations.length > 0 &&
              stations.map((station) => {
                return (
                  <StationCard
                    key={station.stationuuid}
                    station={station}
                    disabled={
                      currentStation !== undefined &&
                      currentStation.stationuuid !== station.stationuuid
                    }
                    onPress={async () => {
                      const player = station.player;
                      if (player.playing) {
                        player.pause();
                        setCurrentStation(undefined);
                        return;
                      }
                      setCurrentStation(station);
                      player.play();
                      console.log(station.url_resolved);
                    }}
                    removePlayer={() => {
                      setCurrentStation(undefined);
                    }}
                  />
                );
              })}
            {loading && <Loading />}
          </ThemedView>
        </ThemedView>
      </CustomScrollView>
    </ThemedView>
  );
};

const StationCard = ({
  station,
  disabled,
  onPress,
  removePlayer,
}: {
  station: station;
  disabled?: boolean;
  onPress: () => void;
  removePlayer?: () => void;
}) => {
  const theme = useTheme();
  const commonStyles = useCommonStyles();
  const [pressed, setPressed] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const subscription = station.player.addListener(
      "playbackStatusUpdate",
      (status) => {
        console.log("Playback status update:", status);
        setIsLoading(status.isBuffering);
        setIsPlaying(status.playing);
        if (!status.isPlaying) {
          removePlayer?.();
        }
      }
    );
    return () => {
      subscription.remove();
    };
  }, [station.player]);

  return (
    <TouchableOpacity
      style={[
        {
          borderRadius: 16,
          backgroundColor: theme.primaryContainer,
          borderWidth: 1,
          borderColor: theme.outline,
          paddingVertical: 8,
          paddingHorizontal: 8,
          alignItems: "center",
        },
        !pressed ? commonStyles.lightShadow : undefined,
        disabled ? { opacity: 0.5 } : undefined,
      ]}
      disabled={disabled}
      onPress={onPress}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      activeOpacity={0.8}
    >
      {isLoading ? (
        <Loading size="small" />
      ) : (
        <Ionicons
          name={isPlaying ? "pause-circle" : "play-circle"}
          size={28}
          color={theme.onPrimaryContainer}
        />
      )}
      <ThemedText>{station.name}</ThemedText>
    </TouchableOpacity>
  );
};

export default RadioPage;
