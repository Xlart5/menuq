import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Colors, Radius, Spacing } from "@/constants/theme";
import { insertReview } from "@/lib/reviews";

export default function ResenaScreen() {
  const router = useRouter();
  const [nombre, setNombre] = useState("");
  const [rating, setRating] = useState(5);
  const [texto, setTexto] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const submit = async () => {
    if (!texto.trim()) {
      setError("Contanos qué te pareció tu visita.");
      return;
    }
    const ok = await insertReview(nombre, rating, texto);
    if (!ok) {
      setError("No se pudo enviar. Revisá tu conexión e intentá de nuevo.");
      return;
    }
    setSent(true);
  };

  if (sent) {
    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.sentContainer}>
          <Text style={styles.sentEmoji}>⭐</Text>
          <Text style={styles.sentTitle}>¡Gracias por tu reseña!</Text>
          <Text style={styles.sentText}>
            Salís en la vitrina de opiniones de La Estancia. ¡Te esperamos
            pronto!
          </Text>
          <Pressable style={styles.primaryButton} onPress={() => router.back()}>
            <Text style={styles.primaryButtonLabel}>Volver</Text>
          </Pressable>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SafeAreaView edges={["top"]} style={styles.safe}>
        <Pressable onPress={() => router.back()} style={styles.backButton} hitSlop={8}>
          <Text style={styles.backLabel}>‹</Text>
        </Pressable>
        <Text style={styles.title}>⭐ Tu reseña</Text>
      </SafeAreaView>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.label}>Cómo estuvo tu experiencia</Text>
        <View style={styles.starsRow}>
          {[1, 2, 3, 4, 5].map((n) => (
            <Pressable
              key={n}
              onPress={() => setRating(n)}
              hitSlop={4}
              style={[
                styles.starButton,
                n <= rating && styles.starActive,
              ]}
            >
              <Text
                style={[styles.star, n <= rating ? styles.starSelected : styles.starDefault]}
              >
                ★
              </Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.label}>Tu nombre (opcional)</Text>
        <TextInput
          value={nombre}
          onChangeText={setNombre}
          placeholder="Ej. Lucía F."
          placeholderTextColor={Colors.textMuted}
          style={styles.input}
        />

        <Text style={styles.label}>Contanos qué te pareció</Text>
        <TextInput
          value={texto}
          onChangeText={setTexto}
          placeholder="La carne estaba increíble, la atención…"
          placeholderTextColor={Colors.textMuted}
          style={[styles.input, styles.textarea]}
          multiline
        />

        {error !== "" && <Text style={styles.error}>{error}</Text>}

        <Pressable style={styles.primaryButton} onPress={submit}>
          <Text style={styles.primaryButtonLabel}>Enviar reseña</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  safe: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.l,
    paddingTop: Spacing.m,
    gap: Spacing.m,
    paddingBottom: Spacing.s,
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
  },
  backLabel: {
    color: Colors.text,
    fontSize: 24,
    fontWeight: "800",
    lineHeight: 26,
    marginTop: -2,
  },
  title: {
    color: Colors.text,
    fontSize: 24,
    fontWeight: "900",
  },
  content: {
    padding: Spacing.l,
    gap: Spacing.s,
  },
  label: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: "700",
    marginTop: Spacing.m,
  },
  starsRow: {
    flexDirection: "row",
    gap: Spacing.s,
  },
  starButton: {
    padding: 4,
    borderRadius: Radius.s,
  },
  starActive: {
    backgroundColor: Colors.accentSoft,
  },
  star: {
    fontSize: 34,
  },
  starSelected: {
    color: Colors.accent,
  },
  starDefault: {
    color: Colors.textMuted,
  },
  input: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.m,
    paddingHorizontal: Spacing.l,
    paddingVertical: Spacing.m,
    color: Colors.text,
    fontSize: 14,
  },
  textarea: {
    minHeight: 110,
    textAlignVertical: "top",
  },
  error: {
    color: Colors.danger,
    fontSize: 13,
  },
  primaryButton: {
    backgroundColor: Colors.accent,
    borderRadius: Radius.full,
    paddingVertical: Spacing.m + 2,
    alignItems: "center",
    marginTop: Spacing.m,
  },
  primaryButtonLabel: {
    color: "#09090b",
    fontSize: 15,
    fontWeight: "800",
  },
  sentContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.m,
    padding: Spacing.xl,
  },
  sentEmoji: {
    fontSize: 56,
  },
  sentTitle: {
    color: Colors.text,
    fontSize: 24,
    fontWeight: "900",
  },
  sentText: {
    color: Colors.textMuted,
    textAlign: "center",
    fontSize: 14,
  },
});
