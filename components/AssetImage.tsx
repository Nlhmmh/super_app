import { Image, ImageProps } from "expo-image";

const imageMap: Record<string, any> = {
  "icon.png": require("@/assets/images/icon.png"),
  "icon_bright.png": require("@/assets/images/icon_bright.png"),
  "old_icon.png": require("@/assets/images/old_icon.png"),
  "transparent_bird.png": require("@/assets/images/transparent_bird.png"),
};

const AssetImage = ({ path, style, ...props }: ImageProps & { path: any }) => {
  const imageSource = imageMap[path];
  return <Image source={imageSource} style={style} {...props} />;
};

export default AssetImage;
