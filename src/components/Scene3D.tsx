import { Canvas, useFrame } from "@react-three/fiber";
import {
  Float,
  MeshDistortMaterial,
  Sphere,
  TorusKnot,
  Icosahedron,
  Environment,
} from "@react-three/drei";
import { Suspense, useRef } from "react";
import type { Mesh } from "three";

function Knot() {
  const ref = useRef<Mesh>(null);
  useFrame((_, d) => {
    if (ref.current) ref.current.rotation.y += d * 0.2;
  });
  return (
    <Float speed={1.4} rotationIntensity={0.6} floatIntensity={1.2}>
      <TorusKnot ref={ref} args={[1.1, 0.4, 256, 64]}>
        <MeshDistortMaterial
          color="#5b9dff"
          distort={0.3}
          speed={1.5}
          roughness={0.1}
          metalness={0.8}
          clearcoat={1}
          clearcoatRoughness={0.1}
        />
      </TorusKnot>
    </Float>
  );
}

function Orbs() {
  return (
    <>
      <Float speed={2} rotationIntensity={1} floatIntensity={2}>
        <Sphere args={[0.45, 64, 64]} position={[2.3, 1.1, -0.5]}>
          <MeshDistortMaterial
            color="#7ee2c1"
            distort={0.5}
            speed={2}
            roughness={0.1}
            metalness={0.5}
            clearcoat={1}
          />
        </Sphere>
      </Float>
      <Float speed={1.6} rotationIntensity={0.8} floatIntensity={1.5}>
        <Icosahedron args={[0.35, 4]} position={[-2.2, -0.9, 0.5]}>
          <MeshDistortMaterial
            color="#a9c8ff"
            distort={0.3}
            speed={1.8}
            roughness={0.2}
            metalness={0.3}
            clearcoat={0.8}
          />
        </Icosahedron>
      </Float>
      <Float speed={1.2} rotationIntensity={0.5} floatIntensity={1}>
        <Sphere args={[0.22, 32, 32]} position={[-1.5, 1.6, 1]}>
          <meshPhysicalMaterial
            color="#c7f0ff"
            roughness={0.1}
            metalness={0.2}
            transmission={0.9}
            thickness={0.5}
            ior={1.5}
          />
        </Sphere>
      </Float>
    </>
  );
}

export function Scene3D({ className }: { className?: string }) {
  return (
    <div className={className}>
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }} dpr={[1, 2]}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1.5} />
        <pointLight position={[-5, -3, -5]} intensity={0.8} color="#7ee2c1" />
        <Suspense fallback={null}>
          <Environment preset="city" />
          <Knot />
          <Orbs />
        </Suspense>
      </Canvas>
    </div>
  );
}
