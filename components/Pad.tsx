import { View } from "react-native";

export type PadProps = {
  height: number;
};

export default function Pad({ height = 10 }: PadProps) {
  return <View style={{ height: height }} />;
}
