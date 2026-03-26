import { StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { Colors } from "@/constants/theme";
import { useSearch } from "@/contexts/SearchContext";
import { HomeScreen } from "@/components/home/HomeScreen";
import { CasinoScreen } from "@/components/home/CasinoScreen";
import { LiveCasinoScreen } from "@/components/home/LiveCasinoScreen";
import { VirtualsScreen } from "@/components/home/VirtualsScreen";
import { FixturesScreen } from "@/components/home/FixturesScreen";

function ActiveScreen({ category }: { category: string | null }) {
  switch (category) {
    case "Cassino":
      return <CasinoScreen />;
    case "Cassino ao vivo":
      return <LiveCasinoScreen />;
    case "Virtuais":
      return <VirtualsScreen />;
    case "Esportes":
      return <FixturesScreen />;
    default:
      return <HomeScreen />;
  }
}

export default function Index() {
  const { activeCategory } = useSearch();

  return (
    <View style={styles.wrapper}>
      <ActiveScreen category={activeCategory} />
      <LinearGradient
        colors={[Colors.dark.background, `${Colors.dark.background}00`]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 0.4 }}
        style={styles.topFade}
        pointerEvents="none"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  topFade: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 40,
  },
});
