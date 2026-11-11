"use client";

import { Environment, Float, Stars } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import type { ChapterKey } from "@/lib/chapters";

type EarthSceneProps = {
  activeKey: ChapterKey;
  progress: number;
  mouse: { x: number; y: number };
};

const chapterColors: Record<ChapterKey, string> = {
  orbit: "#00E5FF",
  ocean: "#2F80ED",
  rainforest: "#16A34A",
  desert: "#D6A84F",
  mountain: "#BFD7FF",
  city: "#FF4FD8"
};

export function EarthScene({ activeKey, progress, mouse }: EarthSceneProps) {
  const group = useRef<THREE.Group>(null);
  const earth = useRef<THREE.Mesh>(null);
  const clouds = useRef<THREE.Mesh>(null);
  const cityLights = useRef<THREE.Points>(null);
  const { camera, viewport } = useThree();

  const accent = useMemo(() => new THREE.Color(chapterColors[activeKey]), [activeKey]);

  useFrame((state, delta) => {
    const time = state.clock.elapsedTime;
    if (group.current) {
      const targetX = viewport.width > 7 ? 1.05 : 0;
      group.current.position.x = THREE.MathUtils.lerp(group.current.position.x, targetX, 0.04);
      group.current.rotation.y += delta * 0.09;
      group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, mouse.y * 0.12, 0.035);
      group.current.rotation.z = THREE.MathUtils.lerp(group.current.rotation.z, -mouse.x * 0.08, 0.035);
    }
    if (earth.current) earth.current.rotation.y += delta * 0.035;
    if (clouds.current) clouds.current.rotation.y += delta * 0.055;
    if (cityLights.current) cityLights.current.rotation.y += delta * 0.02;

    const cameraZ = 6.9 - progress * 1.35;
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, mouse.x * 0.52, 0.035);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, -mouse.y * 0.34, 0.035);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, cameraZ, 0.025);
    camera.lookAt(0, 0, 0);
  });

  return (
    <>
      <color attach="background" args={["#020203"]} />
      <fog attach="fog" args={["#020203", 7, 18]} />
      <ambientLight intensity={0.55} />
      <directionalLight position={[4, 2, 5]} intensity={2.8} color="#EAF7FF" />
      <pointLight position={[-3, 1, 2]} intensity={8} color={accent} />
      <Stars radius={60} depth={32} count={2200} factor={4} saturation={0} fade speed={0.45} />
      <Float speed={0.85} rotationIntensity={0.22} floatIntensity={0.32}>
        <group ref={group}>
          <EarthMesh refObject={earth} accent={accent} />
          <CloudLayer refObject={clouds} />
          <Atmosphere accent={accent} />
          <CityLights refObject={cityLights} active={activeKey === "city"} />
          <BiomeParticles activeKey={activeKey} accent={accent} />
        </group>
      </Float>
      <Environment preset="night" />
      <EffectComposer>
        <Bloom luminanceThreshold={0.2} mipmapBlur intensity={1.5} />
      </EffectComposer>
    </>
  );
}

function EarthMesh({ refObject, accent }: { refObject: React.RefObject<THREE.Mesh | null>; accent: THREE.Color }) {
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uAccent: { value: accent },
          uOcean: { value: new THREE.Color("#123B77") },
          uLand: { value: new THREE.Color("#1E5E45") }
        },
        vertexShader: `
          varying vec2 vUv;
          varying vec3 vNormal;
          void main() {
            vUv = uv;
            vNormal = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform vec3 uAccent;
          uniform vec3 uOcean;
          uniform vec3 uLand;
          varying vec2 vUv;
          varying vec3 vNormal;

          float hash(vec2 p) {
            return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
          }

          void main() {
            float continents = smoothstep(0.42, 0.74, hash(floor(vUv * vec2(18.0, 9.0))));
            float equator = smoothstep(0.48, 0.52, 1.0 - abs(vUv.y - 0.5));
            vec3 base = mix(uOcean, uLand, continents);
            base += uAccent * equator * 0.18;
            float rim = pow(1.0 - max(dot(vNormal, vec3(0.0, 0.0, 1.0)), 0.0), 2.4);
            gl_FragColor = vec4(base + rim * uAccent * 0.85, 1.0);
          }
        `
      }),
    [accent]
  );

  return (
    <mesh ref={refObject}>
      <sphereGeometry args={[1.72, 96, 96]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
}

function CloudLayer({ refObject }: { refObject: React.RefObject<THREE.Mesh | null> }) {
  return (
    <mesh ref={refObject}>
      <sphereGeometry args={[1.765, 64, 64]} />
      <meshBasicMaterial color="#ffffff" transparent opacity={0.13} wireframe />
    </mesh>
  );
}

function Atmosphere({ accent }: { accent: THREE.Color }) {
  return (
    <mesh scale={1.09}>
      <sphereGeometry args={[1.82, 64, 64]} />
      <meshBasicMaterial color={accent} transparent opacity={0.105} blending={THREE.AdditiveBlending} side={THREE.BackSide} />
    </mesh>
  );
}

function CityLights({ refObject, active }: { refObject: React.RefObject<THREE.Points | null>; active: boolean }) {
  const geometry = useMemo(() => {
    const count = 420;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 1.786;
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.cos(phi);
      positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geo;
  }, []);

  return (
    <points ref={refObject} geometry={geometry}>
      <pointsMaterial color="#FFDE8A" size={active ? 0.022 : 0.01} transparent opacity={active ? 0.85 : 0.22} blending={THREE.AdditiveBlending} />
    </points>
  );
}

function BiomeParticles({ activeKey, accent }: { activeKey: ChapterKey; accent: THREE.Color }) {
  const points = useRef<THREE.Points>(null);
  const geometry = useMemo(() => {
    const count = 1800;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      const radius = 2.25 + Math.random() * 3.5;
      const theta = Math.random() * Math.PI * 2;
      const y = (Math.random() - 0.5) * 4.2;
      positions[i * 3] = Math.cos(theta) * radius;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = Math.sin(theta) * radius;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geo;
  }, []);

  useFrame((state) => {
    if (!points.current) return;
    const speed = activeKey === "desert" ? 0.055 : activeKey === "ocean" ? 0.025 : 0.015;
    points.current.rotation.y = state.clock.elapsedTime * speed;
    points.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.08;
  });

  return (
    <points ref={points} geometry={geometry}>
      <pointsMaterial color={accent} size={activeKey === "city" ? 0.018 : 0.012} transparent opacity={0.42} blending={THREE.AdditiveBlending} depthWrite={false} />
    </points>
  );
}
