import BackBtnWithTitle from "@/components/BackBtnWithTitle";
import CustomScrollView from "@/components/CustomScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

const RadioPage = () => {
  return (
    <ThemedView style={{ flex: 1 }} useTheme>
      <BackBtnWithTitle title="Radio" />
      <CustomScrollView>
        <ThemedText>Radio Page</ThemedText>
      </CustomScrollView>
    </ThemedView>
  );
};

export default RadioPage;
