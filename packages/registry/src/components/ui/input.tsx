import React from "react";
import { TextInput, type TextInputProps, type ViewStyle } from "react-native";
import { useTheme } from "../../theme/useTheme";
import { radius, spacing } from "@rnative/tokens";

export type InputProps = TextInputProps & {
  containerStyle?: ViewStyle;
};

export function Input({ containerStyle, style, ...props }: InputProps) {
  const { theme } = useTheme();
  const c = theme.colors;

  return (
    <TextInput
      placeholderTextColor={c.mutedForeground}
      style={[
        {
          height: 40,
          borderWidth: 1,
          borderColor: c.input,
          borderRadius: radius.md,
          paddingHorizontal: spacing[3],
          color: c.foreground,
          backgroundColor: c.background,
          fontSize: 14,
        },
        style,
      ]}
      {...props}
    />
  );
}