import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { ChevronLeft } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Colors } from "../constants/theme";
import { useAuth } from "../contexts/AuthContext";

const LOGO = require("../assets/images/logo.png");

export default function RegisterScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { register, isRegistering, registerError } = useAuth();

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    if (!name.trim() || !username.trim() || !email.trim() || !password.trim()) return;
    try {
      await register({
        id: `${Date.now()}`,
        name: name.trim(),
        username: username.trim(),
        email: email.trim(),
        password,
        imageUrl: "",
        taxDocument: "",
        address: "",
        birthDate: new Date(),
        balance: 0,
        maxBetAmount: 1000,
        recurrentPlan: null,
        achievements: { rank: "bronze", experience: 0, missions: [], rewards: [] },
      });
      router.replace("/onboarding");
    } catch {
      // error shown via registerError
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.root, { paddingBottom: insets.bottom }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableOpacity style={[styles.backButton, { top: insets.top + 8 }]} onPress={() => router.back()} activeOpacity={0.7}>
        <ChevronLeft size={24} color={Colors.dark.text} />
      </TouchableOpacity>

      <ScrollView
        contentContainerStyle={[styles.inner, { paddingTop: insets.top + 24 }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Image source={LOGO} style={styles.logo} resizeMode="contain" />

        <Text style={styles.title}>Criar conta</Text>
        <Text style={styles.subtitle}>Junte-se a nós e comece a jogar</Text>

        <View style={styles.form}>
          <View style={styles.field}>
            <Text style={styles.label}>Nome completo</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite seu nome"
              placeholderTextColor={Colors.dark.textMuted}
              selectionColor={Colors.dark.primary}
              autoCorrect={false}
              value={name}
              onChangeText={setName}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Usuário</Text>
            <TextInput
              style={styles.input}
              placeholder="Escolha um usuário"
              placeholderTextColor={Colors.dark.textMuted}
              selectionColor={Colors.dark.primary}
              autoCapitalize="none"
              autoCorrect={false}
              value={username}
              onChangeText={setUsername}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>E-mail</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite seu e-mail"
              placeholderTextColor={Colors.dark.textMuted}
              selectionColor={Colors.dark.primary}
              autoCapitalize="none"
              keyboardType="email-address"
              autoCorrect={false}
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Senha</Text>
            <TextInput
              style={styles.input}
              placeholder="Crie uma senha"
              placeholderTextColor={Colors.dark.textMuted}
              selectionColor={Colors.dark.primary}
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          {registerError && <Text style={styles.error}>{registerError}</Text>}

          <TouchableOpacity
            style={[styles.button, isRegistering && styles.buttonDisabled]}
            onPress={handleRegister}
            activeOpacity={0.8}
            disabled={isRegistering}
          >
            {isRegistering ? (
              <ActivityIndicator color={Colors.dark.background} />
            ) : (
              <Text style={styles.buttonText}>Criar conta</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Já tem uma conta? </Text>
          <TouchableOpacity onPress={() => router.replace("/login")} activeOpacity={0.7}>
            <Text style={styles.footerLink}>Entrar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  backButton: {
    position: "absolute",
    left: 16,
    zIndex: 10,
    padding: 4,
  },
  inner: {
    alignItems: "center",
    paddingHorizontal: 28,
    paddingBottom: 40,
    gap: 8,
  },
  logo: {
    width: 180,
    height: 72,
    marginBottom: 16,
  },
  title: {
    color: Colors.dark.text,
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
  },
  subtitle: {
    color: Colors.dark.textMuted,
    fontSize: 15,
    textAlign: "center",
    marginBottom: 8,
  },
  form: {
    width: "100%",
    gap: 16,
    marginTop: 8,
  },
  field: {
    gap: 6,
  },
  label: {
    color: Colors.dark.textMuted,
    fontSize: 13,
    fontWeight: "500",
  },
  input: {
    backgroundColor: Colors.dark.inputBackground,
    borderRadius: 13,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: Colors.dark.text,
    fontSize: 15,
  },
  error: {
    color: "#FF6B6B",
    fontSize: 13,
    textAlign: "center",
  },
  button: {
    backgroundColor: Colors.dark.primary,
    borderRadius: 13,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 4,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: Colors.dark.background,
    fontSize: 16,
    fontWeight: "700",
  },
  footer: {
    flexDirection: "row",
    marginTop: 24,
  },
  footerText: {
    color: Colors.dark.textMuted,
    fontSize: 14,
  },
  footerLink: {
    color: Colors.dark.primary,
    fontSize: 14,
    fontWeight: "600",
  },
});
