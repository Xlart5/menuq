import { Tabs } from "expo-router/js-tabs";
import { Text } from "react-native";

import { Colors } from "@/constants/theme";
import { useOrders } from "@/context/orders";

function TabEmoji({ emoji }: { emoji: string }) {
  return (
    <Text style={{ fontSize: 18, marginTop: 4, marginBottom: -4 }}>{emoji}</Text>
  );
}

export default function TabsLayout() {
  const { pedidos } = useOrders();
  const active = pedidos.filter((p) => p.estado !== "entregado").length;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.accent,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarStyle: {
          backgroundColor: Colors.surface,
          borderTopColor: Colors.border,
        },
        tabBarLabelStyle: { fontSize: 12, fontWeight: "600" },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Mesas",
          tabBarIcon: () => <TabEmoji emoji="🪑" />,
        }}
      />
      <Tabs.Screen
        name="pedidos"
        options={{
          title: active > 0 ? `Pedidos (${active})` : "Pedidos",
          tabBarIcon: () => <TabEmoji emoji="🧾" />,
        }}
      />
    </Tabs>
  );
}
