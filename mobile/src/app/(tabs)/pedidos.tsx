import { FlatList, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Colors, Radius, Spacing } from "@/constants/theme";
import { Pedido, useOrders } from "@/context/orders";
import { formatPrice } from "@/data/menu";

const estadoMeta: Record<
  Pedido["estado"],
  { label: string; color: string; emoji: string }
> = {
  enviado: { label: "Enviado a la cocina", color: Colors.accent, emoji: "📝" },
  en_preparacion: { label: "En preparación", color: "#38bdf8", emoji: "👨‍🍳" },
  entregado: { label: "Entregado 🎉", color: Colors.success, emoji: "🎉" },
};

function timeAgo(ts: number) {
  const mins = Math.max(0, Math.floor((Date.now() - ts) / 60000));
  if (mins === 0) return "ahora mismo";
  if (mins === 1) return "hace 1 min";
  return `hace ${mins} min`;
}

export default function PedidosScreen() {
  const { pedidos } = useOrders();

  return (
    <View style={styles.container}>
      <SafeAreaView edges={["top"]} style={styles.safe}>
        <Text style={styles.title}>🧾 Tus pedidos</Text>
        <Text style={styles.subtitle}>
          Aquí ves el estado de los pedidos que enviaste desde tu mesa.
        </Text>
      </SafeAreaView>

      <FlatList
        data={pedidos}
        keyExtractor={(p) => p.id}
        renderItem={({ item }) => (
          <PedidoCard pedido={item} />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>🛒</Text>
            <Text style={styles.emptyText}>
              Aún no enviaste ningún pedido. Ve a una mesa y pide desde el
              menú.
            </Text>
          </View>
        }
        contentContainerStyle={styles.listContent}
      />
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
          <Text style={styles.itemPrice}>
            {formatPrice(it.price * it.qty)}
          </Text>
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
    paddingHorizontal: Spacing.l,
    paddingTop: Spacing.m,
    paddingBottom: Spacing.s,
  },
  title: {
    color: Colors.text,
    fontSize: 24,
    fontWeight: "900",
  },
  subtitle: {
    color: Colors.textMuted,
    fontSize: 13,
    marginTop: 2,
  },
  listContent: {
    paddingHorizontal: Spacing.l,
    paddingTop: Spacing.m,
    paddingBottom: Spacing.xxl * 2,
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
