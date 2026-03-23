import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    <>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: "modal" }} />
        <Stack.Screen
          name="wheel"
          options={{
            title: "Roda da Sorte",
            headerStyle: { backgroundColor: "#050a2e" },
            headerTintColor: "#FFD700",
            headerTitleStyle: { fontWeight: "bold" },
          }}
        />
        <Stack.Screen
          name="game"
          options={{
            title: "Runner",
            headerStyle: { backgroundColor: "#0a0a1e" },
            headerTintColor: "#00eeff",
            headerTitleStyle: { fontWeight: "bold" },
          }}
        />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}
