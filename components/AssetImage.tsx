import { useAssets } from "expo-asset";
import { Image } from "expo-image";

const imageMap: Record<string, any> = {
  "icon.png": require("@/assets/images/icon.png"),
};

const AssetImage = ({ path, style }: { path: any; style?: any }) => {
  const imageSource = imageMap[path];
  const [assets] = useAssets(imageSource ? [imageSource] : []);
  return <Image source={imageSource} style={style} />;
};

export default AssetImage;
