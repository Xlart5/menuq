import { Image, Pressable, StyleSheet, Text, View } from "react-native";

import { Colors, Radius, Spacing } from "@/constants/theme";
import { Dish, formatPrice } from "@/data/menu";
import { dishImages } from "@/data/dish-images";

type Props = {
  dish: Dish;
  onPlus?: () => void;
  onPress: () => void;
  qty?: number;
};

export function DishCard({ dish, onPlus, onPress, qty = 0 }: Props) {
  const photo = dishImages[dish.id];
  return (
    <Pressable onPress={onPress} style={styles.card}>
      {photo ? (
        <Image source={photo} style={styles.photo} resizeMode="cover" />
      ) : (
        <View style={styles.emojiBox}>
          <Text style={styles.emoji}>{dish.emoji}</Text>
        </View>
      )}
      <View style={styles.info}>
        <View style={styles.nameRow}>
          <Text style={styles.name} numberOfLines={1}>
            {dish.name}
          </Text>
          {dish.popular && <Text style={styles.popularBadge}>⭐ Popular</Text>}
        </View>
        <Text style={styles.description} numberOfLines={2}>
          {dish.description}
        </Text>
        <Text style={styles.price}>{formatPrice(dish.price)}</Text>
      </View>
      {onPlus && (
        <View style={styles.rightCol}>
          <Pressable onPress={onPlus} style={styles.plusButton} hitSlop={8}>
            <Text style={styles.plusLabel}>+</Text>
          </Pressable>
          {qty > 0 && <Text style={styles.qty}>{qty}</Text>}
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.m,
    backgroundColor: Colors.surface,
    borderRadius: Radius.m,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.m,
    marginHorizontal: Spacing.l,
    marginVertical: Spacing.xs + 1,
  },
  emojiBox: {
    width: 64,
    height: 64,
    borderRadius: Radius.m,
    backgroundColor: Colors.accentSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  photo: {
    width: 64,
    height: 64,
    borderRadius: Radius.m,
    backgroundColor: Colors.surfaceAlt,
  },
  emoji: {
    fontSize: 30,
  },
  info: {
    flex: 1,
    gap: 2,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.s,
  },
  name: {
    color: Colors.text,
    fontSize: 15,
    fontWeight: "700",
    flexShrink: 1,
  },
  popularBadge: {
    color: Colors.accent,
    fontSize: 10,
    fontWeight: "700",
    backgroundColor: Colors.accentSoft,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Radius.full,
    overflow: "hidden",
  },
  description: {
    color: Colors.textMuted,
    fontSize: 12,
  },
  price: {
    color: Colors.accent,
    fontSize: 14,
    fontWeight: "800",
    marginTop: 2,
  },
  rightCol: {
    alignItems: "center",
    gap: Spacing.xs,
  },
  plusButton: {
    width: 34,
    height: 34,
    borderRadius: Radius.full,
    backgroundColor: Colors.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  plusLabel: {
    color: "#09090b",
    fontSize: 20,
    fontWeight: "800",
    lineHeight: 22,
  },
  qty: {
    color: Colors.textMuted,
    fontSize: 12,
    fontWeight: "700",
  },
});
