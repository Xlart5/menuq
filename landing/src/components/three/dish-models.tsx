"use client";

// ---------- Materiales ----------
const M = {
  bun: { color: "#e2a05e", roughness: 0.85, metalness: 0 },
  bunTop: { color: "#d9944f", roughness: 0.8, metalness: 0 },
  patty: { color: "#7a4a2b", roughness: 0.6, metalness: 0.02 },
  cheese: { color: "#f6bf3f", roughness: 0.35, metalness: 0.05 },
  lettuce: { color: "#5cb85c", roughness: 0.5, metalness: 0 },
  tomato: { color: "#d9534f", roughness: 0.4, metalness: 0 },
  sesame: { color: "#f7e6c4", roughness: 0.6, metalness: 0 },
  crust: { color: "#c98b4b", roughness: 0.75, metalness: 0 },
  sauceRed: { color: "#bf3a2b", roughness: 0.35, metalness: 0 },
  cheeseTop: { color: "#f2c14e", roughness: 0.3, metalness: 0.02 },
  pepperoni: { color: "#a93c31", roughness: 0.45, metalness: 0 },
  basil: { color: "#3f8f4f", roughness: 0.6, metalness: 0 },
  plate: { color: "#f1ece2", roughness: 0.55, metalness: 0.05 },
  meat: { color: "#8a4b2b", roughness: 0.45, metalness: 0.02 },
  meatDark: { color: "#6e2f1e", roughness: 0.4, metalness: 0 },
  veg: { color: "#43a047", roughness: 0.55, metalness: 0 },
  onion: { color: "#c76f9d", roughness: 0.5, metalness: 0 },
  chip: { color: "#e8b15c", roughness: 0.7, metalness: 0 },
  chocolate: { color: "#4a2c1a", roughness: 0.55, metalness: 0 },
  chocolateDark: { color: "#3a2214", roughness: 0.5, metalness: 0 },
  cream: { color: "#f0e6d8", roughness: 0.45, metalness: 0 },
  cheesecake: { color: "#f2c66a", roughness: 0.5, metalness: 0 },
  mango: { color: "#f5a623", roughness: 0.35, metalness: 0 },
  glass: { color: "#ffffff", roughness: 0.05, metalness: 0.1, transparent: true, opacity: 0.22 },
  lemon: { color: "#f9d94c", roughness: 0.4, metalness: 0 },
  limeJuice: { color: "#f4ea9e", roughness: 0.2, metalness: 0 },
  maracuyaJuice: { color: "#f5a623", roughness: 0.2, metalness: 0 },
  ice: { color: "#eaf6ff", roughness: 0.1, metalness: 0, transparent: true, opacity: 0.85 },
  gold: { color: "#d4a942", metalness: 0.95, roughness: 0.18 },
};

function Ribs() {
  return (
    <group>
      {/* plato */}
      <mesh position={[0, -0.12, 0]} castShadow>
        <cylinderGeometry args={[0.85, 0.6, 0.09, 48]} />
        <meshStandardMaterial {...M.plate} />
      </mesh>
      {/* costillas */}
      {[1, 0, -1].map((i, idx) => (
        <group key={idx} position={[i * 0.24, 0.15 + (idx === 1 ? 0.12 : 0), 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <mesh castShadow>
            <capsuleGeometry args={[0.105, 0.62, 8, 20]} />
            <meshStandardMaterial {...M.meat} />
          </mesh>
        </group>
      ))}
      {/* salsa brillante */}
      <mesh position={[0, 0.36, 0]} scale={[1, 0.28, 1]} castShadow>
        <sphereGeometry args={[0.3, 24, 16]} />
        <meshStandardMaterial {...M.meatDark} />
      </mesh>
      {/* hueso */}
      {[0.38, -0.38].map((z, i) => (
        <mesh key={i} position={[0, 0.62, z]} rotation={[Math.PI, 0, 0]} castShadow>
          <cylinderGeometry args={[0.05, 0.05, 0.1, 16]} />
          <meshStandardMaterial {...M.sesame} />
        </mesh>
      ))}
    </group>
  );
}

function PlateDish({ veggies = false }: { veggies?: boolean }) {
  return (
    <group>
      <mesh position={[0, -0.14, 0]} castShadow>
        <cylinderGeometry args={[0.85, 0.6, 0.09, 48]} />
        <meshStandardMaterial {...M.plate} />
      </mesh>
      <mesh position={[0, 0.05, 0]} scale={[1.15, 0.35, 1.15]} castShadow>
        <sphereGeometry args={[0.5, 32, 20]} />
        <meshStandardMaterial {...M.meat} />
      </mesh>
      {veggies && (
        <>
          <mesh position={[0.15, 0.42, 0.28]} scale={[0.8, 0.5, 0.8]} castShadow>
            <sphereGeometry args={[0.11, 16, 12]} />
            <meshStandardMaterial {...M.veg} />
          </mesh>
          <mesh position={[-0.3, 0.42, 0.15]} scale={[0.9, 0.4, 0.9]} castShadow>
            <sphereGeometry args={[0.1, 16, 12]} />
            <meshStandardMaterial {...M.onion} />
          </mesh>
          <mesh position={[0.05, 0.42, -0.35]} scale={[0.8, 0.5, 0.8]} castShadow>
            <sphereGeometry args={[0.1, 16, 12]} />
            <meshStandardMaterial {...M.veg} />
          </mesh>
        </>
      )}
    </group>
  );
}

function Nachos() {
  const chips = [
    [0.25, 0.15, 0.3],
    [-0.3, 0.15, 0.28],
    [0.35, 0.15, -0.22],
    [-0.25, 0.15, -0.32],
    [0.02, 0.5, 0.02],
  ] as const;
  return (
    <group>
      <mesh position={[0, -0.18, 0]} castShadow>
        <cylinderGeometry args={[0.85, 0.42, 0.28, 48]} />
        <meshStandardMaterial {...M.crust} />
      </mesh>
      {chips.map((p, i) => (
        <mesh key={i} position={[p[0], p[1], p[2]]} rotation={[Math.PI / 2.8, 0, i]} castShadow>
          <cylinderGeometry args={[0.1, 0.045, 0.14, 6]} />
          <meshStandardMaterial {...M.chip} />
        </mesh>
      ))}
      <mesh position={[0, 0.42, 0]} scale={[1, 0.3, 1]} castShadow>
        <sphereGeometry args={[0.42, 24, 16]} />
        <meshStandardMaterial {...M.cheeseTop} />
      </mesh>
      <mesh position={[0.12, 0.2, -0.48]} rotation={[Math.PI, 0, 0]} castShadow>
        <cylinderGeometry args={[0.01, 0.05, 0.16, 12]} />
        <meshStandardMaterial {...M.sauceRed} />
      </mesh>
    </group>
  );
}

function CakeSlice({ flavor = "chocolate" }: { flavor?: string }) {
  const base = flavor === "cheesecake" ? M.cheesecake : M.chocolate;
  return (
    <group rotation={[0, -0.5, 0]}>
      {/* base del postre */}
      <mesh position={[0, 0.03, 0]} castShadow>
        <cylinderGeometry args={[0.72, 0.72, 0.5, 24, 1, false, 0, Math.PI / 3]} />
        <meshStandardMaterial {...base} />
      </mesh>
      {/* capa superior: chocolate / maracuyá */}
      <mesh position={[0, 0.42, 0]} castShadow>
        <cylinderGeometry args={[0.72, 0.72, 0.1, 24, 1, false, 0, Math.PI / 3]} />
        <meshStandardMaterial {...(flavor === "cheesecake" ? M.mango : M.chocolateDark)} roughness={0.2} />
      </mesh>
      {/* crema entre capas */}
      {flavor !== "cheesecake" && (
        <mesh position={[0, 0.26, 0]}>
          <cylinderGeometry args={[0.72, 0.72, 0.03, 24, 1, false, 0, Math.PI / 3]} />
          <meshStandardMaterial {...M.cream} />
        </mesh>
      )}
    </group>
  );
}

function Drink({ juice = "limonada" }: { juice?: string }) {
  const juiceColor = juice === "maracuya" ? M.maracuyaJuice : M.limeJuice;
  return (
    <group>
      <mesh castShadow>
        <cylinderGeometry args={[0.3, 0.34, 0.95, 32]} />
        <meshStandardMaterial {...M.glass} />
      </mesh>
      <mesh position={[0, -0.18, 0]} castShadow>
        <cylinderGeometry args={[0.26, 0.3, 0.6, 32]} />
        <meshStandardMaterial {...juiceColor} />
      </mesh>
      {/* hielo */}
      {[
        [0.1, 0.06, 0.08],
        [-0.12, 0.05, -0.06],
        [0.02, -0.04, 0.14],
      ].map((p, i) => (
        <mesh key={i} position={[p[0], p[1], p[2]]} castShadow>
          <boxGeometry args={[0.12, 0.12, 0.12]} />
          <meshStandardMaterial {...M.ice} />
        </mesh>
      ))}
      {/* rodaja de limón / adorno */}
      <mesh position={[0.31, 0.45, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.18, 0.18, 0.03, 32]} />
        <meshStandardMaterial {...M.lemon} />
      </mesh>
      {/* pajilla */}
      <mesh position={[0.12, 0.62, -0.1]} rotation={[0, 0, -0.35]} castShadow>
        <cylinderGeometry args={[0.025, 0.025, 0.8, 12]} />
        <meshStandardMaterial {...M.sauceRed} />
      </mesh>
    </group>
  );
}

function Sticks() {
  const positions = [
    [0, 0.05, 0],
    [0.02, 0.2, 0.03],
    [-0.03, 0.35, -0.02],
    [0.05, 0.5, 0.04],
  ] as const;
  return (
    <group>
      {positions.map((p, i) => (
        <mesh key={i} position={[p[0], p[1], p[2]]} rotation={[0, i * 1.2, (i % 2 ? 0.12 : -0.12)]} castShadow>
          <capsuleGeometry args={[0.07, 0.75, 6, 14]} />
          <meshStandardMaterial {...M.chip} />
        </mesh>
      ))}
      <mesh position={[0, 0.55, 0]} scale={[0.6, 0.3, 0.6]} castShadow>
        <sphereGeometry args={[0.26, 20, 14]} />
        <meshStandardMaterial {...M.sauceRed} />
      </mesh>
    </group>
  );
}

export function DishModel({ id }: { id: string }) {
  switch (id) {
    case "provoleta":
      return <Nachos />;
    case "chorizo":
      return <Sticks />;
    case "bife":
      return <PlateDish veggies />;
    case "ojo":
      return <Ribs />;
    case "asado":
      return <PlateDish veggies />;
    case "lomo":
      return <PlateDish veggies />;
    case "papas":
      return <PlateDish />;
    case "ensalada":
      return <PlateDish veggies />;
    case "torta":
      return <CakeSlice />;
    case "cheesecake":
      return <CakeSlice flavor="cheesecake" />;
    case "limonada":
      return <Drink />;
    case "vino":
      return <Drink juice="maracuya" />;
    default:
      return <EmojiFallback />;
  }
}

function EmojiFallback() {
  return (
    <mesh>
      <sphereGeometry args={[0.5, 32, 24]} />
      <meshStandardMaterial {...M.gold} />
    </mesh>
  );
}
