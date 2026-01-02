import { Image, ImageProps } from "expo-image";
import { useState } from "react";
import { TextType, ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";

const PriorityImage = ({
  source,
  style,
  ...props
}: ImageProps & {
  source: { uri: string };
  style?: object;
}) => {
  const [error, setError] = useState<boolean>(false);
  return (
    <ThemedView
      style={[style, { alignItems: "center", justifyContent: "center" }]}
    >
      {!error && (
        <Image
          source={source}
          style={style}
          cachePolicy="memory-disk"
          contentFit="cover"
          recyclingKey={`${source.uri}`}
          priority="high"
          onError={() => setError(true)}
          {...props}
        />
      )}
      {error && (
        <ThemedText type={TextType.ERROR}>No Image</ThemedText>
      )}
    </ThemedView>
  );
};

export default PriorityImage;
