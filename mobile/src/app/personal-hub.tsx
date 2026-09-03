import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Colors, Radius, Spacing } from "@/constants/theme";
import { useStaff } from "@/hooks/use-staff";
import {
  asignarMesa,
  cambiarMesa,
  fetchStaffData,
  liberarMesa,
  updateOrderEstado,
} from "@/lib/staff-api";
import { formatPrice } from "@/data/menu";

const estadoLabel: Record<string, string> = {
  enviado: "Nuevo",
  en_preparacion: "Cocinando",
  listo: "¡Listo para recoger!",
  en_camino: "En camino",
  entregado: "Entregado",
  pagado: "Pagado",
};

export default function PersonalHubScreen() {
  const router = useRouter();
  const { staff, setStaff } = useStaff();
  const [data, setData] = useState<Awaited<ReturnType<typeof fetchStaffData>> | null>(null);
  const [tab, setTab] = useState<"mesas" | "pedidos" | "despacho" | "propinas">("mesas");
  const [msg, setMsg] = useState("");
  const [cambio, setCambio] = useState<{ orderId: string; oldMesa: number } | null>(null);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!staff) {
      router.replace("/");
      return;
    }
    const load = () => {
      fetchStaffData().then(setData).catch(() => {});
    };
    load();
    timer.current = setInterval(load, 8000);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [staff, router]);

  if (!staff) return null;

  const nombre = staff.nombre;
  const misMesas = (data?.asignaciones ?? []).filter(
    (a) => a.estado === "asignada" && a.mesero === nombre
  );
  const numerosMisMesas = misMesas.map((a) => a.mesa);
  const mesasDemas = (data?.asignaciones ?? []).filter(
    (a) => a.estado === "asignada" && a.mesero !== nombre
  );
  const numerosLibres = (data?.numeros ?? []).filter(
    (n) =>
      !misMesas.some((a) => a.mesa === n) &&
      !mesasDemas.some((a) => a.mesa === n)
  );

  const pedidosMios = (data?.orders ?? []).filter((o) =>
    numerosMisMesas.includes(o.mesa)
  );

  const propinasMias = (data?.pagos ?? [])
    .filter((p) => numerosMisMesas.includes(p.mesa))
    .reduce<Record<number, { monto: number; propina: number }>>((acc, p) => {
      acc[p.mesa] = {
        monto: (acc[p.mesa]?.monto ?? 0) + p.monto,
        propina: (acc[p.mesa]?.propina ?? 0) + p.propina,
      };
      return acc;
    }, {});

  const toggleMesa = async (mesa: number, asignar: boolean) => {
    const ok = asignar
      ? await asignarMesa(mesa, nombre)
      : await liberarMesa(mesa);
    setMsg(
      ok
        ? asignar
          ? `Mesa ${mesa} asignada a ${nombre} 🪑`
          : `Mesa ${mesa} liberada`
        : "No se pudo actualizar. Intentá de nuevo."
    );
    setTimeout(() => setMsg(""), 4000);
    fetchStaffData().then(setData).catch(() => {});
  };

  const marcarEstado = async (id: string, estado: string) => {
    const ok = await updateOrderEstado(id, estado);
    setMsg(ok ? "Estado actualizado ✔" : "No se pudo actualizar.");
    setTimeout(() => setMsg(""), 3000);
    fetchStaffData().then(setData).catch(() => {});
  };

  const confirmarCambio = async (newMesa: number) => {
    if (!cambio) return;
    const ok = await cambiarMesa(cambio.orderId, cambio.oldMesa, newMesa, nombre);
    setMsg(
      ok
        ? `Pedido movido a la Mesa ${newMesa} ✔`
        : "No se pudo mover. Intentá de nuevo."
    );
    setTimeout(() => setMsg(""), 4000);
    setCambio(null);
    fetchStaffData().then(setData).catch(() => {});
  };

  const despacho = pedidosMios.filter(
    (o) => o.estado === "listo" || o.estado === "en_camino"
  );

  return (
    <View style={styles.container}>
      <SafeAreaView edges={["top"]} style={styles.safe}>
        <Pressable onPress={() => router.back()} style={styles.backButton} hitSlop={8}>
          <Text style={styles.backLabel}>‹</Text>
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>🧑‍🍳 Salón de {nombre}</Text>
          <Text style={styles.subtitle}>
            Escaneá el QR de la mesa para asignarte (o tocá la mesa en esta
            pantalla).
          </Text>
        </View>
        <Pressable
          onPress={() => {
            setStaff(null);
            router.replace("/");
          }}
          style={styles.logoutButton}
          hitSlop={8}
        >
          <Text style={styles.logoutLabel}>Salir</Text>
        </Pressable>
      </SafeAreaView>

      <View style={styles.tabs}>
        {(
          [
            ["mesas", `🪑 Mesas (${misMesas.length})`],
            ["pedidos", `🧾 Pedidos (${pedidosMios.length})`],
            ["despacho", `🏃 Despacho (${despacho.length})`],
            ["propinas", "💰 Propinas"],
          ] as const
        ).map(([id, label]) => (
          <Pressable
            key={id}
            onPress={() => setTab(id)}
            style={[styles.tab, tab === id && styles.tabActive]}
          >
            <Text style={[styles.tabLabel, tab === id && styles.tabLabelActive]}>
              {label}
            </Text>
          </Pressable>
        ))}
      </View>

      {msg !== "" && <Text style={styles.msg}>✅ {msg}</Text>}

      <ScrollView contentContainerStyle={styles.content}>
        {tab === "mesas" && (
          <>
            <Text style={styles.sectionTitle}>Mis mesas asignadas</Text>
            <View style={styles.grid}>
              {misMesas.map((a) => (
                <Pressable
                  key={a.mesa}
                  style={[styles.mesaCard, styles.mesaMine]}
                  onPress={() => toggleMesa(a.mesa, false)}
                >
                  <Text style={styles.mesaEmoji}>🪑</Text>
                  <Text style={styles.mesaNumero}>Mesa {a.mesa}</Text>
                  <Text style={styles.mesaAction}>Liberar</Text>
                </Pressable>
              ))}
            </View>

            <Text style={styles.sectionTitle}>Mesas libres (asignaté)</Text>
            <View style={styles.grid}>
              {numerosLibres.map((n) => (
                <Pressable
                  key={n}
                  style={styles.mesaCard}
                  onPress={() => toggleMesa(n, true)}
                >
                  <Text style={styles.mesaEmoji}>📸</Text>
                  <Text style={styles.mesaNumero}>Mesa {n}</Text>
                  <Text style={styles.mesaAction}>Asignar</Text>
                </Pressable>
              ))}
            </View>
            {numerosLibres.length === 0 && (
              <Text style={styles.emptyText}>
                Todas las mesas están asignadas.
              </Text>
            )}

            <Text style={styles.sectionTitle}>Ocupadas por otros</Text>
            <View style={styles.grid}>
              {mesasDemas.map((a) => (
                <View key={a.mesa} style={[styles.mesaCard, styles.mesaOther]}>
                  <Text style={styles.mesaEmoji}>👥</Text>
                  <Text style={styles.mesaNumero}>
                    Mesa {a.mesa} · {a.mesero}
                  </Text>
                </View>
              ))}
            </View>
            {mesasDemas.length === 0 && (
              <Text style={styles.emptyText}>Nadie más tiene mesas aún.</Text>
            )}
          </>
        )}

        {tab === "pedidos" && (
          <>
            {pedidosMios.map((o) => (
              <View key={o.id} style={styles.orderCard}>
                <View style={styles.orderHeader}>
                  <Text style={styles.orderId}>
                    🪑 Mesa {o.mesa} · {o.id}
                  </Text>
                  <Text style={styles.orderTotal}>{formatPrice(o.total)}</Text>
                </View>
                <Text
                  style={[
                    styles.orderEstado,
                    {
                      color:
                        o.estado === "pagado"
                          ? Colors.success
                          : o.estado === "en_preparacion"
                            ? "#38bdf8"
                            : o.estado === "listo"
                              ? "#a78bfa"
                              : Colors.accent,
                    },
                  ]}
                >
                  {estadoLabel[o.estado] ?? o.estado}
                </Text>
                {o.estado !== "pagado" && o.estado !== "entregado" && (
                  <Pressable
                    style={styles.actionButton}
                    onPress={() =>
                      setCambio({ orderId: o.id, oldMesa: o.mesa })
                    }
                  >
                    <Text style={styles.actionLabel}>🔄 Cambiar de mesa</Text>
                  </Pressable>
                )}
              </View>
            ))}
            {pedidosMios.length === 0 && (
              <Text style={styles.emptyText}>
                Sin pedidos en tus mesas por ahora.
              </Text>
            )}
          </>
        )}

        {tab === "despacho" && (
          <>
            {despacho.map((o) => (
              <View key={o.id} style={styles.orderCard}>
                <View style={styles.orderHeader}>
                  <Text style={styles.orderId}>
                    🔔 Mesa {o.mesa} · {o.id}
                  </Text>
                  <Text style={styles.orderTotal}>{formatPrice(o.total)}</Text>
                </View>
                <Text style={styles.orderEstado}>
                  {estadoLabel[o.estado] ?? o.estado} —{" "}
                  {o.items.reduce((s, i) => s + i.qty, 0)} artículo(s)
                </Text>
                <Pressable
                  style={styles.actionButton}
                  onPress={() =>
                    marcarEstado(
                      o.id,
                      o.estado === "listo" ? "en_camino" : "entregado"
                    )
                  }
                >
                  <Text style={styles.actionLabel}>
                    {o.estado === "listo"
                      ? "🏃 Voy en camino"
                      : "✅ Entregado a la mesa"}
                  </Text>
                </Pressable>
              </View>
            ))}
            {despacho.length === 0 && (
              <Text style={styles.emptyText}>
                Cuando cocina marque un pedido listo, lo verás acá para
                recogerlo.
              </Text>
            )}
          </>
        )}

        {tab === "propinas" && (
          <>
            {Object.entries(propinasMias).map(([mesa, p]) => (
              <View key={mesa} style={styles.orderCard}>
                <Text style={styles.orderId}>🪑 Mesa {mesa}</Text>
                <View style={styles.orderHeader}>
                  <Text style={styles.orderEstado}>Ingresos: {formatPrice(p.monto)}</Text>
                  <Text style={styles.orderTotal}>
                    Propina: {formatPrice(p.propina)}
                  </Text>
                </View>
              </View>
            ))}
            {Object.keys(propinasMias).length === 0 && (
              <Text style={styles.emptyText}>
                Aún no hay propinas en tus mesas.
              </Text>
            )}
          </>
        )}
      </ScrollView>

      {cambio && (
        <View style={styles.changeOverlay}>
          <View style={styles.changeCard}>
            <Text style={styles.changeTitle}>
              Mover pedido a otra mesa
            </Text>
            <Text style={styles.changeSub}>
              El cliente cambió: todo el pedido se mueve con él.
            </Text>
            <View style={styles.grid}>
              {numerosLibres.map((n) => (
                <Pressable
                  key={n}
                  style={styles.mesaCard}
                  onPress={() => confirmarCambio(n)}
                >
                  <Text style={styles.mesaEmoji}>🪑</Text>
                  <Text style={styles.mesaNumero}>Mesa {n}</Text>
                  <Text style={styles.mesaAction}>Elegir</Text>
                </Pressable>
              ))}
            </View>
            {numerosLibres.length === 0 && (
              <Text style={styles.emptyText}>
                No hay mesas libres para moverlo.
              </Text>
            )}
            <Pressable
              style={styles.logoutButton}
              onPress={() => setCambio(null)}
            >
              <Text style={styles.logoutLabel}>Cancelar</Text>
            </Pressable>
          </View>
        </View>
      )}
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
    fontSize: 20,
    fontWeight: "900",
  },
  subtitle: {
    color: Colors.textMuted,
    fontSize: 12,
  },
  logoutButton: {
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.m,
    paddingVertical: Spacing.s,
  },
  logoutLabel: {
    color: Colors.textMuted,
    fontSize: 12,
    fontWeight: "700",
  },
  tabs: {
    flexDirection: "row",
    gap: Spacing.s,
    paddingHorizontal: Spacing.l,
    paddingBottom: Spacing.s,
  },
  tab: {
    flex: 1,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    paddingVertical: Spacing.s,
    alignItems: "center",
  },
  tabActive: {
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
  },
  tabLabel: {
    color: Colors.textMuted,
    fontSize: 12,
    fontWeight: "700",
  },
  tabLabelActive: {
    color: "#09090b",
    fontWeight: "800",
  },
  msg: {
    color: Colors.success,
    fontSize: 13,
    fontWeight: "700",
    paddingHorizontal: Spacing.l,
    paddingBottom: Spacing.s,
  },
  content: {
    paddingHorizontal: Spacing.l,
    paddingBottom: Spacing.xxl * 2,
  },
  sectionTitle: {
    color: Colors.text,
    fontSize: 15,
    fontWeight: "800",
    marginTop: Spacing.l,
    marginBottom: Spacing.s,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.m,
  },
  mesaCard: {
    minWidth: 120,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.m,
    padding: Spacing.m,
    alignItems: "center",
    gap: 2,
  },
  mesaMine: {
    borderColor: Colors.accent,
    backgroundColor: Colors.accentSoft,
  },
  mesaOther: {
    opacity: 0.65,
  },
  mesaEmoji: {
    fontSize: 26,
  },
  mesaNumero: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: "800",
  },
  mesaAction: {
    color: Colors.accent,
    fontSize: 11,
    fontWeight: "700",
  },
  emptyText: {
    color: Colors.textMuted,
    fontSize: 13,
    marginTop: Spacing.s,
  },
  orderCard: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.m,
    padding: Spacing.m,
    marginTop: Spacing.m,
    gap: Spacing.s,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  orderId: {
    color: Colors.text,
    fontSize: 13,
    fontWeight: "800",
  },
  orderTotal: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: "900",
  },
  orderEstado: {
    fontSize: 12,
    fontWeight: "800",
  },
  actionButton: {
    backgroundColor: Colors.accentSoft,
    borderRadius: Radius.full,
    paddingVertical: Spacing.m - 2,
    alignItems: "center",
  },
  actionLabel: {
    color: Colors.accent,
    fontSize: 13,
    fontWeight: "800",
  },
  changeOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    backgroundColor: "rgba(0,0,0,0.75)",
    alignItems: "center",
    justifyContent: "center",
    padding: Spacing.l,
  },
  changeCard: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.l,
    padding: Spacing.xl,
    gap: Spacing.l,
  },
  changeTitle: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: "900",
  },
  changeSub: {
    color: Colors.textMuted,
    fontSize: 13,
  },
});
