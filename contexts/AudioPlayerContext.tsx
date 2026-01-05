import { station } from "@/utils/models";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AudioPlayer, createAudioPlayer } from "expo-audio";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

const SECURE_CURRENT_STATION_KEY = "secure_current_station";

export type AudioTrack = {
  station: station;
  uri: string;
  title?: string;
  artist?: string;
  artwork?: string;
  [key: string]: unknown;
};

type AudioPlayerContextValue = {
  currentTrack: AudioTrack | null;
  isPlaying: boolean;
  isLoading: boolean;
  duration: number;
  position: number;
  error: string | null;
  play: (track?: AudioTrack) => Promise<void>;
  pause: () => Promise<void>;
  resume: () => Promise<void>;
  stop: () => Promise<void>;
  seek: (position: number) => Promise<void>;
  loadTrack: (track: AudioTrack) => Promise<void>;
  clearCurrentStation: () => Promise<void>;
};

const AudioPlayerContext = createContext<AudioPlayerContextValue | null>(null);

export function AudioPlayerProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [currentTrack, setCurrentTrack] = useState<AudioTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const playerRef = useRef<AudioPlayer | null>(null);

  const loadCurrentStation = useCallback(async () => {
    setError(null);
    try {
      const value = await AsyncStorage.getItem(SECURE_CURRENT_STATION_KEY);
      if (value) {
        const parsed = JSON.parse(value) as AudioTrack;
        setCurrentTrack(parsed);
        return parsed;
      } else {
        setCurrentTrack(null);
        return null;
      }
    } catch (err) {
      console.error("Failed to load current station", err);
      setError("Failed to load current station");
      setCurrentTrack(null);
      return null;
    }
  }, []);

  const saveCurrentStation = useCallback(async (track: AudioTrack | null) => {
    setError(null);
    try {
      if (track) {
        await AsyncStorage.setItem(
          SECURE_CURRENT_STATION_KEY,
          JSON.stringify(track)
        );
      } else {
        await AsyncStorage.removeItem(SECURE_CURRENT_STATION_KEY);
      }
    } catch (err) {
      console.error("Failed to save current station", err);
      setError("Failed to save current station");
    }
  }, []);

  const clearCurrentStation = useCallback(async () => {
    setError(null);
    try {
      await AsyncStorage.removeItem(SECURE_CURRENT_STATION_KEY);
      setCurrentTrack(null);
    } catch (err) {
      console.error("Failed to clear current station", err);
      setError("Failed to clear current station");
    }
  }, []);

  // Helper function to set lock screen controls
  const setLockScreenControls = useCallback((track: AudioTrack | null) => {
    if (playerRef.current && track) {
      playerRef.current.setActiveForLockScreen?.(
        true,
        {
          title: track.title || "Audio",
          artist: track.artist || "Super App",
          albumTitle: "Radio",
          artworkUrl: track.artwork || undefined,
        },
        {
          showSeekBackward: false,
          showSeekForward: false,
        }
      );
    }
  }, []);

  const loadTrack = useCallback(async (track: AudioTrack) => {
    try {
      setError(null);

      // Stop and remove previous player
      if (playerRef.current) {
        if (playerRef.current.playing) {
          playerRef.current.pause();
        }
        playerRef.current.remove();
        playerRef.current = null;
      }

      // Create new player
      const player = createAudioPlayer(track.uri);

      // Add listener for playback status updates
      player.addListener("playbackStatusUpdate", (status) => {
        setIsPlaying(status.playing || false);
        setIsLoading(status.isBuffering || false);
        setPosition((status.currentTime || 0) * 1000); // Convert to milliseconds
        setDuration((status.duration || 0) * 1000); // Convert to milliseconds

        // Auto-stop when finished
        if (status.didJustFinish) {
          setIsPlaying(false);
          setPosition(0);
        }
      });

      playerRef.current = player;
      setCurrentTrack(track);
      setPosition(0);
      setDuration(0);
    } catch (err) {
      console.error("Error loading track:", err);
      setError(err instanceof Error ? err.message : "Failed to load track");
      setIsLoading(false);
    }
  }, []);

  const play = useCallback(
    async (track?: AudioTrack) => {
      try {
        setError(null);

        // If a new track is provided, load it first
        if (track) {
          await loadTrack(track);
          await saveCurrentStation(track);
        }

        // Play the current player
        if (playerRef.current) {
          playerRef.current.play();
          setLockScreenControls(track || currentTrack);
        } else if (currentTrack) {
          // If no player loaded but we have a current track, reload it
          await loadTrack(currentTrack);
          if (playerRef.current) {
            playerRef.current.play();
            setLockScreenControls(currentTrack);
          }
        }
      } catch (err) {
        console.error("Error playing audio:", err);
        setError(err instanceof Error ? err.message : "Failed to play audio");
        setIsPlaying(false);
      }
    },
    [currentTrack, loadTrack, setLockScreenControls]
  );

  const pause = useCallback(async () => {
    try {
      if (playerRef.current) {
        playerRef.current.pause();
        playerRef.current.clearLockScreenControls?.();
      }
    } catch (err) {
      console.error("Error pausing audio:", err);
      setError(err instanceof Error ? err.message : "Failed to pause audio");
    }
  }, []);

  const resume = useCallback(async () => {
    try {
      if (playerRef.current && currentTrack) {
        playerRef.current.play();
        setLockScreenControls(currentTrack);
      }
    } catch (err) {
      console.error("Error resuming audio:", err);
      setError(err instanceof Error ? err.message : "Failed to resume audio");
    }
  }, [currentTrack, setLockScreenControls]);

  const stop = useCallback(async () => {
    try {
      if (playerRef.current) {
        playerRef.current.pause();
        playerRef.current.clearLockScreenControls?.();
        // Note: currentTime is read-only, to reset we need to reload the track
        setPosition(0);
      }
    } catch (err) {
      console.error("Error stopping audio:", err);
      setError(err instanceof Error ? err.message : "Failed to stop audio");
    }
  }, []);

  const seek = useCallback(async (positionMs: number) => {
    try {
      // Note: expo-audio's AudioPlayer does not support seeking
      // currentTime is read-only. This is common for streaming audio.
      // For seekable audio, you would need to use expo-av's Audio.Sound instead
      console.warn("Seek not supported for streaming audio with AudioPlayer");
      setPosition(positionMs); // Update UI only
    } catch (err) {
      console.error("Error seeking audio:", err);
      setError(err instanceof Error ? err.message : "Failed to seek audio");
    }
  }, []);

  useEffect(() => {
    loadCurrentStation();
  }, [loadCurrentStation]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (playerRef.current) {
        if (playerRef.current.playing) {
          playerRef.current.pause();
        }
        playerRef.current.remove();
      }
    };
  }, []);

  const value: AudioPlayerContextValue = {
    currentTrack,
    isPlaying,
    isLoading,
    duration,
    position,
    error,
    play,
    pause,
    resume,
    stop,
    seek,
    loadTrack,
    clearCurrentStation,
  };

  return (
    <AudioPlayerContext.Provider value={value}>
      {children}
    </AudioPlayerContext.Provider>
  );
}

export function useAudioPlayer() {
  const context = useContext(AudioPlayerContext);
  if (!context) {
    throw new Error("useAudioPlayer must be used within AudioPlayerProvider");
  }
  return context;
}
