import { TextType, ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useTheme } from "@/theme/ThemeContext";

const InfoCard = ({
  title,
  info,
  link,
  oneLineMode,
  openLink,
}: {
  title: string;
  info: string | null | undefined;
  link?: string;
  oneLineMode?: boolean;
  openLink?: boolean;
}) => {
  const { theme } = useTheme();
  return (
    <ThemedView style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
      <ThemedText
        type={TextType.M}
        bold
        style={{ flex: 1, alignSelf: "flex-start" }}
      >
        {title}
      </ThemedText>
      <ThemedText
        type={
          link ? (openLink ? TextType.OPEN_LINK : TextType.LINK) : TextType.M
        }
        link={link || undefined}
        style={{ flex: 2 }}
        oneLineMode={oneLineMode}
      >
        {info}
      </ThemedText>
    </ThemedView>
  );
};

export default InfoCard;
