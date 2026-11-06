import React from "react";
import {
  Pressable,
  Text,
  type PressableProps,
  type TextStyle,
  type ViewStyle,
} from "react-native";
import { useTheme } from "../../theme/useTheme";
import { createVariants } from "../../lib/variants";
import { radius, spacing } from "@rnative/tokens";

export const buttonVariants = createVariants({
  base: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.md,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
  } as ViewStyle,
  variants: {
    variant: {
      default: {} as ViewStyle,
      secondary: {} as ViewStyle,
      outline: { borderWidth: 1 } as ViewStyle,
      ghost: {} as ViewStyle,
      destructive: {} as ViewStyle,
    },
    size: {
      sm: { paddingHorizontal: spacing[3], paddingVertical: spacing[1.5] } as ViewStyle,
      default: {} as ViewStyle,
      lg: { paddingHorizontal: spacing[6], paddingVertical: spacing[3] } as ViewStyle,
      icon: { paddingHorizontal: spacing[2], paddingVertical: spacing[2] } as ViewStyle,
    },
  },
  defaultVariants: { variant: "default", size: "default" },
});

export type ButtonProps = PressableProps & {
  variant?: "default" | "secondary" | "outline" | "ghost" | "destructive";
  size?: "sm" | "default" | "lg" | "icon";
  label?: string;
  children?: React.ReactNode;
};

export function Button({
  variant = "default",
  size = "default",
  label,
  children,
  style,
  ...props
}: ButtonProps) {
  const { theme } = useTheme();
  const c = theme.colors;

  const variantStyle: ViewStyle =
    variant === "default"
      ? { backgroundColor: c.primary }
      : variant === "secondary"
        ? { backgroundColor: c.secondary }
        : variant === "outline"
          ? { backgroundColor: "transparent", borderColor: c.border }
          : variant === "ghost"
            ? { backgroundColor: "transparent" }
            : { backgroundColor: c.destructive };

  const textStyle: TextStyle = {
    color:
      variant === "default"
        ? c.primaryForeground
        : variant === "secondary"
          ? c.secondaryForeground
          : variant === "destructive"
            ? c.destructiveForeground
            : c.foreground,
    fontSize: 14,
    fontWeight: "500",
  };

  return (
    <Pressable
      style={({ pressed }) => [
        buttonVariants({ variant, size }),
        variantStyle,
        pressed && { opacity: 0.8 },
        style as any,
      ]}
      {...props}
    >
      {label ? <Text style={textStyle}>{label}</Text> : null}
      {children}
    </Pressable>
  );
}