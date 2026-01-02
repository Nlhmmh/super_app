import BackBtnWithTitle from "@/components/BackBtnWithTitle";
import CustomScrollView from "@/components/CustomScrollView";
import StationCard from "@/components/radio/StationCard";
import { ThemedView } from "@/components/ThemedView";
import { useUser } from "@/contexts/UserContext";
import { useCommonStyles } from "@/utils/useCommonStyles";
import { useTheme } from "@react-navigation/native";
import { router } from "expo-router";

const RadioFavouritesPage = () => {
  const theme = useTheme();
  const commonStyles = useCommonStyles();
  const { favouriteRadioStations } = useUser();

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
            {favouriteRadioStations.length > 0 &&
              favouriteRadioStations.map((station, index) => {
                return (
                  <StationCard
                    key={index}
                    station={station}
                    onPress={async () => onPressStation(station)}
                  />
                );
              })}
          </ThemedView>
          {favouriteRadioStations.length === 0 && !error && <NoData />}
        </CustomScrollView>
      </ThemedView>
    </ThemedView>
  );
};

export default RadioFavouritesPage;
