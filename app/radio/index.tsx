import AssetImage from "@/components/AssetImage";
import BackBtnWithTitle from "@/components/BackBtnWithTitle";
import CustomModal from "@/components/CustomModal";
import CustomScrollView from "@/components/CustomScrollView";
import Loading from "@/components/Loading";
import NoData from "@/components/NoData";
import Pad from "@/components/Pad";
import PriorityImage from "@/components/PriorityImage";
import SearchBar from "@/components/SearchBar";
import SelectBox from "@/components/SelectBox";
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
import { TouchableOpacity } from "react-native";

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
  const [openCountryModal, setOpenCountryModal] = useState(false);
  const [selCountry, setSelCountry] = useState<labelValuePair | undefined>(
    undefined
  );
  const [openLanguageModal, setOpenLanguageModal] = useState(false);
  const [selLanguage, setSelLanguage] = useState<labelValuePair | undefined>(
    undefined
  );

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchStations();
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
    saveCountryCode(selCountry?.value || "");
    setOpenCountryModal(false);
  }, [selCountry]);

  useEffect(() => {
    saveLanguageCode?.(selLanguage?.value || "");
    setOpenLanguageModal(false);
  }, [selLanguage, saveLanguageCode]);

  const fetchStations = useCallback(async () => {
    safeAPICall({
      fn: async () => {
        setError(null);
        setLoading(true);
        setStations([]);
        const API_URL =
          "https://de2.api.radio-browser.info/json/stations/search";
        let url = `${API_URL}?limit=${40}&hidebroken=true&order=votes&reverse=true`;
        if (searchTerm.trim() !== "") url += `&name=${searchTerm}`;
        if (selCountry && selCountry.value !== "unselected") {
          url += `&countrycode=${selCountry.value}`;
        }
        if (selLanguage && selLanguage.value !== "unselected") {
          url += `&languagecodes=${selLanguage.value}`;
        }
        const stations = await get(url);
        if (!stations) return;
        setStations(stations);
      },
      catchCb: (error) => {
        setError(
          "Could not load radio stations. Please check the network or API."
        );
      },
      finallyCb: () => {
        setLoading(false);
      },
    });
  }, [searchTerm, selCountry, selLanguage]);

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
                    onPress={async () => onPressStation(station)}
                  />
                );
              })}
          </ThemedView>
          {loading && <Loading />}
          {error && <ThemedText type={TextType.ERROR}>{error}</ThemedText>}
          {!loading && stations.length === 0 && !error && <NoData />}
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
}: {
  station: station;
  disabled?: boolean;
  onPress: () => void;
}) => {
  const theme = useTheme();
  const commonStyles = useCommonStyles();
  const [pressed, setPressed] = useState(false);

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
          flexDirection: "row",
          gap: 8,
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
      {station.favicon ? (
        <PriorityImage
          source={{ uri: station.favicon }}
          style={{ width: 80, height: 80, borderRadius: 16 }}
        />
      ) : (
        <AssetImage
          path="icon.png"
          style={{ width: 80, height: 80, borderRadius: 16 }}
        />
      )}
      <ThemedView>
        <ThemedText type={TextType.L}>{station.name}</ThemedText>
        <ThemedText>
          {station.country} | {station.language}
        </ThemedText>
        <ThemedText>Votes: {station.votes}</ThemedText>
      </ThemedView>
    </TouchableOpacity>
  );
};

export default RadioPage;
