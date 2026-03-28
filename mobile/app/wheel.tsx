import { useRef, useState } from "react";
import {
  Animated,
  Easing,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const SEGMENTS = [
  "ATÉ A PRÓXIMA",
  "3 GIROS",
  "100 GIROS",
  "15 GIROS",
  "IPHONE 17",
  "150 GIROS",
  "100 REAIS",
  "10 GIROS",
  "1 MILHÃO DE REAIS",
  "10 GIROS",
];

const SEGMENT_ANGLE = 360 / SEGMENTS.length; // 36 degrees
const FULL_ROTATIONS = 8;

export default function WheelScreen() {
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const rotationValue = useRef(new Animated.Value(0)).current;
  const accumulatedValue = useRef(0);

  const spin = () => {
    if (spinning) return;

    setSpinning(true);
    setResult(null);

    const targetSegment = Math.floor(Math.random() * SEGMENTS.length);
    const targetAngle =
      ((SEGMENTS.length - targetSegment) % SEGMENTS.length) * SEGMENT_ANGLE;
    // Small random offset within the segment so it doesn't always stop exactly at center
    const withinSegmentOffset = (Math.random() - 0.5) * (SEGMENT_ANGLE - 8);
    const totalDegrees =
      FULL_ROTATIONS * 360 + targetAngle + withinSegmentOffset;

    accumulatedValue.current += totalDegrees / 360;

    Animated.timing(rotationValue, {
      toValue: accumulatedValue.current,
      duration: 5000,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) {
        setSpinning(false);
        setResult(SEGMENTS[targetSegment]);
      }
    });
  };

  const rotation = rotationValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
    extrapolate: "extend",
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Roda da Sorte</Text>

      <View style={styles.wheelWrapper}>
        {/* Fixed pointer at the top */}
        <View style={styles.pointerContainer}>
          <View style={styles.pointer} />
        </View>

        {/* Spinning wheel image */}
        <Animated.Image
          source={require("../assets/images/wheel.png")}
          style={[styles.wheel, { transform: [{ rotate: rotation }] }]}
          resizeMode="contain"
        />
      </View>

      {result && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultLabel}>Você ganhou:</Text>
          <Text style={styles.resultText}>{result}</Text>
        </View>
      )}

      {!result && !spinning && (
        <View style={styles.resultPlaceholder} />
      )}

      <TouchableOpacity
        style={[styles.button, spinning && styles.buttonDisabled]}
        onPress={spin}
        disabled={spinning}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>
          {spinning ? "GIRANDO..." : "GIRAR"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const WHEEL_SIZE = 320;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#050a2e",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFD700",
    marginBottom: 32,
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  wheelWrapper: {
    width: WHEEL_SIZE,
    height: WHEEL_SIZE,
    alignItems: "center",
    justifyContent: "center",
  },
  pointerContainer: {
    position: "absolute",
    top: -14,
    zIndex: 10,
    alignItems: "center",
  },
  // Downward-pointing triangle
  pointer: {
    width: 0,
    height: 0,
    borderLeftWidth: 14,
    borderRightWidth: 14,
    borderTopWidth: 28,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: "#FFD700",
  },
  wheel: {
    width: WHEEL_SIZE,
    height: WHEEL_SIZE,
  },
  resultContainer: {
    marginTop: 28,
    alignItems: "center",
    backgroundColor: "rgba(255, 215, 0, 0.12)",
    borderWidth: 1.5,
    borderColor: "#FFD700",
    borderRadius: 12,
    paddingHorizontal: 28,
    paddingVertical: 14,
  },
  resultLabel: {
    fontSize: 14,
    color: "#aab4c8",
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  resultText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FFD700",
    textAlign: "center",
  },
  resultPlaceholder: {
    marginTop: 28,
    height: 74,
  },
  button: {
    marginTop: 32,
    backgroundColor: "#FFD700",
    paddingHorizontal: 56,
    paddingVertical: 16,
    borderRadius: 40,
    boxShadow: "0px 4px 8px #FFD700",
  },
  buttonDisabled: {
    backgroundColor: "#888",
    shadowColor: "transparent",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#050a2e",
    letterSpacing: 3,
  },
});
