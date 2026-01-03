import BackBtnWithTitle from "@/components/BackBtnWithTitle";
import CustomScrollView from "@/components/CustomScrollView";
import FilteredSelectionModal from "@/components/FilteredSelectionModal";
import Loading from "@/components/Loading";
import NoData from "@/components/NoData";
import Pad from "@/components/Pad";
import StationCard from "@/components/radio/StationCard";
import SearchBar from "@/components/SearchBar";
import { TextType, ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useUser } from "@/contexts/UserContext";
import { useTheme } from "@/theme/ThemeContext";
import { get, safeAPICall } from "@/utils/api";
import { COUNTRY_CODES, LANGUAGES } from "@/utils/constants";
import { labelValuePair, station } from "@/utils/models";
import { useCommonStyles } from "@/utils/useCommonStyles";
import { router } from "expo-router";
import { useCallback, useEffect, useState } from "react";

const RadioPage = () => {
  const theme = useTheme();
  const commonStyles = useCommonStyles();
  const { countryCode, saveCountryCode, languageCode, saveLanguageCode } =
    useUser();
  const [searchTerm, setSearchTerm] = useState("");
  const [stations, setStations] = useState<station[]>([]);
  const [currentStation, setCurrentStation] = useState<station | undefined>(
    undefined
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const [openCountryModal, setOpenCountryModal] = useState(false);
  const [selCountry, setSelCountry] = useState<labelValuePair | undefined>(
    undefined
  );
  const [openLanguageModal, setOpenLanguageModal] = useState(false);
  const [selLanguage, setSelLanguage] = useState<labelValuePair | undefined>(
    undefined
  );

  useEffect(() => {
    setOffset(0);
    setHasMore(true);
    const delayDebounceFn = setTimeout(() => {
      fetchStations(true);
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, selCountry, selLanguage]);

  useEffect(() => {
    if (!countryCode) return;
    setSelCountry(COUNTRY_CODES.find((v) => v.value === countryCode));
  }, [countryCode]);

  useEffect(() => {
    if (!languageCode) return;
    setSelLanguage(LANGUAGES.find((v) => v.value === languageCode));
  }, [languageCode]);

  useEffect(() => {
    setOpenCountryModal(false);
    saveCountryCode(selCountry?.value || "");
  }, [selCountry, saveCountryCode]);

  useEffect(() => {
    setOpenLanguageModal(false);
    saveLanguageCode?.(selLanguage?.value || "");
  }, [selLanguage, saveLanguageCode]);

  const fetchStations = useCallback(
    async (reset: boolean = false) => {
      if (!reset && loadingMore) return;
      if (!reset && !hasMore) return;

      safeAPICall({
        fn: async () => {
          setError(null);
          if (reset) {
            setLoading(true);
            setStations([]);
          } else {
            setLoadingMore(true);
          }

          const currentOffset = reset ? 0 : offset;
          const API_URL =
            "https://de2.api.radio-browser.info/json/stations/search";
          let url = `${API_URL}?limit=${limit}&offset=${currentOffset}&hidebroken=true&order=votes&reverse=true`;
          if (searchTerm.trim() !== "") url += `&name=${searchTerm}`;
          if (selCountry && selCountry.value !== "unselected") {
            url += `&countrycode=${selCountry.value}`;
          }
          if (selLanguage && selLanguage.value !== "unselected") {
            const langs = await get(
              `https://de2.api.radio-browser.info/json/languages`
            );
            const langObj = langs.find((l) => l.iso_639! === selLanguage.value);
            if (langObj) url += `&language=${langObj.name!}`;
          }
          const newStations = await get(url);
          if (!newStations) return;

          if (reset) {
            setStations(newStations);
          } else {
            setStations((prev) => [...prev, ...newStations]);
          }

          setHasMore(newStations.length === limit);
          if (!reset) {
            setOffset((prev) => prev + limit);
          }
        },
        catchCb: (error) => {
          setError(
            "Could not load radio stations. Please check the network or API."
          );
        },
        finallyCb: () => {
          setLoading(false);
          setLoadingMore(false);
        },
      });
    },
    [searchTerm, selCountry, selLanguage, offset, limit, hasMore, loadingMore]
  );

  const handleScroll = (event: any) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const paddingToBottom = 20;
    const isCloseToBottom =
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom;
    if (isCloseToBottom && !loadingMore && hasMore) {
      fetchStations(false);
    }
  };

  const onPressStation = (station: station) => {
    router.push(`/radio/${station.stationuuid}`);
  };

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
          onPressFavourites={() => router.push("/radio/favourites")}
        />
        <Pad height={16} />

        <CustomScrollView
          childGrow
          refreshing={refreshing}
          onRefresh={() => fetchStations(true)}
          onScroll={handleScroll}
          scrollEventThrottle={400}
        >
          <ThemedView
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            {stations.length > 0 &&
              stations.map((station, index) => {
                return (
                  <StationCard
                    key={station.stationuuid + index}
                    station={station}
                    onPress={async () => onPressStation(station)}
                  />
                );
              })}
          </ThemedView>
          {loading && <Loading />}
          {loadingMore && !loading && (
            <ThemedText style={{ textAlign: "center" }}>
              Loading more...
            </ThemedText>
          )}
          {error && <ThemedText type={TextType.ERROR}>{error}</ThemedText>}
          {!loading && stations.length === 0 && !error && <NoData />}
        </CustomScrollView>
      </ThemedView>
      <Pad height={16} />

      <FilteredSelectionModal
        open={openCountryModal}
        setOpen={setOpenCountryModal}
        title="Select Country"
        placeholder="Search Country"
        allOptions={COUNTRY_CODES}
        selectedValue={selCountry}
        onSelect={setSelCountry}
        defaultOption={COUNTRY_CODES[0]}
      />

      <FilteredSelectionModal
        open={openLanguageModal}
        setOpen={setOpenLanguageModal}
        title="Select Language"
        placeholder="Search Language"
        allOptions={LANGUAGES}
        selectedValue={selLanguage}
        onSelect={setSelLanguage}
        defaultOption={LANGUAGES[0]}
      />
    </ThemedView>
  );
};

export default RadioPage;
