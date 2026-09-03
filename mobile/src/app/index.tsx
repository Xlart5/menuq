import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Colors, Radius, Spacing } from "@/constants/theme";
import { useOrders } from "@/context/orders";
import { RESTAURANT } from "@/data/menu";

export default function HomeScreen() {
  const router = useRouter();
  const { pedidos, lastMesa } = useOrders();
  const misPedidos = lastMesa !== null
    ? pedidos.filter((p) => p.mesa === lastMesa)
    : [];

  return (
    <View style={styles.container}>
      <SafeAreaView edges={["top"]} style={styles.safe}>
        <Text style={styles.badge}>{RESTAURANT.badge}</Text>
        <Text style={styles.title}>{RESTAURANT.name}</Text>
        <Text style={styles.subtitle}>
          Para ver el menú y pedir, escaneá el código QR que está sobre tu
          mesa.
        </Text>

        {misPedidos.length > 0 && (
          <Pressable style={styles.ordersBar} onPress={() => router.push("/pedidos")}>
            <Text style={styles.ordersBarText}>
              🧾 Ver mi pedido ({misPedidos.length}) →
            </Text>
          </Pressable>
        )}

        <View style={styles.helper}>
          <Text style={styles.helperEmoji}>🪑</Text>
          <Text style={styles.helperText}>
            1. Escaneá el QR de tu mesa{"\n"}2. Elegí tus platos{"\n"}3.
            Pedí desde el celular
          </Text>
        </View>

        <Pressable style={styles.personalButton} onPress={() => router.push("/personal")}>
          <Text style={styles.personalButtonLabel}>
            🧑‍🍳 Acceso del personal (mesero)
          </Text>
        </Pressable>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  safe: {
    flex: 1,
    paddingHorizontal: Spacing.l,
    paddingTop: Spacing.l,
    gap: Spacing.s,
  },
  badge: {
    color: Colors.accent,
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1.2,
  },
  title: {
    color: Colors.text,
    fontSize: 28,
    fontWeight: "900",
  },
  subtitle: {
    color: Colors.textMuted,
    fontSize: 14,
    lineHeight: 20,
  },
  ordersBar: {
    marginTop: Spacing.m,
    backgroundColor: Colors.accent,
    borderRadius: Radius.full,
    paddingVertical: Spacing.m,
    alignItems: "center",
  },
  ordersBarText: {
    color: "#09090b",
    fontSize: 15,
    fontWeight: "800",
  },
  helper: {
    marginTop: Spacing.xl,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.m,
    padding: Spacing.l,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.m,
  },
  helperEmoji: {
    fontSize: 34,
  },
  helperText: {
    color: Colors.textMuted,
    fontSize: 14,
    lineHeight: 22,
  },
  personalButton: {
    marginTop: Spacing.xl,
    backgroundColor: Colors.surfaceAlt,
    borderWidth: 1,
    borderColor: Colors.accent,
    borderRadius: Radius.full,
    paddingVertical: Spacing.m + 2,
    alignItems: "center",
  },
  personalButtonLabel: {
    color: Colors.accent,
    fontSize: 15,
    fontWeight: "800",
  },
});
