import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";

import { AuthProvider } from "../contexts/AuthContext";
import { SearchProvider } from "../contexts/SearchContext";
import { BetSlipProvider } from "../contexts/BetSlipContext";
import { BetSlipButton } from "../components/home/BetSlipButton";
import { Colors } from "../constants/theme";

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SearchProvider>
          <BetSlipProvider>
            <View style={{ flex: 1 }}>
              <Stack>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="login" options={{ headerShown: false }} />
                <Stack.Screen name="register" options={{ headerShown: false }} />
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
                <Stack.Screen name="deposit" options={{ headerShown: false }} />
                <Stack.Screen name="ranking" options={{ headerShown: false }} />
                <Stack.Screen name="play" options={{ headerShown: false }} />
                <Stack.Screen name="notifications" options={{ headerShown: false }} />
              </Stack>
              <StatusBar style="inverted" />
              <BetSlipButton />
            </View>
          </BetSlipProvider>
        </SearchProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
