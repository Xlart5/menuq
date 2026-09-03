import { useRouter } from "expo-router";
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
import { Dish } from "@/data/menu";
import { useMenu } from "@/hooks/use-menu";

type SectionData = {
  title: string;
  emoji: string;
  data: Dish[];
};

export default function MenuGeneralScreen() {
  const router = useRouter();
  const { categories, dishes } = useMenu();
  const [active, setActive] = useState<string>("all");
  const [query, setQuery] = useState("");

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
          d.available !== false &&
          (q === "" ||
            d.name.toLowerCase().includes(q) ||
            d.description.toLowerCase().includes(q))
      ),
    }));
  }, [active, query, categories, dishes]);

  return (
    <View style={styles.container}>
      <SafeAreaView edges={["top"]} style={styles.safe}>
        <Pressable onPress={() => router.back()} style={styles.backButton} hitSlop={8}>
          <Text style={styles.backLabel}>‹</Text>
        </Pressable>
        <View>
          <Text style={styles.title}>📖 Menú general</Text>
          <Text style={styles.subtitle}>
            Solo consulta: precios y descriptivos para ofrecer a los clientes.
          </Text>
        </View>
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
          <DishCard dish={item} onPress={() => {}} />
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>No hay platos que coincidan.</Text>
        }
        contentContainerStyle={styles.listContent}
      />
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
    gap: Spacing.m,
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
    fontSize: 22,
    fontWeight: "900",
  },
  subtitle: {
    color: Colors.textMuted,
    fontSize: 12,
  },
  toolbar: {
    gap: Spacing.s,
    paddingHorizontal: Spacing.l,
    paddingVertical: Spacing.s,
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
    paddingBottom: Spacing.xxl * 2,
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
});
