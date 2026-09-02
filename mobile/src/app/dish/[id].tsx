import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Colors, Radius, Spacing } from "@/constants/theme";
import { useCart } from "@/context/cart";
import { getCategory, getDish, formatPrice } from "@/data/menu";

export default function DishScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { add } = useCart();
  const dish = getDish(id ?? "");
  const [qty, setQty] = useState(1);

  if (!dish) {
    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.notFound}>
          <Text style={styles.notFoundText}>Plato no encontrado 😢</Text>
        </SafeAreaView>
      </View>
    );
  }

  const category = getCategory(dish.categoryId);

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.modal}>
        <View style={styles.handleBar} />
        <View style={styles.hero}>
          <Text style={styles.heroEmoji}>{dish.emoji}</Text>
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.titleRow}>
            <Text style={styles.name} numberOfLines={2}>
              {dish.name}
            </Text>
            {dish.popular && <Text style={styles.popularBadge}>⭐ Popular</Text>}
          </View>
          {category && (
            <Text style={styles.category}>
              {category.emoji} {category.name}
            </Text>
          )}
          <Text style={styles.description}>{dish.description}</Text>

          <View style={styles.qtyRow}>
            <Text style={styles.qtyLabel}>Cantidad</Text>
            <View style={styles.stepper}>
              <Pressable
                onPress={() => setQty((v) => Math.max(1, v - 1))}
                style={styles.stepButton}
                hitSlop={6}
              >
                <Text style={styles.stepLabel}>−</Text>
              </Pressable>
              <Text style={styles.stepValue}>{qty}</Text>
              <Pressable
                onPress={() => setQty((v) => v + 1)}
                style={styles.stepButton}
                hitSlop={6}
              >
                <Text style={styles.stepLabel}>+</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <View>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>{formatPrice(dish.price * qty)}</Text>
          </View>
          <Pressable
            style={styles.primaryButton}
            onPress={() => {
              for (let i = 0; i < qty; i++) add(dish);
              router.back();
            }}
          >
            <Text style={styles.primaryButtonLabel}>Agregar al pedido</Text>
          </Pressable>
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
  modal: {
    flex: 1,
  },
  handleBar: {
    alignSelf: "center",
    width: 40,
    height: 4,
    borderRadius: Radius.full,
    backgroundColor: Colors.border,
    marginTop: Spacing.m,
  },
  hero: {
    margin: Spacing.l,
    borderRadius: Radius.l,
    backgroundColor: Colors.accentSoft,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.xxl,
  },
  heroEmoji: {
    fontSize: 72,
  },
  content: {
    paddingHorizontal: Spacing.l,
    gap: Spacing.s,
    paddingBottom: Spacing.l,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.s,
  },
  name: {
    color: Colors.text,
    fontSize: 24,
    fontWeight: "900",
    flexShrink: 1,
  },
  popularBadge: {
    color: Colors.accent,
    fontSize: 11,
    fontWeight: "700",
    backgroundColor: Colors.accentSoft,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Radius.full,
    overflow: "hidden",
  },
  category: {
    color: Colors.textMuted,
    fontSize: 13,
    fontWeight: "600",
  },
  description: {
    color: Colors.textMuted,
    fontSize: 14,
    lineHeight: 20,
  },
  qtyRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: Spacing.m,
  },
  qtyLabel: {
    color: Colors.text,
    fontSize: 15,
    fontWeight: "700",
  },
  stepper: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.l,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.m,
    paddingVertical: Spacing.s,
  },
  stepButton: {
    width: 30,
    height: 30,
    borderRadius: Radius.full,
    backgroundColor: Colors.surfaceAlt,
    alignItems: "center",
    justifyContent: "center",
  },
  stepLabel: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: "800",
    lineHeight: 20,
  },
  stepValue: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: "800",
    minWidth: 20,
    textAlign: "center",
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: Spacing.l,
    gap: Spacing.l,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  totalLabel: {
    color: Colors.textMuted,
    fontSize: 12,
  },
  totalValue: {
    color: Colors.text,
    fontSize: 20,
    fontWeight: "900",
  },
  primaryButton: {
    flex: 1,
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
  notFound: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  notFoundText: {
    color: Colors.textMuted,
    fontSize: 14,
  },
});
