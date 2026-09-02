"use client";

import { useMemo } from "react";
import * as THREE from "three";

export function makeEmojiTexture(emoji: string) {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.font = "400px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(emoji, 256, 292);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 8;
  return texture;
}

export function EmojiSprite({
  emoji,
  scale = 2,
  position,
}: {
  emoji: string;
  scale?: number;
  position: [number, number, number];
}) {
  const texture = useMemo(() => makeEmojiTexture(emoji), [emoji]);
  return (
    <sprite position={position} scale={[scale, scale, 1]}>
      <spriteMaterial
        map={texture}
        transparent
        depthWrite={false}
        toneMapped={false}
      />
    </sprite>
  );
}
