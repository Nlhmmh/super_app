import { useTheme } from "@/theme/ThemeContext";
import { useCommonStyles } from "@/utils/useCommonStyles";
import { Ionicons } from "@expo/vector-icons";
import { Modal, Pressable, TouchableOpacity } from "react-native";
import CustomButton from "./CustomButton";
import Pad from "./Pad";
import { TextType, ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";

const CustomModal = ({
  open,
  onClose,
  icon,
  title,
  description,
  buttonTitle,
  buttonLoading,
  body,
  errMsg,
  onConfirm,
  flexStart = false,
  atBottom = false,
}: {
  open: boolean;
  onClose: () => void;
  icon?: string;
  title?: string;
  description?: string;
  buttonTitle?: string;
  buttonLoading?: boolean;
  body?: React.ReactNode;
  errMsg?: string;
  onConfirm?: () => void;
  flexStart?: boolean;
  atBottom?: boolean;
}) => {
  const theme = useTheme();
  const commonStyles = useCommonStyles();

  const atBottomStyle = {
    position: "absolute",
    bottom: 0,
    overflow: "hidden",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    width: "100%",
  };

  return (
    <Modal
      visible={open}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        }}
        activeOpacity={1}
        onPress={onClose}
      >
        <Pressable
          onPress={(e) => e.stopPropagation()}
          style={{
            backgroundColor: theme.background,
            padding: 16,
            alignItems: flexStart ? undefined : "center",
            ...(atBottom
              ? atBottomStyle
              : { borderRadius: 32, width: "95%", maxHeight: "80%" }),
            ...commonStyles.shadow,
          }}
        >
          {icon && (
            <>
              <Ionicons name={icon} size={42} color={theme.background} />
              <Pad height={16} />
            </>
          )}
          {title && (
            <>
              <ThemedText bold type={TextType.XL}>
                {title}
              </ThemedText>
              <Pad height={8} />
            </>
          )}
          {description && (
            <>
              <ThemedText
                subBold
                type={TextType.SM}
                style={{ width: "60%", textAlign: "center" }}
              >
                {description}
              </ThemedText>
              <Pad height={24} />
            </>
          )}
          {body && <ThemedView style={{ flexShrink: 1 }}>{body}</ThemedView>}
          {errMsg && (
            <>
              <ThemedText
                type={TextType.SM}
                style={{ color: theme.error, textAlign: "center" }}
              >
                {errMsg}
              </ThemedText>
            </>
          )}
          {buttonTitle && (
            <>
              <Pad height={16} />
              <CustomButton
                title={buttonTitle}
                stretch
                large
                onPress={onConfirm ? onConfirm : onClose}
                loading={buttonLoading}
                disabled={buttonLoading}
              />
            </>
          )}
        </Pressable>
      </TouchableOpacity>
    </Modal>
  );
};

export default CustomModal;
