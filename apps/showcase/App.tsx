import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { ThemeProvider, Button, SignInForm } from "@rnative/core";

export default function App() {
  return (
    <ThemeProvider>
      <View style={styles.container}>
        <Text style={styles.title}>rnative showcase</Text>
        <Button label="Primary" />
        <SignInForm onSubmit={(e, p) => console.log(e, p)} />
      </View>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, gap: 16, justifyContent: "center" },
  title: { fontSize: 22, fontWeight: "700" },
});