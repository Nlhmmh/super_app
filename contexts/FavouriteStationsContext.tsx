import { station } from "@/utils/models";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const SECURE_FAVOURITE_STATIONS_KEY = "secure_favourite_stations";

type FavouriteStationsContextValue = {
  favouriteRadioStations: station[] | null;
  isLoading: boolean;
  error: string | null;
  saveFavouriteRadioStations: (stations: station[]) => Promise<void>;
  toggleFavouriteRadioStation: (station: station) => Promise<void>;
  isFavouriteRadioStation: (station: station) => boolean;
};

const FavouriteStationsContext = createContext<FavouriteStationsContextValue | null>(null);

export function FavouriteStationsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [favouriteRadioStations, setFavouriteRadioStations] = useState<
    station[] | null
  >(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadFavouriteRadioStations();
  }, [loadFavouriteRadioStations]);

  const loadFavouriteRadioStations = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const value = await AsyncStorage.getItem(SECURE_FAVOURITE_STATIONS_KEY);
      if (!value) {
        setFavouriteRadioStations(null);
      } else {
        const parsed = JSON.parse(value) as station[];
        setFavouriteRadioStations(parsed);
      }
      return value ? (JSON.parse(value) as station[]) : null;
    } catch (err) {
      console.error("Failed to load favourite radio stations", err);
      setError("Failed to load favourite radio stations");
      setFavouriteRadioStations(null);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveFavouriteRadioStations = useCallback(async (stations: station[]) => {
    setIsLoading(true);
    setError(null);
    try {
      await AsyncStorage.setItem(
        SECURE_FAVOURITE_STATIONS_KEY,
        JSON.stringify(stations)
      );
      setFavouriteRadioStations(stations);
    } catch (err) {
      console.error("Failed to store favourite radio stations", err);
      setError("Failed to store favourite radio stations");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const toggleFavouriteRadioStation = useCallback(
    async (station: station) => {
      const currentStations = favouriteRadioStations || [];
      const isAlreadyFavorite = currentStations.some(
        (s) => s.stationuuid === station.stationuuid
      );

      let updatedStations: station[];
      if (isAlreadyFavorite) {
        // Remove station if already in favorites
        updatedStations = currentStations.filter(
          (s) => s.stationuuid !== station.stationuuid
        );
      } else {
        // Add station to favorites
        updatedStations = [...currentStations, station];
      }

      await saveFavouriteRadioStations(updatedStations);
    },
    [favouriteRadioStations, saveFavouriteRadioStations]
  );

  const isFavouriteRadioStation = useCallback(
    (station: station) => {
      if (!favouriteRadioStations) return false;
      return favouriteRadioStations.some(
        (s) => s.stationuuid === station.stationuuid
      );
    },
    [favouriteRadioStations]
  );

  const value: FavouriteStationsContextValue = {
    favouriteRadioStations,
    isLoading,
    error,
    saveFavouriteRadioStations,
    toggleFavouriteRadioStation,
    isFavouriteRadioStation,
  };

  return (
    <FavouriteStationsContext.Provider value={value}>
      {children}
    </FavouriteStationsContext.Provider>
  );
}

export function useFavouriteStations() {
  const context = useContext(FavouriteStationsContext);
  if (!context) {
    throw new Error(
      "useFavouriteStations must be used within FavouriteStationsProvider"
    );
  }
  return context;
}
