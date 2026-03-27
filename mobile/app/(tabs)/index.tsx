import { StyleSheet, View } from "react-native";

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
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
});
