import { useRouter } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Colors, Radius, Spacing } from "@/constants/theme";
import { useStaff } from "@/hooks/use-staff";

const STAFF_PIN = "1234";

export default function PersonalScreen() {
  const router = useRouter();
  const { setStaff } = useStaff();
  const [pin, setPin] = useState("");
  const [nombre, setNombre] = useState("");
  const [error, setError] = useState("");

  const entrar = () => {
    if (pin !== STAFF_PIN) {
      setError("PIN incorrecto. Pedí tu PIN al administrador.");
      return;
    }
    if (!nombre.trim()) {
      setError("Ingresá tu nombre para identificarte en el salón.");
      return;
    }
    setStaff({ nombre: nombre.trim() });
    router.replace("/personal-hub");
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <SafeAreaView style={styles.safe}>
        <Pressable onPress={() => router.back()} style={styles.backButton} hitSlop={8}>
          <Text style={styles.backLabel}>‹</Text>
        </Pressable>
        <Text style={styles.emoji}>🧑‍🍳</Text>
        <Text style={styles.title}>Acceso del personal</Text>
        <Text style={styles.subtitle}>
          Meseros y mozos: ingresá con tu PIN y asigná tus mesas escaneando el
          QR.
        </Text>

        <View style={styles.form}>
          <Text style={styles.label}>Nombre</Text>
          <TextInput
            value={nombre}
            onChangeText={setNombre}
            placeholder="Ej. Brayan"
            placeholderTextColor={Colors.textMuted}
            style={styles.input}
          />
          <Text style={styles.label}>PIN</Text>
          <TextInput
            value={pin}
            onChangeText={setPin}
            placeholder="••••"
            placeholderTextColor={Colors.textMuted}
            style={styles.input}
            secureTextEntry
            keyboardType="number-pad"
            maxLength={4}
          />
          {error !== "" && <Text style={styles.error}>{error}</Text>}
          <Pressable style={styles.button} onPress={entrar}>
            <Text style={styles.buttonLabel}>Entrar como mesero</Text>
          </Pressable>
          <Text style={styles.hint}>PIN inicial de demostración: 1234</Text>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  safe: {
    flex: 1,
    padding: Spacing.l,
  },
  backButton: {
    width: 34,
    height: 34,
    borderRadius: Radius.full,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.m,
  },
  backLabel: {
    color: Colors.text,
    fontSize: 24,
    fontWeight: "800",
    lineHeight: 26,
    marginTop: -2,
  },
  emoji: {
    fontSize: 56,
    textAlign: "center",
  },
  title: {
    color: Colors.text,
    fontSize: 26,
    fontWeight: "900",
    textAlign: "center",
    marginTop: Spacing.s,
  },
  subtitle: {
    color: Colors.textMuted,
    fontSize: 14,
    textAlign: "center",
    marginTop: Spacing.s,
    lineHeight: 20,
  },
  form: {
    marginTop: Spacing.xl,
    gap: Spacing.s,
  },
  label: {
    color: Colors.text,
    fontSize: 13,
    fontWeight: "700",
  },
  input: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.m,
    paddingHorizontal: Spacing.l,
    paddingVertical: Spacing.m,
    color: Colors.text,
    fontSize: 15,
  },
  error: {
    color: Colors.danger,
    fontSize: 13,
  },
  button: {
    backgroundColor: Colors.accent,
    borderRadius: Radius.full,
    paddingVertical: Spacing.m + 2,
    alignItems: "center",
    marginTop: Spacing.s,
  },
  buttonLabel: {
    color: "#09090b",
    fontSize: 15,
    fontWeight: "800",
  },
  hint: {
    color: Colors.textMuted,
    fontSize: 12,
    textAlign: "center",
  },
});
