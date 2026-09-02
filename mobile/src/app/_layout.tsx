import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { Colors } from "@/constants/theme";
import { CartProvider } from "@/context/cart";
import { MesasProvider } from "@/context/mesas";
import { OrdersProvider } from "@/context/orders";

export default function RootLayout() {
  return (
    <CartProvider>
      <MesasProvider>
        <OrdersProvider>
          <StatusBar style="light" />
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: Colors.background },
            }}
          >
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="mesa/[numero]" />
            <Stack.Screen
              name="dish/[id]"
              options={{ presentation: "modal", animation: "slide_from_bottom" }}
            />
          </Stack>
        </OrdersProvider>
      </MesasProvider>
    </CartProvider>
  );
}
