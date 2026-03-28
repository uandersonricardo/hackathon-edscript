import { Colors } from "@/constants/theme";
import { Link, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import PagerView from "react-native-pager-view";

const slides = [
  {
    route: "/deposit" as const,
    image: require("../../assets/elements/eds_vip.png"),
    titleColor: "#FFFFFF",
  },
  {
    route: "/deposit" as const,
    image: require("../../assets/elements/eds_vip_1.png"),
    titleColor: "#FFFFFF",
  },
  {
    route: "/deposit" as const,
    image: require("../../assets/elements/eds_vip_2.png"),
    titleColor: "#FFFFFF",
  },
  {
    route: "/deposit" as const,
    image: require("../../assets/elements/eds_vip_3.png"),
    titleColor: "#FFFFFF",
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
        {slides.map((slide, index) => (
          <View key={index} style={styles.carouselFixedOuter}>
            <Link href={slide.route} asChild>
              <TouchableOpacity style={styles.carouselFixedInner} activeOpacity={0.85}>
                <Image source={slide.image} style={styles.carouselImage} resizeMode="cover" />
              </TouchableOpacity>
            </Link>
          </View>
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
    flex: 1,
  },
  pager: {
    height: 90,
    width: "100%",
  },
  slide: {
    flex: 1,
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
  carouselFixedOuter: {
    marginHorizontal: 3,
  },
  carouselFixedInner: {},
  carouselImage: {
    height: 90,
    width: "100%",
    borderRadius: 15,
    borderWidth: 1.5,
    borderColor: Colors.dark.tertiaryStroke,
    backgroundColor: Colors.dark.background,
    overflow: "hidden",
  },
});
