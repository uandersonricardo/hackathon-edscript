import { useEffect, useRef } from "react";
import { Animated, ScrollView, StyleSheet, View } from "react-native";

import { Colors } from "@/constants/theme";

function SkeletonBox({ width, height, style }: { width?: number | `${number}%`; height: number; style?: object }) {
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.85, duration: 800, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.4, duration: 800, useNativeDriver: true }),
      ]),
    );
    anim.start();
    return () => anim.stop();
  }, []);

  return <Animated.View style={[{ width, height, borderRadius: 10, backgroundColor: Colors.dark.inputBackground, opacity }, style]} />;
}

function SectionSkeleton({ cardHeight = 99, cardWidth = 163 }: { cardHeight?: number; cardWidth?: number }) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <SkeletonBox width={150} height={20} />
        <SkeletonBox width={60} height={14} />
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hScroll} scrollEnabled={false}>
        {[0, 1, 2, 3].map((i) => (
          <SkeletonBox key={i} width={cardWidth} height={cardHeight} style={{ marginRight: 8 }} />
        ))}
      </ScrollView>
    </View>
  );
}

function FixtureSectionSkeleton() {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <SkeletonBox width={170} height={20} />
        <SkeletonBox width={60} height={14} />
      </View>
      {[0, 1, 2].map((i) => (
        <SkeletonBox key={i} height={90} style={styles.fixtureSkeleton} />
      ))}
    </View>
  );
}

export function HomeScreenSkeleton() {
  return (
    <View style={styles.root}>
      <SkeletonBox height={80} style={styles.topWin} />
      <FixtureSectionSkeleton />
      <SectionSkeleton cardHeight={139} cardWidth={120} />
      <SectionSkeleton cardHeight={139} cardWidth={120} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  topWin: {
    marginHorizontal: 16,
    marginVertical: 12,
  },
  section: {
    marginTop: 8,
    marginBottom: 8,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 16,
    marginBottom: 14,
  },
  hScroll: {
    paddingHorizontal: 16,
  },
  fixtureSkeleton: {
    marginHorizontal: 16,
    marginBottom: 10,
    borderRadius: 15,
  },
});
