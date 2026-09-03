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
import { supabase } from "@/lib/supabase";

export default function PersonalScreen() {
  const router = useRouter();
  const { setStaff } = useStaff();
  const [mode, setMode] = useState<"entrar" | "registrar">("entrar");
  const [nombre, setNombre] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [okMsg, setOkMsg] = useState("");
  const [busy, setBusy] = useState(false);

  const entrar = async () => {
    setError("");
    setOkMsg("");
    if (!nombre.trim() || pin.length < 4) {
      setError("Ingresá tu nombre y PIN de 4 dígitos.");
      return;
    }
    setBusy(true);
    const { data, error: err } = await supabase
      .from("personales")
      .select("id, nombre, estado")
      .eq("nombre", nombre.trim().toLowerCase())
      .eq("pin", pin);
    setBusy(false);
    if (err) {
      setError("No se pudo validar. Revisa tu conexión.");
      return;
    }
    if (!data || data.length === 0) {
      setError("Nombre o PIN incorrecto.");
      return;
    }
    const perfil = data[0];
    if (perfil.estado === "pendiente") {
      setError("Tu registro está en espera de aprobación del administrador.");
      return;
    }
    if (perfil.estado === "rechazado") {
      setError("Tu solicitud fue rechazada. Consulta al administrador.");
      return;
    }
    setStaff({ nombre: perfil.nombre });
    router.replace("/personal-hub");
  };

  const registrar = async () => {
    setError("");
    setOkMsg("");
    if (!nombre.trim() || pin.length < 4) {
      setError("Ingresá tu nombre y un PIN de 4 dígitos.");
      return;
    }
    setBusy(true);
    const { error: err } = await supabase.from("personales").insert({
      id: `p-${Date.now()}`,
      nombre: nombre.trim().toLowerCase(),
      pin,
      estado: "pendiente",
      created_at: new Date().toISOString(),
    });
    setBusy(false);
    if (err) {
      setError("Ya existe un registro con ese nombre. Probá otro.");
      return;
    }
    setOkMsg(
      "¡Solicitud enviada! El administrador debe aprobarla antes de que puedas entrar."
    );
    setMode("entrar");
    setPin("");
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
          {mode === "entrar"
            ? "Entrá con el nombre y PIN que te dio el administrador."
            : "Creá tu cuenta: quedará en espera de aprobación."}
        </Text>

        <View style={styles.form}>
          <View style={styles.modeRow}>
            <Pressable
              style={[styles.modeButton, mode === "entrar" && styles.modeActive]}
              onPress={() => {
                setMode("entrar");
                setError("");
                setOkMsg("");
              }}
            >
              <Text style={[styles.modeLabel, mode === "entrar" && styles.modeLabelActive]}>
                Entrar
              </Text>
            </Pressable>
            <Pressable
              style={[styles.modeButton, mode === "registrar" && styles.modeActive]}
              onPress={() => {
                setMode("registrar");
                setError("");
                setOkMsg("");
              }}
            >
              <Text
                style={[
                  styles.modeLabel,
                  mode === "registrar" && styles.modeLabelActive,
                ]}
              >
                Registrarme
              </Text>
            </Pressable>
          </View>

          <Text style={styles.label}>Nombre</Text>
          <TextInput
            value={nombre}
            onChangeText={setNombre}
            placeholder="Tu nombre (ej. Brayan)"
            placeholderTextColor={Colors.textMuted}
            style={styles.input}
            autoCapitalize="words"
          />
          <Text style={styles.label}>PIN (4 dígitos)</Text>
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
          {okMsg !== "" && <Text style={styles.ok}>{okMsg}</Text>}
          <Pressable
            style={[styles.button, busy && { opacity: 0.6 }]}
            onPress={mode === "entrar" ? entrar : registrar}
          >
            <Text style={styles.buttonLabel}>
              {busy
                ? "Un momento…"
                : mode === "entrar"
                  ? "Entrar como mesero"
                  : "Solicitar acceso"}
            </Text>
          </Pressable>
          <Text style={styles.hint}>
            {mode === "entrar"
              ? "¿No tenés cuenta? Usá la pestaña Registrarme."
              : "El administrador aprueba tu acceso desde el panel."}
          </Text>
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
  modeRow: {
    flexDirection: "row",
    gap: Spacing.s,
    marginBottom: Spacing.s,
  },
  modeButton: {
    flex: 1,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    paddingVertical: Spacing.s,
    alignItems: "center",
  },
  modeActive: {
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
  },
  modeLabel: {
    color: Colors.textMuted,
    fontSize: 14,
    fontWeight: "700",
  },
  modeLabelActive: {
    color: "#09090b",
    fontWeight: "800",
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
  ok: {
    color: Colors.success,
    fontSize: 13,
    fontWeight: "700",
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
