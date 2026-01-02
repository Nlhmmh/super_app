import AssetImage from "@/components/AssetImage";
import BackBtnWithTitle from "@/components/BackBtnWithTitle";
import CustomScrollView from "@/components/CustomScrollView";
import IconButton from "@/components/IconButton";
import Loading from "@/components/Loading";
import Pad from "@/components/Pad";
import PriorityImage from "@/components/PriorityImage";
import { TextType, ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useTheme } from "@/theme/ThemeContext";
import { get, safeAPICall } from "@/utils/api";
import { station } from "@/utils/models";
import { askNotificationPermission } from "@/utils/permission";
import { useCommonStyles } from "@/utils/useCommonStyles";
import { AudioPlayer, createAudioPlayer } from "expo-audio";
import { useKeepAwake } from "expo-keep-awake";
import { useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";

type playerStatus = {
  currentTime: number;
  didJustFinish: boolean;
  duration: number;
  id: string;
  isBuffering: boolean;
  isLoaded: boolean;
  loop: boolean;
  mute: boolean;
  playbackRate: number;
  playbackState: string;
  playing: boolean;
  reasonForWaitingToPlay: string;
  shouldCorrectPitch: boolean;
  timeControlStatus: string;
};

const StationDetailPage = () => {
  const theme = useTheme();
  const commonStyles = useCommonStyles();

  const { stationId } = useLocalSearchParams();
  const [station, setStation] = useState<station | null>(null);
  const [player, setPlayer] = useState<AudioPlayer | null>(null);
  const [playerStatus, setPlayerStatus] = useState<playerStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useKeepAwake();

  useEffect(() => {
    askNotificationPermission();
  }, []);

  useEffect(() => {
    fetchStation();
  }, [stationId]);

  useEffect(() => {
    return () => {
      if (!player) return;
      if (player.playing) player.pause();
      player.clearLockScreenControls?.();
    };
  }, [player]);

  const fetchStation = useCallback(async () => {
    safeAPICall({
      fn: async () => {
        setLoading(true);
        const API_URL = `https://de2.api.radio-browser.info/json/stations/byuuid?uuids=${stationId}`;
        const stations = await get(API_URL);
        if (!stations || stations.length === 0) return;
        const station = stations[0];
        const player = createAudioPlayer(
          station.url_resolved || station.url || ""
        );
        player.addListener("playbackStatusUpdate", (status) => {
          setPlayerStatus(status);
        });
        setStation(station);
        setPlayer(player);
      },
      catchCb: (error) => {
        setError("Could not load radio station. Please check your network.");
      },
      finallyCb: () => {
        setLoading(false);
      },
    });
  }, [stationId]);

  const onPressPlayPause = () => {
    if (!player) return;
    if (player.playing) {
      player.pause();
      player.clearLockScreenControls?.();
      return;
    }
    player.play();

    // Show lock screen / notification controls to keep service foregrounded when supported.
    player.setActiveForLockScreen?.(
      true,
      {
        title: station.name,
        artist: "Super App",
        albumTitle: station.country,
      },
      {
        showSeekBackward: true,
        showSeekForward: true,
      }
    );
  };

  const InfoCard = ({
    title,
    info,
    link,
    openLink,
  }: {
    title: string;
    info: string;
    link?: string;
    openLink?: boolean;
  }) => {
    return (
      <ThemedView
        style={{ flexDirection: "row", gap: 8, alignItems: "center" }}
      >
        <ThemedText bold style={{ flex: 1 }}>
          {title}
        </ThemedText>
        <ThemedText
          type={
            link ? (openLink ? TextType.OPEN_LINK : TextType.LINK) : TextType.M
          }
          link={link || undefined}
          style={{ flex: 2 }}
        >
          {info}
        </ThemedText>
      </ThemedView>
    );
  };

  const imageStyle = {
    width: "80%",
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
          paddingBottom: 100,
        }}
      >
        {loading && <Loading size="large" />}
        {!loading && station && (
          <>
            {station.favicon && station.favicon !== "" ? (
              <>
                <PriorityImage
                  source={{ uri: station.favicon }}
                  style={imageStyle}
                />
                <Pad height={8} />
              </>
            ) : (
              <>
                <AssetImage path="icon_bright.png" style={imageStyle} />
                <Pad height={8} />
              </>
            )}
            <ThemedText
              type={TextType.LINK}
              link={station.url_resolved || station.url}
              style={{ marginBottom: 4 }}
            >
              {station.url_resolved || station.url}
            </ThemedText>
            <Pad height={8} />

            <ThemedView
              style={{
                width: "100%",
                borderWidth: 1,
                borderColor: theme.outline,
                padding: 12,
                borderRadius: 8,
                gap: 4,
                backgroundColor: theme.secondaryContainer,
                ...commonStyles.lightShadow,
              }}
            >
              {station.homepage && (
                <InfoCard
                  title="Homepage:"
                  info={station.homepage}
                  link={station.homepage}
                  openLink
                />
              )}
              {station.tags && <InfoCard title="Tags:" info={station.tags} />}
              <InfoCard title="Country:" info={station.country} />
              <InfoCard title="Language:" info={station.language} />
              <InfoCard title="Codec:" info={station.codec} />
              <InfoCard title="Bitrate:" info={`${station.bitrate} kbps`} />
              <InfoCard title="Click Count:" info={`${station.clickcount}`} />
              <InfoCard title="Votes:" info={`${station.votes}`} />
            </ThemedView>
          </>
        )}
        {error && <ThemedText type={TextType.ERROR}>{error}</ThemedText>}
      </CustomScrollView>

      <ThemedView
        style={{
          position: "absolute",
          bottom: 12,
          width: "100%",
          alignItems: "center",
          zIndex: 1,
        }}
      >
        <IconButton
          isOn={playerStatus?.playing}
          onIcon="pause-circle"
          offIcon="play-circle"
          size={90}
          color={theme.onPrimaryContainer}
          loading={playerStatus?.isBuffering}
          onPress={() => onPressPlayPause()}
        />
      </ThemedView>
    </ThemedView>
  );
};

export default StationDetailPage;
