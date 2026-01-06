import BackBtnWithTitle from "@/components/BackBtnWithTitle";
import CustomScrollView from "@/components/CustomScrollView";
import FilteredSelectionModal from "@/components/FilteredSelectionModal";
import Loading from "@/components/Loading";
import NoData from "@/components/NoData";
import Pad from "@/components/Pad";
import StationCard from "@/components/radio/StationCard";
import SearchBar from "@/components/SearchBar";
import SelectBox from "@/components/SelectBox";
import { TextType, ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useCountryCode } from "@/contexts/CountryCodeContext";
import { useLanguageCode } from "@/contexts/LanguageCodeContext";
import { get, safeAPICall } from "@/utils/api";
import {
  COUNTRY_CODES,
  LANGUAGES,
  RADIO_API_BASE_URL,
} from "@/utils/constants";
import { labelValuePair, station } from "@/utils/models";
import { useCommonStyles } from "@/utils/useCommonStyles";
import { router } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const RadioPage = () => {
  const { t } = useTranslation();
  const commonStyles = useCommonStyles();
  const { countryCode, saveCountryCode } = useCountryCode();
  const { languageCode, saveLanguageCode } = useLanguageCode();
  const [searchTerm, setSearchTerm] = useState("");
  const [stations, setStations] = useState<station[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [tags, setTags] = useState<labelValuePair[]>([]);
  const [selTag, setSelTag] = useState<labelValuePair | null>(null);
  const [openCountryModal, setOpenCountryModal] = useState(false);
  const [selCountry, setSelCountry] = useState<labelValuePair | undefined>(
    undefined
  );
  const [openLanguageModal, setOpenLanguageModal] = useState(false);
  const [selLanguage, setSelLanguage] = useState<labelValuePair | undefined>(
    undefined
  );

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
          const API_URL = `${RADIO_API_BASE_URL}/stations/search`;
          let url = `${API_URL}?limit=${limit}&offset=${currentOffset}&hidebroken=true&order=votes&reverse=true`;
          if (searchTerm.trim() !== "") url += `&name=${searchTerm}`;
          if (selCountry && selCountry.value !== "unselected") {
            url += `&countrycode=${selCountry.value}`;
          }
          if (selLanguage && selLanguage.value !== "unselected") {
            const langs: any[] = await get(`${RADIO_API_BASE_URL}/languages`);
            const langObj = langs.find((l) => l.iso_639! === selLanguage.value);
            if (langObj) url += `&language=${langObj.name!}`;
          }
          if (selTag) {
            url += `&tag=${selTag.value}`;
          }
          const newStations: station[] = await get(url);
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
          setError(t("radio.api-error"));
        },
        finallyCb: () => {
          setLoading(false);
          setLoadingMore(false);
        },
      });
    },
    [
      searchTerm,
      selCountry,
      selLanguage,
      selTag,
      offset,
      limit,
      hasMore,
      loadingMore,
    ]
  );

  const fetchTags = useCallback(async () => {
    safeAPICall({
      fn: async () => {
        const tags: any[] = await get(
          `${RADIO_API_BASE_URL}/tags?order=stationcount&hidebroken=true&limit=100`
        );
        if (tags) {
          const tagNames: labelValuePair[] = tags.map((tag: any) => {
            return { label: tag.name, value: tag.name } as labelValuePair;
          });
          setTags(tagNames);
        }
      },
      catchCb: (error) => {
        console.error("Error fetching tags:", error);
      },
    });
  }, []);

  const handleScroll = (event: any) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const paddingToBottom = 200;
    const isCloseToBottom =
      Math.ceil(layoutMeasurement.height + contentOffset.y) >=
      contentSize.height - (paddingToBottom * (offset || 20)) / limit;
    if (isCloseToBottom && !loadingMore && hasMore) {
      fetchStations(false);
    }
  };

  const onPressStation = (station: station) => {
    router.push(`/radio/${station.stationuuid}`);
  };

  useEffect(() => {
    fetchTags();
  }, [fetchTags]);

  useEffect(() => {
    setOffset(0);
    setHasMore(true);
    const delayDebounceFn = setTimeout(() => {
      fetchStations(true);
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, selCountry, selLanguage, selTag]);

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

  return (
    <ThemedView style={{ flex: 1 }} useTheme>
      <BackBtnWithTitle title={t("home.radio")} />

      <ThemedView style={{ flex: 1, padding: 12 }}>
        <SearchBar
          placeholder={t("radio.search-stations")}
          searchText={searchTerm}
          setSearchText={setSearchTerm}
          onPressCountryOptions={() => setOpenCountryModal(true)}
          onPressLanguageOptions={() => setOpenLanguageModal(true)}
          onPressFavourites={() => router.push("/radio/favourites")}
        />
        <Pad height={16} />
        <ThemedView
          style={{
            ...commonStyles.shadow,
          }}
        >
          <SelectBox
            options={tags}
            sel={selTag}
            setSel={setSelTag}
            isScrollable
            isWrap
          />
        </ThemedView>
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
            <ThemedText style={{ textAlign: "center", marginTop: 8 }}>
              {t("radio.loading-more")}
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
        title={t("radio.select-country")}
        placeholder={t("radio.search-country")}
        allOptions={COUNTRY_CODES}
        selectedValue={selCountry}
        onSelect={setSelCountry}
        defaultOption={COUNTRY_CODES[0]}
      />

      <FilteredSelectionModal
        open={openLanguageModal}
        setOpen={setOpenLanguageModal}
        title={t("radio.select-language")}
        placeholder={t("radio.search-language")}
        allOptions={LANGUAGES}
        selectedValue={selLanguage}
        onSelect={setSelLanguage}
        defaultOption={LANGUAGES[0]}
      />
    </ThemedView>
  );
};

export default RadioPage;
