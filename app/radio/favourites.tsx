import BackBtnWithTitle from "@/components/BackBtnWithTitle";
import CustomScrollView from "@/components/CustomScrollView";
import NoData from "@/components/NoData";
import StationCard from "@/components/radio/StationCard";
import { ThemedView } from "@/components/ThemedView";
import { useFavouriteStations } from "@/contexts/FavouriteStationsContext";
import { station } from "@/utils/models";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";

const RadioFavouritesPage = () => {
  const { t } = useTranslation();
  const { favouriteRadioStations } = useFavouriteStations();

  const onPressStation = (station: station) => {
    router.push(`/radio/${station.stationuuid}`);
  };

  return (
    <ThemedView style={{ flex: 1 }} useTheme>
      <BackBtnWithTitle title={t("radio.radio-favorites")} />
      <ThemedView style={{ flex: 1, padding: 12 }}>
        <CustomScrollView childGrow>
          <ThemedView
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            {favouriteRadioStations &&
              favouriteRadioStations?.length > 0 &&
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
          {(!favouriteRadioStations ||
            favouriteRadioStations?.length === 0) && (
            <NoData text={t("radio.no-favourites")} />
          )}
        </CustomScrollView>
      </ThemedView>
    </ThemedView>
  );
};

export default RadioFavouritesPage;
