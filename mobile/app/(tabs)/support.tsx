import { useState, useRef, useCallback, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Send, Headphones, RotateCwIcon } from "lucide-react-native";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { Colors } from "../../constants/theme";
import { useAuth } from "../../contexts/AuthContext";
import { fetchChatHistory, sendMessage, resetChatHistory, type ChatMessage } from "../../requests/support";
import { TypingDots, MessageBubble } from "../../components/agent/AgentChat";

const avatarStyle = {
  width: 30,
  height: 30,
  borderRadius: 15,
  backgroundColor: Colors.dark.secondary,
  alignItems: "center" as const,
  justifyContent: "center" as const,
  flexShrink: 0 as const,
};

const agentAvatar = (
  <View style={avatarStyle}>
    <Headphones size={14} color={Colors.dark.background} />
  </View>
);

const agentAvatarSmall = (
  <View style={avatarStyle}>
    <Headphones size={12} color={Colors.dark.background} />
  </View>
);

// ── Screen ────────────────────────────────────────────────────────────────────

const WELCOME_MESSAGE: ChatMessage = {
  id: "welcome",
  from: "agent",
  content: "Olá! Sou a sua assistente de suporte da Esportes da Sorte 👋\n\nComo posso te ajudar hoje?",
};

export default function Support() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const scrollRef = useRef<ScrollView>(null);
  const [input, setInput] = useState("");
  const [localMessages, setLocalMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  const { data: history, isLoading } = useQuery({
    queryKey: ["support-chat", user?.id],
    queryFn: () => fetchChatHistory(user!.id),
    enabled: !!user,
  });

  useEffect(() => {
    const base = history && history.length > 0 ? history : [WELCOME_MESSAGE];
    setLocalMessages(base);
  }, [history]);

  useEffect(() => {
    if (localMessages.length > 0) {
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 80);
    }
  }, [localMessages, isTyping]);

  const sendMutation = useMutation({
    mutationFn: (text: string) => sendMessage(user!.id, text),
    onMutate: (text) => {
      const userMsg: ChatMessage = { id: Date.now().toString(), from: "user", content: text };
      setLocalMessages((prev) => [...prev, userMsg]);
      setIsTyping(true);
    },
    onSuccess: (response) => {
      setIsTyping(false);
      const agentMsg: ChatMessage = { id: (Date.now() + 1).toString(), from: "agent", content: response };
      setLocalMessages((prev) => [...prev, agentMsg]);
    },
    onError: () => {
      setIsTyping(false);
      const errMsg: ChatMessage = {
        id: Date.now().toString(),
        from: "agent",
        content: "Desculpe, ocorreu um erro. Tente novamente.",
      };
      setLocalMessages((prev) => [...prev, errMsg]);
    },
  });

  const resetMutation = useMutation({
    mutationFn: () => resetChatHistory(user!.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["support-chat", user?.id] });
      setLocalMessages([WELCOME_MESSAGE]);
    },
  });

  const handleSend = useCallback(() => {
    const text = input.trim();
    if (!text || sendMutation.isPending) return;
    setInput("");
    sendMutation.mutate(text);
  }, [input, sendMutation]);

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      {/* Gradient glow from bottom */}
      <LinearGradient
        colors={["transparent", `${Colors.dark.primary}60`]}
        start={{ x: 0.3, y: 0 }}
        end={{ x: 0.7, y: 1 }}
        style={styles.bgGradient}
        pointerEvents="none"
      />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerAgent}>
          <View style={styles.headerAvatar}>
            <Headphones size={18} color={Colors.dark.background} />
          </View>
          <View>
            <Text style={styles.headerName}>Suporte</Text>
            <View style={styles.onlineRow}>
              <View style={styles.onlineDot} />
              <Text style={styles.onlineText}>Online agora</Text>
            </View>
          </View>
        </View>
        <TouchableOpacity
          style={styles.resetBtn}
          onPress={() => resetMutation.mutate()}
          activeOpacity={0.7}
          disabled={resetMutation.isPending}
        >
          <RotateCwIcon size={18} color={Colors.dark.textMuted} />
        </TouchableOpacity>
      </View>

      {/* Messages */}
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={0}
      >
        {isLoading ? (
          <View style={styles.centered}>
            <ActivityIndicator color={Colors.dark.primary} />
          </View>
        ) : (
          <ScrollView
            ref={scrollRef}
            style={styles.messageList}
            contentContainerStyle={styles.messageContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {localMessages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} agentAvatar={agentAvatar} />
            ))}
            {isTyping && <TypingDots agentAvatar={agentAvatarSmall} />}
          </ScrollView>
        )}

        {/* Input bar */}
        <View style={[styles.inputBar, { paddingBottom: 8 }]}>
          <TextInput
            style={styles.input}
            placeholder="Digite sua mensagem..."
            placeholderTextColor={Colors.dark.textMuted}
            value={input}
            onChangeText={setInput}
            multiline
            maxLength={500}
            returnKeyType="default"
            selectionColor={Colors.dark.primary}
          />
          <TouchableOpacity
            style={[styles.sendBtn, (!input.trim() || sendMutation.isPending) && styles.sendBtnDisabled]}
            onPress={handleSend}
            activeOpacity={0.8}
            disabled={!input.trim() || sendMutation.isPending}
          >
            <Send size={18} color={Colors.dark.background} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  flex: {
    flex: 1,
  },
  bgGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "60%",
    zIndex: 0,
  },
  // ── Header ──
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.inputBackground,
    zIndex: 1,
  },
  headerAgent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  headerAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.dark.secondary,
    borderWidth: 2,
    borderColor: Colors.dark.secondary,
    alignItems: "center",
    justifyContent: "center",
  },
  headerName: {
    color: Colors.dark.text,
    fontSize: 16,
    fontWeight: "700",
  },
  onlineRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 2,
  },
  onlineDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: Colors.dark.primary,
  },
  onlineText: {
    color: Colors.dark.primary,
    fontSize: 11,
    fontWeight: "600",
  },
  resetBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.dark.inputBackground,
    alignItems: "center",
    justifyContent: "center",
  },
  // ── Messages ──
  messageList: {
    flex: 1,
    zIndex: 1,
    paddingBottom: 10,
  },
  messageContent: {
    flexGrow: 1,
    justifyContent: "flex-end",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    gap: 10,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  // ── Input bar ──
  inputBar: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 10,
    paddingHorizontal: 16,
    paddingTop: 10,
    backgroundColor: Colors.dark.inputBackground,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    zIndex: 1,
  },
  input: {
    flex: 1,
    minHeight: 44,
    maxHeight: 120,
    backgroundColor: Colors.dark.background,
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 10,
    color: Colors.dark.text,
    fontSize: 14,
    lineHeight: 20,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.dark.primary,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  sendBtnDisabled: {
    opacity: 0.4,
  },
});
