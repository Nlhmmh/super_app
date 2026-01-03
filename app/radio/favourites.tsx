import BackBtnWithTitle from "@/components/BackBtnWithTitle";
import CustomScrollView from "@/components/CustomScrollView";
import NoData from "@/components/NoData";
import StationCard from "@/components/radio/StationCard";
import { ThemedView } from "@/components/ThemedView";
import { useFavouriteStations } from "@/contexts/FavouriteStationsContext";
import { useTheme } from "@/theme/ThemeContext";
import { station } from "@/utils/models";
import { useCommonStyles } from "@/utils/useCommonStyles";
import { router } from "expo-router";

const RadioFavouritesPage = () => {
  const theme = useTheme();
  const commonStyles = useCommonStyles();
  const { favouriteRadioStations } = useFavouriteStations();

  const onPressStation = (station: station) => {
    router.push(`/radio/${station.stationuuid}`);
  };

  return (
    <ThemedView style={{ flex: 1 }} useTheme>
      <BackBtnWithTitle title="Radio Favourites" />
      <ThemedView style={{ flex: 1, padding: 12 }}>
        <CustomScrollView childGrow>
          <ThemedView
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            {favouriteRadioStations?.length > 0 &&
              favouriteRadioStations?.map((station, index) => {
                return (
                  <StationCard
                    key={index}
                    station={station}
                    onPress={async () => onPressStation(station)}
                  />
                );
              })}
          </ThemedView>
          {(!favouriteRadioStations || favouriteRadioStations?.length === 0) && (
            <NoData text="No Favourite Radio Stations" />
          )}
        </CustomScrollView>
      </ThemedView>
    </ThemedView>
  );
};

export default RadioFavouritesPage;
