import { View } from "react-native";

export default function Pad({ height = 10 }: { height?: number }) {
  return <View style={{ height: height }} />;
}
