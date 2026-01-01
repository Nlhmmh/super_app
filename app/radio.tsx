import BackBtnWithTitle from "@/components/BackBtnWithTitle";
import CustomModal from "@/components/CustomModal";
import CustomScrollView from "@/components/CustomScrollView";
import Loading from "@/components/Loading";
import Pad from "@/components/Pad";
import SearchBar from "@/components/SearchBar";
import SelectBox from "@/components/SelectBox";
import { TextType, ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useTheme } from "@/theme/ThemeContext";
import { get, safeAPICall } from "@/utils/api";
import { COUNTRY_CODES, LANGUAGES } from "@/utils/constants";
import { useCommonStyles } from "@/utils/useCommonStyles";
import { Ionicons } from "@expo/vector-icons";
import { AudioPlayer, createAudioPlayer } from "expo-audio";
import { useKeepAwake } from "expo-keep-awake";
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

  const [searchTerm, setSearchTerm] = useState("");
  const [stations, setStations] = useState<station[]>([]);
  const [currentStation, setCurrentStation] = useState<station | undefined>(
    undefined
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openCountryModal, setOpenCountryModal] = useState(false);
  const [selCountry, setSelCountry] = useState<labelValuePair>(undefined);
  const [openLanguageModal, setOpenLanguageModal] = useState(false);
  const [selLanguage, setSelLanguage] = useState<labelValuePair>(undefined);

  useKeepAwake();

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchStations();
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  useEffect(() => {
    // Cleanup audio players on unmount
    return () => {
      stations.forEach((station) => {
        station.player.pause();
      });
    };
  }, [stations]);

  const createStationPlayer = (url: string) => {
    const player = createAudioPlayer(url);
    return player;
  };

  const fetchStations = useCallback(async () => {
    safeAPICall({
      fn: async () => {
        setLoading(true);
        setStations([]);
        const API_URL =
          "https://de2.api.radio-browser.info/json/stations/search";
        let url = `${API_URL}?limit=${40}&hidebroken=true&order=votes&reverse=true`;
        if (searchTerm.trim() !== "") url += `&name=${searchTerm}`;
        if (selCountry) url += `&countrycode=${selCountry.value}`;
        if (selLanguage) url += `&languagecodes=${selLanguage.value}`;
        const stations = await get(url);
        if (!stations) return;
        const mapStations: station[] = stations.map((s: station) => {
          const url = s.url_resolved;
          return {
            stationuuid: s.stationuuid,
            name: s.name,
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
  }, [searchTerm, selCountry, selLanguage]);

  return (
    <ThemedView style={{ flex: 1 }} useTheme>
      <BackBtnWithTitle title="Radio" />
      <ThemedView style={{ flex: 1, padding: 12 }}>
        <SearchBar
          placeholder="Search stations"
          searchText={searchTerm}
          setSearchText={setSearchTerm}
          onPressCountryOptions={() => setOpenCountryModal(true)}
          onPressLanguageOptions={() => setOpenLanguageModal(true)}
        />
        <Pad height={16} />
        <CustomScrollView childGrow>
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
                  />
                );
              })}
          </ThemedView>
          {loading && <Loading />}
        </CustomScrollView>
      </ThemedView>
      <Pad height={16} />

      <CustomModal
        open={openCountryModal}
        setOpen={setOpenCountryModal}
        title="Select Country"
        onClose={() => setOpenCountryModal(false)}
        body={
          <ThemedView
            style={{
              borderWidth: 1,
              borderColor: theme.outline,
              borderRadius: 12,
              padding: 12,
            }}
          >
            <CustomScrollView childGrow>
              <SelectBox
                options={COUNTRY_CODES}
                sel={selCountry}
                setSel={setSelCountry}
                isWrap
              />
            </CustomScrollView>
          </ThemedView>
        }
      />

      <CustomModal
        open={openLanguageModal}
        setOpen={setOpenLanguageModal}
        title="Select Language"
        onClose={() => setOpenLanguageModal(false)}
        body={
          <ThemedView
            style={{
              borderWidth: 1,
              borderColor: theme.outline,
              borderRadius: 12,
              padding: 12,
            }}
          >
            <CustomScrollView childGrow>
              <SelectBox
                options={LANGUAGES}
                sel={selLanguage}
                setSel={setSelLanguage}
                isWrap
              />
            </CustomScrollView>
          </ThemedView>
        }
      />
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
          flexGrow: 1,
          borderWidth: 1,
          borderRadius: 16,
          borderColor: theme.outline,
          backgroundColor: theme.primaryContainer,
          paddingHorizontal: 8,
          paddingVertical: 8,
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
      <ThemedText type={TextType.LINK} link={station.url_resolved}>
        {station.name}
      </ThemedText>
    </TouchableOpacity>
  );
};

export default RadioPage;
