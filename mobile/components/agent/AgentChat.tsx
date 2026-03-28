import { useEffect, useRef, type ReactNode } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";

import { Colors } from "@/constants/theme";

// ── Shared message type ────────────────────────────────────────────────────────

export type AgentMessage = {
  id: string;
  from: "user" | "agent";
  content: string;
};

// ── Typing indicator ───────────────────────────────────────────────────────────

export function TypingDots({ agentAvatar }: { agentAvatar: ReactNode }) {
  const dots = [
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
  ];

  useEffect(() => {
    const anims = dots.map((dot, i) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(i * 180),
          Animated.timing(dot, { toValue: 1, duration: 300, useNativeDriver: true }),
          Animated.timing(dot, { toValue: 0, duration: 300, useNativeDriver: true }),
          Animated.delay((2 - i) * 180),
        ]),
      ),
    );
    anims.forEach((a) => a.start());
    return () => anims.forEach((a) => a.stop());
  }, []);

  return (
    <View style={styles.typingBubble}>
      {agentAvatar}
      <View style={styles.typingDots}>
        {dots.map((dot, i) => (
          <Animated.View
            key={i}
            style={[
              styles.dot,
              {
                opacity: dot,
                transform: [{ translateY: dot.interpolate({ inputRange: [0, 1], outputRange: [0, -4] }) }],
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
}

// ── Message bubble ─────────────────────────────────────────────────────────────

export function MessageBubble({
  message,
  agentAvatar,
}: {
  message: AgentMessage;
  agentAvatar: ReactNode;
}) {
  const isUser = message.from === "user";
  return (
    <View style={[styles.bubbleRow, isUser ? styles.bubbleRowUser : styles.bubbleRowAgent]}>
      {!isUser && agentAvatar}
      <View style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleAgent]}>
        <Text style={[styles.bubbleText, isUser && styles.bubbleTextUser]}>{message.content}</Text>
      </View>
    </View>
  );
}

// ── Shared styles ──────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  bubbleRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
    maxWidth: "85%",
  },
  bubbleRowUser: {
    alignSelf: "flex-end",
    flexDirection: "row-reverse",
  },
  bubbleRowAgent: {
    alignSelf: "flex-start",
  },
  bubble: {
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    maxWidth: "100%",
  },
  bubbleAgent: {
    backgroundColor: Colors.dark.inputBackground,
    borderBottomLeftRadius: 4,
  },
  bubbleUser: {
    backgroundColor: Colors.dark.primary,
    borderBottomRightRadius: 4,
  },
  bubbleText: {
    color: Colors.dark.text,
    fontSize: 14,
    lineHeight: 20,
  },
  bubbleTextUser: {
    color: Colors.dark.background,
  },
  typingBubble: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
    alignSelf: "flex-start",
  },
  typingDots: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: Colors.dark.inputBackground,
    borderRadius: 16,
    borderBottomLeftRadius: 4,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: Colors.dark.textMuted,
  },
});
