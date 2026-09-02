import { useState } from "react";
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import QRCode from "react-native-qrcode-svg";

import { Colors, Radius, Spacing } from "@/constants/theme";
import { useMesas } from "@/context/mesas";
import { RESTAURANT } from "@/data/menu";

export default function MesasScreen() {
  const router = useRouter();
  const { mesas, addMesa, removeMesa } = useMesas();
  const [qrMesa, setQrMesa] = useState<number | null>(null);

  return (
    <View style={styles.container}>
      <SafeAreaView edges={["top"]} style={styles.safe}>
        <Text style={styles.badge}>{RESTAURANT.badge}</Text>
        <Text style={styles.title}>{RESTAURANT.name}</Text>
        <Text style={styles.subtitle}>
          Toca una mesa para el flujo de pedido, o mira su QR.
        </Text>
      </SafeAreaView>

      <FlatList
        data={mesas}
        numColumns={2}
        keyExtractor={(m) => String(m.numero)}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.grid}
        ListHeaderComponent={
          <Text style={styles.sectionLabel}>🌐 Mesas del local</Text>
        }
        renderItem={({ item }) => (
          <Pressable
            style={styles.mesaCard}
            onPress={() => router.push(`/mesa/${item.numero}`)}
            onLongPress={() => removeMesa(item.numero)}
          >
            <Text style={styles.mesaEmoji}>🪑</Text>
            <Text style={styles.mesaNumero}>Mesa {item.numero}</Text>
            <Pressable
              style={styles.qrButton}
              hitSlop={8}
              onPress={(e) => {
                e.stopPropagation();
                setQrMesa(item.numero);
              }}
            >
              <Text style={styles.qrButtonLabel}>Ver QR</Text>
            </Pressable>
          </Pressable>
        )}
        ListFooterComponent={
          <Pressable style={styles.addButton} onPress={addMesa}>
            <Text style={styles.addButtonLabel}>+ Nueva mesa</Text>
          </Pressable>
        }
      />

      <Modal
        visible={qrMesa !== null}
        transparent
        animationType="slide"
        onRequestClose={() => setQrMesa(null)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>QR de la Mesa {qrMesa}</Text>
            <View style={styles.qrBox}>
              {qrMesa !== null && (
                <QRCode
                  value={`menuq://mesa/${qrMesa}`}
                  size={200}
                  backgroundColor="#ffffff"
                  color="#111114"
                />
              )}
            </View>
            <Text style={styles.modalHint}>
              El cliente escanea y se abre el menú de esta mesa directo en su
              celular. (La URL usa el esquema menuq:// — en producción se
              conecta al hosting de la app).
            </Text>
            <Text style={styles.modalLink}>PRUEBA RÁPIDA → {`menuq://mesa/${qrMesa}`}</Text>
            <Pressable
              style={styles.modalClose}
              onPress={() => setQrMesa(null)}
            >
              <Text style={styles.modalCloseLabel}>Cerrar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
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
  badge: {
    color: Colors.accent,
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1.2,
  },
  title: {
    color: Colors.text,
    fontSize: 26,
    fontWeight: "900",
    marginTop: 2,
  },
  subtitle: {
    color: Colors.textMuted,
    fontSize: 13,
    marginTop: 4,
  },
  grid: {
    paddingHorizontal: Spacing.l,
    paddingBottom: Spacing.xxl * 2,
  },
  row: {
    gap: Spacing.m,
    marginTop: Spacing.m,
  },
  sectionLabel: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: "800",
    marginTop: Spacing.s,
  },
  mesaCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.m,
    alignItems: "center",
    padding: Spacing.l,
    gap: Spacing.s,
  },
  mesaEmoji: {
    fontSize: 34,
  },
  mesaNumero: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: "800",
  },
  qrButton: {
    backgroundColor: Colors.accentSoft,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.l,
    paddingVertical: 6,
  },
  qrButtonLabel: {
    color: Colors.accent,
    fontSize: 12,
    fontWeight: "800",
  },
  addButton: {
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: Colors.border,
    borderRadius: Radius.m,
    paddingVertical: Spacing.l,
    alignItems: "center",
    marginTop: Spacing.m,
  },
  addButtonLabel: {
    color: Colors.textMuted,
    fontSize: 14,
    fontWeight: "700",
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    alignItems: "center",
    justifyContent: "center",
    padding: Spacing.xl,
  },
  modalCard: {
    width: "100%",
    maxWidth: 340,
    backgroundColor: Colors.surface,
    borderRadius: Radius.l,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.xl,
    alignItems: "center",
    gap: Spacing.m,
  },
  modalTitle: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: "800",
  },
  qrBox: {
    padding: Spacing.m,
    backgroundColor: "#ffffff",
    borderRadius: Radius.m,
  },
  modalHint: {
    color: Colors.textMuted,
    fontSize: 12,
    textAlign: "center",
  },
  modalLink: {
    color: Colors.accent,
    fontSize: 11,
    fontWeight: "700",
  },
  modalClose: {
    backgroundColor: Colors.accent,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.m,
  },
  modalCloseLabel: {
    color: "#09090b",
    fontSize: 14,
    fontWeight: "800",
  },
});
