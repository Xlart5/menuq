import { useLocalSearchParams, useRouter } from "expo-router";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Colors, Radius, Spacing } from "@/constants/theme";
import { Pedido, useOrders } from "@/context/orders";
import { formatPrice } from "@/data/menu";

const estadoMeta: Record<
  Pedido["estado"],
  { label: string; color: string; emoji: string }
> = {
  enviado: { label: "Enviado a la parrilla 🔥", color: Colors.accent, emoji: "📝" },
  en_preparacion: { label: "Se está cocinando 👨‍🍳", color: "#38bdf8", emoji: "🔥" },
  listo: { label: "¡Listo! Lo trae el mesero 🧑‍🍳", color: "#a78bfa", emoji: "🔔" },
  en_camino: { label: "En camino a tu mesa 🏃", color: "#f472b6", emoji: "🛎️" },
  entregado: { label: "Entregado a tu mesa 🎉", color: Colors.success, emoji: "🎉" },
};

function timeAgo(ts: number) {
  const mins = Math.max(0, Math.floor((Date.now() - ts) / 60000));
  if (mins === 0) return "ahora mismo";
  if (mins === 1) return "hace 1 min";
  return `hace ${mins} min`;
}

export default function PedidosScreen() {
  const router = useRouter();
  const { mesa } = useLocalSearchParams<{ mesa?: string }>();
  const { pedidos } = useOrders();
  const mesaNum = mesa !== undefined ? Number(mesa) : null;

  const misPedidos = mesaNum !== null
    ? pedidos.filter((p) => p.mesa === mesaNum)
    : [];

  return (
    <View style={styles.container}>
      <SafeAreaView edges={["top"]} style={styles.safe}>
        <Pressable onPress={() => router.back()} style={styles.backButton} hitSlop={8}>
          <Text style={styles.backLabel}>‹</Text>
        </Pressable>
        <View>
          <Text style={styles.title}>
            🧾 Mi pedido{mesaNum !== null ? ` · Mesa ${mesaNum}` : ""}
          </Text>
          <Text style={styles.subtitle}>
            Estado en tiempo real de lo que pediste en esta mesa.
          </Text>
        </View>
      </SafeAreaView>

      <FlatList
        data={misPedidos}
        keyExtractor={(p) => p.id}
        renderItem={({ item }) => <PedidoCard pedido={item} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>🔥</Text>
            <Text style={styles.emptyText}>
              Aún no pediste en esta mesa. Volvé al menú y pedí algo rico.
            </Text>
          </View>
        }
        contentContainerStyle={styles.listContent}
      />

      <View style={styles.footer}>
        {mesaNum !== null ? (
          <Pressable
            style={styles.primaryButton}
            onPress={() => router.push(`/mesa/${mesaNum}`)}
          >
            <Text style={styles.primaryButtonLabel}>
              🍽️ Ver el menú de nuevo (Mesa {mesaNum})
            </Text>
          </Pressable>
        ) : (
          <Pressable style={styles.primaryButton} onPress={() => router.replace("/")}>
            <Text style={styles.primaryButtonLabel}>🍽️ Ver el menú</Text>
          </Pressable>
        )}
        {misPedidos.length > 0 && (
          <Pressable style={styles.secondaryButton} onPress={() => router.push("/resena")}>
            <Text style={styles.secondaryButtonLabel}>⭐ Dejar una reseña</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

function PedidoCard({ pedido }: { pedido: Pedido }) {
  const meta = estadoMeta[pedido.estado];
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.cardHeaderLeft}>
          <Text style={styles.cardId}>{pedido.id}</Text>
          <Text style={styles.cardMesa}>🪑 Mesa {pedido.mesa}</Text>
        </View>
        <Text
          style={[
            styles.estadoChip,
            { backgroundColor: `${meta.color}22`, color: meta.color },
          ]}
        >
          {meta.emoji} {meta.label}
        </Text>
      </View>
      {pedido.items.map((it) => (
        <View key={it.dishId} style={styles.itemRow}>
          <Text style={styles.itemName}>
            {it.emoji} {it.qty}× {it.name}
          </Text>
          <Text style={styles.itemPrice}>{formatPrice(it.price * it.qty)}</Text>
        </View>
      ))}
      <View style={styles.cardFooter}>
        <Text style={styles.footerTime}>{timeAgo(pedido.createdAt)}</Text>
        <Text style={styles.footerTotal}>{formatPrice(pedido.total)}</Text>
      </View>
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
  subtitle: {
    color: Colors.textMuted,
    fontSize: 12,
  },
  listContent: {
    paddingHorizontal: Spacing.l,
    paddingTop: Spacing.s,
    paddingBottom: Spacing.xl,
  },
  card: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.m,
    padding: Spacing.m,
    marginBottom: Spacing.m,
    gap: Spacing.s,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.s,
  },
  cardId: {
    color: Colors.text,
    fontSize: 13,
    fontWeight: "800",
  },
  cardMesa: {
    color: Colors.textMuted,
    fontSize: 12,
  },
  estadoChip: {
    fontSize: 11,
    fontWeight: "800",
    paddingHorizontal: Spacing.s,
    paddingVertical: 4,
    borderRadius: Radius.full,
    overflow: "hidden",
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  itemName: {
    color: Colors.textMuted,
    fontSize: 13,
    flex: 1,
  },
  itemPrice: {
    color: Colors.textMuted,
    fontSize: 13,
    fontWeight: "700",
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: Spacing.s,
  },
  footerTime: {
    color: Colors.textMuted,
    fontSize: 11,
  },
  footerTotal: {
    color: Colors.text,
    fontSize: 15,
    fontWeight: "900",
  },
  footer: {
    padding: Spacing.l,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  primaryButton: {
    backgroundColor: Colors.accent,
    borderRadius: Radius.full,
    paddingVertical: Spacing.m + 2,
    alignItems: "center",
  },
  primaryButtonLabel: {
    color: "#09090b",
    fontSize: 15,
    fontWeight: "800",
  },
  secondaryButton: {
    marginTop: Spacing.m,
    borderWidth: 1,
    borderColor: Colors.accent,
    borderRadius: Radius.full,
    paddingVertical: Spacing.m,
    alignItems: "center",
  },
  secondaryButtonLabel: {
    color: Colors.accent,
    fontSize: 15,
    fontWeight: "800",
  },
  empty: {
    alignItems: "center",
    gap: Spacing.m,
    paddingVertical: Spacing.xxl * 2,
    paddingHorizontal: Spacing.xl,
  },
  emptyEmoji: {
    fontSize: 44,
  },
  emptyText: {
    color: Colors.textMuted,
    textAlign: "center",
    fontSize: 14,
  },
});
