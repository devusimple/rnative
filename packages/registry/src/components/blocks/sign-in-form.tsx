import React, { useState } from "react";
import { View, Text, type ViewStyle } from "react-native";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useTheme } from "../../theme/useTheme";
import { spacing } from "@rnative/tokens";

export type SignInFormProps = {
  onSubmit?: (email: string, password: string) => void;
  style?: ViewStyle;
};

export function SignInForm({ onSubmit, style }: SignInFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { theme } = useTheme();

  return (
    <View style={[{ gap: spacing[3] }, style]}>
      <Text style={{ fontSize: 20, fontWeight: "600", color: theme.colors.foreground }}>
        Sign in
      </Text>
      <Input
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <Input
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        secureTextEntry
      />
      <Button label="Continue" onPress={() => onSubmit?.(email, password)} />
    </View>
  );
}