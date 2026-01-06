import { useTheme } from "@/theme/ThemeContext";
import { labelValuePair } from "@/utils/models";
import { useCommonStyles } from "@/utils/useCommonStyles";
import Checkbox from "expo-checkbox";
import { ScrollView, TouchableOpacity } from "react-native";
import Pad from "./Pad";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";

const SelectBox = ({
  title,
  options,
  sel,
  setSel,
  isScrollable = false,
  isWrap = false,
  height,
}: {
  title?: string;
  options: labelValuePair[];
  sel: labelValuePair | null | undefined;
  setSel: (val: labelValuePair) => void;
  isScrollable?: boolean;
  isWrap?: boolean;
  height?: number;
}) => {
  const { theme } = useTheme();
  return (
    <ThemedView>
      {title && (
        <>
          <ThemedText bold style={{ color: theme.text }}>
            {title}
          </ThemedText>
          <Pad height={8} />
        </>
      )}
      {isScrollable ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          // contentContainerStyle={{ maxWidth: "1000%" }}
          style={{ maxHeight: height }}
        >
          <ScrollView
            showsHorizontalScrollIndicator={true}
            showsVerticalScrollIndicator={true}
          >
            <SelectBoxContent
              options={options}
              sel={sel}
              setSel={setSel}
              isWrap={true}
            />
          </ScrollView>
        </ScrollView>
      ) : (
        <SelectBoxContent
          options={options}
          sel={sel}
          setSel={setSel}
          isWrap={isWrap}
        />
      )}
    </ThemedView>
  );
};

const SelectBoxContent = ({
  options,
  sel,
  setSel,
  isWrap = false,
}: {
  options: labelValuePair[];
  sel: labelValuePair | null | undefined;
  setSel: (val: labelValuePair) => void;
  isWrap?: boolean;
}) => {
  return (
    <ThemedView
      style={{
        gap: 8,
        flexDirection: "row",
        flexWrap: isWrap ? "wrap" : "nowrap",
      }}
    >
      {options.map((v, index) => (
        <SelectCard
          key={index}
          option={v}
          isChecked={sel?.value === v.value}
          onPress={() => setSel(v)}
        />
      ))}
    </ThemedView>
  );
};

const SelectCard = ({
  option,
  isChecked,
  onPress,
}: {
  option: labelValuePair;
  isChecked: boolean;
  onPress: () => void;
}) => {
  const { theme } = useTheme();
  const commonStyles = useCommonStyles();
  return (
    <TouchableOpacity
      style={[
        {
          flexGrow: 1,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          backgroundColor: theme.secondaryContainer,
          borderRadius: 24,
          paddingHorizontal: 16,
          paddingVertical: 8,
          borderColor: isChecked ? theme.outline : "transparent",
          borderWidth: 1,
        },
        isChecked ? commonStyles.lightShadow : null,
      ]}
      activeOpacity={0.8}
      onPress={() => onPress()}
    >
      <Checkbox
        style={{
          width: 16,
          height: 16,
          borderRadius: 16,
          borderColor: theme.outline,
        }}
        color={isChecked ? theme.outline : undefined}
        value={isChecked}
        onValueChange={() => onPress()}
      />
      <ThemedText
        subBold
        style={{
          color: isChecked
            ? theme.onSurfaceVariant
            : theme.onSecondaryContainer,
        }}
      >
        {option.label}
      </ThemedText>
    </TouchableOpacity>
  );
};

export default SelectBox;
