import { useRouter } from "expo-router";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Colors, Radius, Spacing } from "@/constants/theme";
import { useMesas } from "@/context/mesas";
import { useOrders } from "@/context/orders";
import { RESTAURANT } from "@/data/menu";

export default function HomeScreen() {
  const router = useRouter();
  const { mesas } = useMesas();
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
          Para ver el menú de tu mesa, escanea el código QR que está sobre la
          mesa. Es rápido: pedís en segundos.
        </Text>

        {misPedidos.length > 0 && (
          <Pressable style={styles.ordersBar} onPress={() => router.push("/pedidos")}>
            <Text style={styles.ordersBarText}>
              🧾 Ver mi pedido ({misPedidos.length}) →
            </Text>
          </Pressable>
        )}

        <View style={styles.demoBox}>
          <Text style={styles.demoTitle}>👨‍🍳 Acceso del personal</Text>
          <Text style={styles.demoText}>
            Selecciona una mesa para abrir el flujo de pedido del cliente
          </Text>
          <FlatList
            data={mesas}
            numColumns={2}
            keyExtractor={(m) => String(m.numero)}
            columnWrapperStyle={styles.demoRow}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <Pressable
                style={styles.demoButton}
                onPress={() => router.push(`/mesa/${item.numero}`)}
              >
                <Text style={styles.demoButtonLabel}>🪑 Mesa {item.numero}</Text>
              </Pressable>
            )}
          />
        </View>
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
  demoBox: {
    marginTop: Spacing.xl,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.m,
    padding: Spacing.l,
  },
  demoTitle: {
    color: Colors.text,
    fontSize: 15,
    fontWeight: "800",
  },
  demoText: {
    color: Colors.textMuted,
    fontSize: 12,
    marginTop: 2,
    marginBottom: Spacing.m,
  },
  demoRow: {
    gap: Spacing.m,
    marginBottom: Spacing.m,
  },
  demoButton: {
    flex: 1,
    backgroundColor: Colors.surfaceAlt,
    borderRadius: Radius.m,
    paddingVertical: Spacing.l,
    alignItems: "center",
  },
  demoButtonLabel: {
    color: Colors.accent,
    fontSize: 14,
    fontWeight: "800",
  },
});
