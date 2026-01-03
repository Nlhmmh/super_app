import AssetImage from "@/components/AssetImage";
import BackBtnWithTitle from "@/components/BackBtnWithTitle";
import CustomModal from "@/components/CustomModal";
import CustomScrollView from "@/components/CustomScrollView";
import IconButton from "@/components/IconButton";
import Loading from "@/components/Loading";
import Pad from "@/components/Pad";
import PriorityImage from "@/components/PriorityImage";
import { TextType, ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useAudioPlayer } from "@/contexts/AudioPlayerContext";
import { useUser } from "@/contexts/UserContext";
import { useTheme } from "@/theme/ThemeContext";
import { get, safeAPICall } from "@/utils/api";
import { station } from "@/utils/models";
import { askNotificationPermission } from "@/utils/permission";
import { useCommonStyles } from "@/utils/useCommonStyles";
import { formatMillisecondsToTime } from "@/utils/utils";
import Slider from "@react-native-community/slider";
import { useKeepAwake } from "expo-keep-awake";
import { useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";

const RadioStationDetailPage = () => {
  const theme = useTheme();
  const commonStyles = useCommonStyles();
  const { stationId } = useLocalSearchParams();
  const {
    play,
    pause,
    isPlaying,
    isLoading: playerLoading,
    currentTrack,
    position,
    duration,
    seek,
  } = useAudioPlayer();
  const { isFavouriteRadioStation, toggleFavouriteRadioStation } = useUser();

  const [station, setStation] = useState<station | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSeekBar, setShowSeekBar] = useState(false);
  const [isFavourite, setIsFavourite] = useState(false);
  const [openDetailModal, setOpenDetailModal] = useState(false);

  useKeepAwake();

  useEffect(() => {
    askNotificationPermission();
  }, []);

  useEffect(() => {
    fetchStation();
  }, [stationId]);

  useEffect(() => {
    setShowSeekBar(
      currentTrack?.uri === (station?.url_resolved || station?.url)
    );
  }, [currentTrack, station]);

  useEffect(() => {
    if (!station) return;
    setIsFavourite(isFavouriteRadioStation(station));
  }, [station, isFavouriteRadioStation]);

  const fetchStation = useCallback(async () => {
    safeAPICall({
      fn: async () => {
        setLoading(true);
        const API_URL = `https://de2.api.radio-browser.info/json/stations/byuuid?uuids=${stationId}`;
        const stations = await get(API_URL);
        if (!stations || stations.length === 0) return;
        const station = stations[0];
        setStation(station);
      },
      catchCb: (error) => {
        setError("Could not load radio station. Please check your network.");
      },
      finallyCb: () => {
        setLoading(false);
      },
    });
  }, [stationId]);

  const onPressPlayPause = async () => {
    if (!station) return;

    // Check if we're already playing this station
    const isSameStation =
      currentTrack?.uri === (station.url_resolved || station.url);

    if (isPlaying && isSameStation) {
      await pause();
    } else {
      await play({
        uri: station.url_resolved || station.url || "",
        title: station.name,
        artist: "Super App",
        artwork: station.favicon,
      });
    }
  };

  const imageStyle = {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 12,
  };

  return (
    <ThemedView style={{ flex: 1 }} useTheme>
      <BackBtnWithTitle title={station?.name || "Radio"} />

      <CustomScrollView
        childGrow
        contentContainerStyle={{
          alignItems: "center",
          padding: 12,
          paddingBottom: 250,
        }}
      >
        {loading && <Loading size="large" />}
        {!loading && station && (
          <>
            <ThemedView style={{ ...commonStyles.shadow }}>
              {station.favicon && station.favicon !== "" ? (
                <PriorityImage
                  source={{ uri: station.favicon }}
                  style={imageStyle}
                />
              ) : (
                <AssetImage path="icon_bright.png" style={imageStyle} />
              )}
            </ThemedView>
            <Pad height={8} />
            <ThemedText>
              {station.country} | {station.language}
            </ThemedText>
            <Pad height={8} />
            <ThemedText type={TextType.SM}>{station.tags}</ThemedText>
          </>
        )}
        {error && <ThemedText type={TextType.ERROR}>{error}</ThemedText>}
      </CustomScrollView>

      <ThemedView
        style={{
          position: "absolute",
          bottom: 0,
          width: "100%",
          alignItems: "center",
          zIndex: 1,
          padding: 12,
          backgroundColor: theme.secondary,
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          ...commonStyles.shadow,
        }}
      >
        <ThemedView
          style={{
            width: "100%",
            backgroundColor: theme.secondaryContainer,
            padding: 12,
            borderRadius: 24,
            gap: 4,
          }}
        >
          <ThemedView
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              paddingHorizontal: 12,
            }}
          >
            <ThemedText type={TextType.SM}>
              {formatMillisecondsToTime(showSeekBar ? position : 0)}
            </ThemedText>
            <ThemedText type={TextType.SM}>
              {formatMillisecondsToTime(duration)}
            </ThemedText>
          </ThemedView>
          <Slider
            minimumValue={0}
            maximumValue={duration || 100}
            value={showSeekBar ? position : undefined}
            disabled={true}
            minimumTrackTintColor={theme.onSecondaryContainer}
            maximumTrackTintColor={theme.onSecondaryContainer}
            thumbTintColor={theme.onSecondaryContainer}
          />
        </ThemedView>

        <ThemedView
          style={{
            width: "100%",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <IconButton
            onIcon="information-circle"
            offIcon="information-circle"
            size={36}
            color={theme.onSecondary}
            onPress={async () => {
              setOpenDetailModal(true);
            }}
            style={{ flex: 1 }}
          />
          <IconButton
            isOn={
              isPlaying &&
              currentTrack?.uri === (station?.url_resolved || station?.url)
            }
            onIcon="pause-circle"
            offIcon="play-circle"
            size={90}
            color={theme.onSecondary}
            loading={playerLoading}
            onPress={() => onPressPlayPause()}
            style={{ flex: 3 }}
          />
          <IconButton
            isOn={isFavourite}
            onIcon="heart"
            offIcon="heart-outline"
            size={36}
            color={theme.onSecondary}
            onPress={async () => {
              if (station) {
                await toggleFavouriteRadioStation(station);
                setIsFavourite(!isFavourite);
              }
            }}
            style={{ flex: 1 }}
          />
        </ThemedView>
      </ThemedView>

      <CustomModal
        open={openDetailModal}
        onClose={() => setOpenDetailModal(false)}
        title={"Station Details"}
        body={
          <ThemedView
            style={{
              borderWidth: 1,
              borderColor: theme.outline,
              borderRadius: 12,
              padding: 12,
              gap: 4,
              backgroundColor: theme.background,
              ...commonStyles.shadow,
            }}
          >
            <InfoCard title="Name:" info={station?.name} />
            {station?.homepage && (
              <InfoCard
                title="Homepage:"
                info={station?.homepage}
                link={station?.homepage}
                openLink
                oneLineMode
              />
            )}
            {station?.tags && <InfoCard title="Tags:" info={station?.tags} />}
            <InfoCard title="Country:" info={station?.country} />
            <InfoCard title="Language:" info={station?.language} />
            <InfoCard title="Codec:" info={station?.codec} />
            <InfoCard title="Bitrate:" info={`${station?.bitrate} kbps`} />
            <InfoCard title="Click Count:" info={`${station?.clickcount}`} />
            <InfoCard title="Votes:" info={`${station?.votes}`} />
            <ThemedText
              type={TextType.LINK}
              link={station?.url_resolved || station?.url}
              style={{ marginBottom: 4 }}
            >
              copy radio stream url here!!
            </ThemedText>
          </ThemedView>
        }
      />
    </ThemedView>
  );
};

const InfoCard = ({
  title,
  info,
  link,
  oneLineMode,
  openLink,
}: {
  title: string;
  info: string;
  link?: string;
  oneLineMode?: boolean;
  openLink?: boolean;
}) => {
  const theme = useTheme();
  return (
    <ThemedView style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
      <ThemedText
        type={TextType.M}
        bold
        style={{ flex: 1, alignSelf: "flex-start" }}
      >
        {title}
      </ThemedText>
      <ThemedText
        type={
          link ? (openLink ? TextType.OPEN_LINK : TextType.LINK) : TextType.M
        }
        link={link || undefined}
        style={{ flex: 2 }}
        oneLineMode={oneLineMode}
      >
        {info}
      </ThemedText>
    </ThemedView>
  );
};

export default RadioStationDetailPage;
