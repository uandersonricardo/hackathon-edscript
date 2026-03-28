import { useRef, useState } from "react";
import {
  LayoutAnimation,
  Platform,
  StyleSheet,
  UIManager,
  View,
  TextInput,
  TouchableOpacity,
  Text,
} from "react-native";
import { useMutation } from "@tanstack/react-query";
import { Search, Send, Sparkles, X } from "lucide-react-native";

import { Colors } from "@/constants/theme";
import { useAuth } from "@/contexts/AuthContext";
import { useSearch } from "@/contexts/SearchContext";
import { sendTipsterMessage } from "@/requests/tipsterAgent";
import { TypingDots } from "@/components/agent/AgentChat";

if (Platform.OS === "android") {
  UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

const avatarStyle = {
  width: 26,
  height: 26,
  borderRadius: 13,
  backgroundColor: Colors.dark.primary,
  alignItems: "center" as const,
  justifyContent: "center" as const,
  flexShrink: 0 as const,
};

const agentAvatar = <></>;

export function AgentSearchBar({ section }: { section: string }) {
  const { user } = useAuth();
  const { searchQuery, setSearchQuery } = useSearch();
  const sessionId = useRef(`${Date.now()}`).current;

  const [agentMode, setAgentMode] = useState(false);
  const [input, setInput] = useState("");
  const [response, setResponse] = useState<string | null>(null);

  const sendMutation = useMutation({
    mutationFn: (text: string) => sendTipsterMessage(user!.id, text, section, sessionId),
    onMutate: () => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setResponse(null);
    },
    onSuccess: (text) => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      console.log(text);
      setResponse(text);
    },
    onError: (err) => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setResponse(null);
      console.log(err);
    },
  });

  const handleToggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setAgentMode((v) => !v);
    setInput("");
    setResponse(null);
  };

  const handleSend = () => {
    const text = input.trim();
    if (!text || sendMutation.isPending) return;
    setInput("");
    sendMutation.mutate(text);
  };

  const isExpanded = agentMode && (!!response || sendMutation.isPending);

  return (
    <View style={[styles.wrapper, agentMode && styles.wrapperActive]}>
      {/* Input row */}
      <View style={styles.inputRow}>
        {agentMode ? (
          <Sparkles size={16} color={Colors.dark.primary} style={styles.rowIcon} />
        ) : (
          <Search size={16} color={Colors.dark.textMuted} style={styles.rowIcon} />
        )}
        <TextInput
          style={styles.input}
          placeholder={agentMode ? "Pergunte sobre esta tela..." : "Pesquise aqui"}
          placeholderTextColor={Colors.dark.textMuted}
          selectionColor={Colors.dark.primary}
          value={agentMode ? input : searchQuery}
          onChangeText={agentMode ? setInput : setSearchQuery}
          onSubmitEditing={agentMode ? handleSend : undefined}
          returnKeyType={agentMode ? "send" : "search"}
        />
        <View style={styles.divider} />
        {agentMode ? (
          input.trim() ? (
            <TouchableOpacity style={styles.btn} onPress={handleSend} activeOpacity={0.8}>
              <Send size={14} color={Colors.dark.background} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={[styles.btn, styles.btnExit]} onPress={handleToggle} activeOpacity={0.8}>
              <X size={14} color={Colors.dark.background} />
            </TouchableOpacity>
          )
        ) : (
          <TouchableOpacity style={styles.btn} onPress={handleToggle} activeOpacity={0.8}>
            <Sparkles size={15} color={Colors.dark.background} />
          </TouchableOpacity>
        )}
      </View>

      {/* Response area — grows in below the input row */}
      {isExpanded && (
        <View style={styles.responseArea}>
          <View style={styles.separator} />
          {sendMutation.isPending ? (
            <View style={{ marginLeft: -14, alignSelf: "center", marginTop: 4 }}>
              <TypingDots agentAvatar={agentAvatar} />
            </View>
          ) : (
            <Text style={styles.responseText}>{response}</Text>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: Colors.dark.inputBackground,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: "transparent",
    overflow: "hidden",
  },
  wrapperActive: {
    borderColor: Colors.dark.primary,
    borderRadius: 16,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    height: 40,
    paddingHorizontal: 12,
    gap: 8,
  },
  rowIcon: {
    flexShrink: 0,
  },
  input: {
    flex: 1,
    color: Colors.dark.text,
    fontSize: 14,
    paddingVertical: 0,
  },
  divider: {
    width: 1,
    height: 16,
    backgroundColor: Colors.dark.textMuted,
    opacity: 0.3,
    marginHorizontal: 4,
  },
  btn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.dark.primary,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  btnExit: {
    backgroundColor: Colors.dark.textMuted,
  },
  separator: {
    height: 1,
    backgroundColor: Colors.dark.textMuted,
    opacity: 0.2,
    marginBottom: 10,
  },
  responseArea: {
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  responseText: {
    color: Colors.dark.text,
    fontSize: 14,
    lineHeight: 20,
  },
});
