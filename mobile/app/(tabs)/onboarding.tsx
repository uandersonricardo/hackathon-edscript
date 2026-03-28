import { useState, useRef, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Send } from "lucide-react-native";

import { Colors } from "../../constants/theme";
import { useAuth } from "../../contexts/AuthContext";
import {
  fetchOnboardingChat,
  sendOnboardingMessage,
  type OnboardingMessage,
  type OnboardingOption,
} from "../../requests/onboarding";
import { TypingDots, MessageBubble } from "../../components/agent/AgentChat";

const LOGO = require("../../assets/elements/agent.png");

const agentAvatar = <Image source={LOGO} style={{ width: 30, height: 30, borderRadius: 15 }} />;

// ── Screen ─────────────────────────────────────────────────────────────────────

export default function OnboardingScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user } = useAuth();
  const scrollRef = useRef<ScrollView>(null);

  const [messages, setMessages] = useState<OnboardingMessage[]>([]);
  const [options, setOptions] = useState<OnboardingOption[] | null>(null);
  const [multiSelect, setMultiSelect] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [isTyping, setIsTyping] = useState(false);
  const [input, setInput] = useState("");

  const { isLoading, data } = useQuery({
    queryKey: ["onboarding-chat", user?.id],
    queryFn: () => fetchOnboardingChat(user!.id),
    enabled: !!user,
  });

  // Sync query data into local state (onSuccess removed in TanStack Query v5)
  useEffect(() => {
    if (!data) return;
    setMessages(data.history);
    setOptions(data.options);
    setMultiSelect(data.multiSelect);
    if (data.done) router.replace("/(tabs)");
  }, [data]);

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 80);
    }
  }, [messages, isTyping]);

  const sendMutation = useMutation({
    mutationFn: (text: string) => sendOnboardingMessage(user!.id, text),
    onMutate: (text) => {
      const userMsg: OnboardingMessage = { id: Date.now().toString(), from: "user", content: text };
      setMessages((prev) => [...prev, userMsg]);
      setOptions(null);
      setSelected(new Set());
      setIsTyping(true);
    },
    onSuccess: (response) => {
      setIsTyping(false);
      if (response.content) {
        const agentMsg: OnboardingMessage = {
          id: (Date.now() + 1).toString(),
          from: "agent",
          content: response.content,
        };
        setMessages((prev) => [...prev, agentMsg]);
      }
      setOptions(response.options);
      setMultiSelect(response.multiSelect);
      if (response.done) {
        setTimeout(() => router.replace("/(tabs)"), 1200);
      }
    },
    onError: () => {
      setIsTyping(false);
    },
  });

  const send = useCallback(
    (text: string) => {
      if (!text.trim() || sendMutation.isPending) return;
      sendMutation.mutate(text.trim());
    },
    [sendMutation],
  );

  const handleSingleSelect = useCallback(
    (option: OnboardingOption) => {
      send(option.label);
    },
    [send],
  );

  const toggleMultiSelect = useCallback((value: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(value)) next.delete(value);
      else next.add(value);
      return next;
    });
  }, []);

  const handleConfirm = useCallback(() => {
    if (sendMutation.isPending || selected.size === 0) return;
    const labels = options!.filter((o) => selected.has(o.value)).map((o) => o.label);
    send(labels.join(", "));
  }, [sendMutation, selected, options, send]);

  const handleSendText = useCallback(() => {
    send(input);
    setInput("");
  }, [input, send]);

  return (
    <KeyboardAvoidingView
      style={[styles.root, { paddingTop: 0 }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {/* Fixed welcome header */}
      <View style={styles.welcomeHeader}>
        <Text style={styles.welcomeTitle}>Bem-vindo ao Esportes da Sorte</Text>
        <View style={styles.logoWrapper}>
          <Image source={LOGO} style={styles.logo} resizeMode="contain" />
        </View>
        <Text style={styles.welcomeSub}>Conte-me mais sobre você</Text>
      </View>

      {/* Messages */}
      <View style={styles.flex}>
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
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} agentAvatar={agentAvatar} />
            ))}
            {isTyping && <TypingDots agentAvatar={agentAvatar} />}
          </ScrollView>
        )}

        {/* Options bar */}
        {options && !isTyping && (
          <View style={styles.optionsBar}>
            <View style={styles.optionsGrid}>
              {options.map((opt) => {
                const active = selected.has(opt.value);
                return (
                  <TouchableOpacity
                    key={opt.value}
                    style={[styles.optionChip, active && styles.optionChipActive]}
                    onPress={() => (multiSelect ? toggleMultiSelect(opt.value) : handleSingleSelect(opt))}
                    activeOpacity={0.75}
                  >
                    <Text style={[styles.optionText, active && styles.optionTextActive]}>{opt.label}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            {multiSelect && (
              <TouchableOpacity
                style={[styles.confirmBtn, selected.size === 0 && styles.confirmBtnDisabled]}
                onPress={handleConfirm}
                activeOpacity={0.85}
                disabled={selected.size === 0}
              >
                <Text style={styles.confirmBtnText}>Confirmar</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Text input bar */}
        <View style={[styles.inputBar, { paddingBottom: 8 }]}>
          <TextInput
            style={styles.input}
            placeholder="Digite sua mensagem..."
            placeholderTextColor={Colors.dark.textMuted}
            value={input}
            onChangeText={setInput}
            multiline
            maxLength={300}
            returnKeyType="default"
            selectionColor={Colors.dark.primary}
          />
          <TouchableOpacity
            style={[styles.sendBtn, (!input.trim() || sendMutation.isPending) && styles.sendBtnDisabled]}
            onPress={handleSendText}
            activeOpacity={0.8}
            disabled={!input.trim() || sendMutation.isPending}
          >
            <Send size={18} color={Colors.dark.background} />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

// ── Styles ─────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  flex: {
    flex: 1,
  },
  // ── Welcome header ──
  welcomeHeader: {
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.inputBackground,
    gap: 8,
  },
  welcomeTitle: {
    color: Colors.dark.text,
    fontSize: 15,
    fontWeight: "500",
    textAlign: "center",
  },
  logoWrapper: {},
  logo: {
    width: 120,
    height: 120,
    marginVertical: 6,
    borderRadius: 60,
    borderColor: Colors.dark.primary,
    borderWidth: 4,
    boxShadow: `0px 0px 4px ${Colors.dark.primary}`,
  },
  welcomeSub: {
    color: Colors.dark.text,
    fontSize: 20,
    textAlign: "center",
    fontWeight: "700",
  },
  // ── Messages ──
  messageList: {
    flex: 1,
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
  // ── Options bar ──
  optionsBar: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    gap: 10,
  },
  optionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    justifyContent: "center",
  },
  optionChip: {
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: Colors.dark.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  optionChipActive: {
    borderColor: Colors.dark.primary,
    backgroundColor: Colors.dark.primaryMuted,
  },
  optionText: {
    color: Colors.dark.text,
    fontSize: 14,
    fontWeight: "600",
  },
  optionTextActive: {
    color: Colors.dark.primary,
  },
  confirmBtn: {
    backgroundColor: Colors.dark.primary,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    boxShadow: `0px 4px 12px ${Colors.dark.primary}`,
    marginTop: 8,
  },
  confirmBtnDisabled: {
    opacity: 0.4,
    shadowOpacity: 0,
    elevation: 0,
  },
  confirmBtnText: {
    color: "#04013A",
    fontSize: 15,
    fontWeight: "700",
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
    marginTop: 10,
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
