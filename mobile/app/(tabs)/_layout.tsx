import { Tabs } from "expo-router";
import { useState } from "react";

import { AppHeader } from "../../components/layout/AppHeader";
import { BottomBar } from "../../components/layout/BottomBar";

const TABS_WITHOUT_HEADER = new Set(["support"]);
const TABS_WITHOUT_SEARCH = new Set(["profile"]);

export default function TabsLayout() {
  const [activeTab, setActiveTab] = useState("index");

  const showHeader = !TABS_WITHOUT_HEADER.has(activeTab);
  const compact = !TABS_WITHOUT_SEARCH.has(activeTab);

  return (
    <>
      {showHeader && <AppHeader compact={compact} />}
      <Tabs
        tabBar={(props) => <BottomBar {...props} />}
        screenOptions={{ headerShown: false }}
        screenListeners={{
          state: (e) => {
            const routes = e.data?.state?.routes;
            const index = e.data?.state?.index;
            if (routes && index != null) {
              setActiveTab(routes[index].name);
            }
          },
        }}
      >
        <Tabs.Screen name="index" />
        <Tabs.Screen name="prizes" />
        <Tabs.Screen name="history" />
        <Tabs.Screen name="support" />
        <Tabs.Screen name="profile" />
      </Tabs>
    </>
  );
}
