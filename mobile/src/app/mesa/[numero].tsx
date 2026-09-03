import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
  Pressable,
  ScrollView,
  SectionList,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { DishCard } from "@/components/dish-card";
import { Colors, Radius, Spacing } from "@/constants/theme";
import { useCart } from "@/context/cart";
import { useOrders } from "@/context/orders";
import { Dish, formatPrice, RESTAURANT } from "@/data/menu";
import { useMenu } from "@/hooks/use-menu";

type SectionData = {
  title: string;
  emoji: string;
  data: Dish[];
};

export default function MesaScreen() {
  const { numero } = useLocalSearchParams<{ numero: string }>();
  const router = useRouter();
  const { categories, dishes } = useMenu();
  const { items, totalItems, totalPrice, add, clear } = useCart();
  const { createPedido, pedidos } = useOrders();
  const [active, setActive] = useState<string>("all");
  const [query, setQuery] = useState("");
  const mesaNum = Number(numero);
  const misPedidos = pedidos.filter((p) => p.mesa === mesaNum);

  const sections = useMemo<SectionData[]>(() => {
    const q = query.trim().toLowerCase();
    const visibleCats =
      active === "all" ? categories : categories.filter((c) => c.id === active);
    return visibleCats.map((cat) => ({
      title: cat.name,
      emoji: cat.emoji,
      data: dishes.filter(
        (d) =>
          d.categoryId === cat.id &&
          (q === "" ||
            d.name.toLowerCase().includes(q) ||
            d.description.toLowerCase().includes(q))
      ),
    }));
  }, [active, query, categories, dishes]);

  const submitOrder = () => {
    if (items.length === 0) return;
    createPedido(mesaNum, items);
    clear();
    router.replace(`/pedidos?mesa=${mesaNum}`);
  };

  return (
    <View style={styles.container}>
      <SafeAreaView edges={["top"]} style={styles.safe}>
        <Pressable
          onPress={() => router.back()}
          style={styles.backButton}
          hitSlop={8}
        >
          <Text style={styles.backLabel}>‹</Text>
        </Pressable>
        <View style={styles.headerInfo}>
          <Text style={styles.badge}>{RESTAURANT.name}</Text>
          <Text style={styles.title}>🍽️ Mesa {numero}</Text>
        </View>
        <View style={{ flex: 1 }} />
        {misPedidos.length > 0 && (
          <Pressable
            style={styles.myOrderButton}
            onPress={() => router.push(`/pedidos?mesa=${mesaNum}`)}
            hitSlop={8}
          >
            <Text style={styles.myOrderLabel}>🧾 {misPedidos.length}</Text>
          </Pressable>
        )}
      </SafeAreaView>

      <View style={styles.toolbar}>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Buscar plato…"
          placeholderTextColor={Colors.textMuted}
          style={styles.input}
          autoCorrect={false}
        />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chips}
        >
          <Chip
            label="Todo"
            current={active === "all"}
            onPress={() => setActive("all")}
          />
          {categories.map((c) => (
            <Chip
              key={c.id}
              label={`${c.emoji} ${c.name}`}
              current={active === c.id}
              onPress={() => setActive(c.id)}
            />
          ))}
        </ScrollView>
      </View>

      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        stickySectionHeadersEnabled
        renderSectionHeader={({ section }) => (
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {section.emoji} {section.title}
            </Text>
          </View>
        )}
        renderItem={({ item }) => (
          <DishCard
            dish={item}
            onPress={() => router.push(`/dish/${item.id}`)}
            onPlus={() => add(item)}
          />
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>No hay platos que coincidan.</Text>
        }
        contentContainerStyle={styles.listContent}
      />

      {totalItems > 0 && (
        <View style={styles.cartBar}>
          <View>
            <Text style={styles.cartBarLabel}>
              {totalItems} {totalItems === 1 ? "artículo" : "artículos"} · Mesa{" "}
              {numero}
            </Text>
            <Text style={styles.cartBarTotal}>{formatPrice(totalPrice)}</Text>
          </View>
          <Pressable style={styles.cartBarButton} onPress={submitOrder}>
            <Text style={styles.cartBarButtonLabel}>🧾 Enviar pedido</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

function Chip({
  label,
  current,
  onPress,
}: {
  label: string;
  current: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.chip, current && styles.chipActive]}
    >
      <Text style={[styles.chipLabel, current && styles.chipLabelActive]}>
        {label}
      </Text>
    </Pressable>
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
    gap: Spacing.s,
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
    marginBottom: Spacing.s,
  },
  backLabel: {
    color: Colors.text,
    fontSize: 24,
    fontWeight: "800",
    lineHeight: 26,
    marginTop: -2,
  },
  myOrderButton: {
    backgroundColor: Colors.accentSoft,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.m,
    paddingVertical: Spacing.s,
    marginBottom: Spacing.s,
  },
  myOrderLabel: {
    color: Colors.accent,
    fontSize: 14,
    fontWeight: "800",
  },
  headerInfo: {
    marginBottom: Spacing.s,
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
    fontSize: 22,
    fontWeight: "900",
  },
  toolbar: {
    gap: Spacing.s,
    paddingHorizontal: Spacing.l,
    paddingBottom: Spacing.s,
  },
  input: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.l,
    paddingVertical: Spacing.m - 2,
    color: Colors.text,
    fontSize: 15,
  },
  chips: {
    gap: Spacing.s,
    paddingVertical: Spacing.xs,
  },
  chip: {
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.m,
    paddingVertical: 6,
  },
  chipActive: {
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
  },
  chipLabel: {
    color: Colors.textMuted,
    fontSize: 13,
    fontWeight: "600",
  },
  chipLabelActive: {
    color: "#09090b",
    fontWeight: "800",
  },
  listContent: {
    paddingBottom: Spacing.xxl,
  },
  sectionHeader: {
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.l,
    paddingTop: Spacing.l,
    paddingBottom: Spacing.xs + 2,
  },
  sectionTitle: {
    color: Colors.text,
    fontSize: 17,
    fontWeight: "800",
  },
  empty: {
    color: Colors.textMuted,
    textAlign: "center",
    padding: Spacing.xl,
  },
  cartBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    margin: Spacing.l,
    paddingLeft: Spacing.l,
    paddingRight: Spacing.s,
    paddingVertical: Spacing.s,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.full,
  },
  cartBarLabel: {
    color: Colors.textMuted,
    fontSize: 11,
  },
  cartBarTotal: {
    color: Colors.text,
    fontSize: 17,
    fontWeight: "900",
  },
  cartBarButton: {
    backgroundColor: Colors.accent,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.l,
    paddingVertical: Spacing.m,
  },
  cartBarButtonLabel: {
    color: "#09090b",
    fontSize: 14,
    fontWeight: "800",
  },
});
