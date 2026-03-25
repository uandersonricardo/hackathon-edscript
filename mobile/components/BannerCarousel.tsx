import { Colors } from "@/constants/theme";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import PagerView from "react-native-pager-view";

const slides = [
  {
    route: "/wheel" as const,
    title: "🎡 Roda da Sorte",
    subtitle: "Gire e ganhe prêmios!",
    titleColor: "#FFD700",
  },
  {
    route: "/game" as const,
    title: "🏃 Runner",
    subtitle: "Swipe to dodge obstacles!",
    titleColor: "#00eeff",
  },
];

export function BannerCarousel() {
  const router = useRouter();
  const pagerRef = useRef<PagerView>(null);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPage((prev) => {
        const next = (prev + 1) % slides.length;
        pagerRef.current?.setPage(next);
        return next;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.wrapper}>
      <PagerView
        ref={pagerRef}
        style={styles.pager}
        initialPage={0}
        onPageSelected={(e) => setCurrentPage(e.nativeEvent.position)}
      >
        {slides.map((slide) => (
          <TouchableOpacity
            key={slide.route}
            style={styles.slide}
            onPress={() => router.push(slide.route)}
            activeOpacity={0.85}
          >
            <Text style={[styles.title, { color: slide.titleColor }]}>{slide.title}</Text>
            <Text style={styles.subtitle}>{slide.subtitle}</Text>
          </TouchableOpacity>
        ))}
      </PagerView>
      <View style={styles.dots}>
        {slides.map((_, i) => (
          <View key={i} style={[styles.dot, i === currentPage && styles.dotActive]} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  pager: {
    height: 90,
    borderRadius: 12,
    overflow: "hidden",
  },
  slide: {
    flex: 1,
    backgroundColor: "#0a0a1e",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#00eeff44",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 13,
    color: "#aab4c8",
    marginTop: 4,
  },
  dots: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 8,
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.dark.textMuted,
    opacity: 0.5,
  },
  dotActive: {
    backgroundColor: Colors.dark.primary,
    opacity: 1,
  },
});
