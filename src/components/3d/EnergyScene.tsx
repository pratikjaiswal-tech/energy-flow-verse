import { Canvas } from '@react-three/fiber';
import { OrbitControls, Float, MeshDistortMaterial, Sphere, Box, Torus } from '@react-three/drei';
import { Suspense, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function WindTurbine({ position }: { position: [number, number, number] }) {
  const bladesRef = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (bladesRef.current) bladesRef.current.rotation.z += delta * 2;
  });

  return (
    <group position={position}>
      <mesh position={[0, 1, 0]}>
        <cylinderGeometry args={[0.05, 0.08, 2, 8]} />
        <meshStandardMaterial color="#334155" />
      </mesh>
      <group ref={bladesRef} position={[0, 2.1, 0.05]}>
        {[0, 120, 240].map((angle, i) => (
          <mesh key={i} rotation={[0, 0, THREE.MathUtils.degToRad(angle)]} position={[0, 0.4, 0]}>
            <boxGeometry args={[0.06, 0.8, 0.02]} />
            <meshStandardMaterial color="#22c55e" emissive="#22c55e" emissiveIntensity={0.3} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

function EnergyOrb() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.position.y = Math.sin(clock.elapsedTime) * 0.3 + 2;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5}>
      <Sphere ref={ref} args={[0.3, 32, 32]} position={[0, 2, 0]}>
        <MeshDistortMaterial
          color="#22c55e"
          emissive="#22c55e"
          emissiveIntensity={0.8}
          distort={0.3}
          speed={3}
          transparent
          opacity={0.8}
        />
      </Sphere>
    </Float>
  );
}

function BlockchainNode({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.x = clock.elapsedTime * 0.5;
      ref.current.rotation.y = clock.elapsedTime * 0.3;
    }
  });

  return (
    <Float speed={1.5} floatIntensity={0.5}>
      <Box ref={ref} args={[0.4, 0.4, 0.4]} position={position}>
        <meshStandardMaterial
          color="#3b82f6"
          emissive="#3b82f6"
          emissiveIntensity={0.5}
          wireframe
        />
      </Box>
    </Float>
  );
}

function TokenRing() {
  return (
    <Float speed={1} rotationIntensity={1}>
      <Torus args={[1.5, 0.05, 16, 100]} position={[0, 1.5, 0]} rotation={[Math.PI / 4, 0, 0]}>
        <meshStandardMaterial
          color="#a855f7"
          emissive="#a855f7"
          emissiveIntensity={0.6}
          transparent
          opacity={0.6}
        />
      </Torus>
    </Float>
  );
}

function GridFloor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
      <planeGeometry args={[20, 20, 20, 20]} />
      <meshStandardMaterial
        color="#0a1628"
        wireframe
        transparent
        opacity={0.3}
      />
    </mesh>
  );
}

export default function EnergyScene() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas camera={{ position: [0, 3, 6], fov: 50 }} gl={{ alpha: true }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.3} />
          <pointLight position={[5, 5, 5]} intensity={1} color="#22c55e" />
          <pointLight position={[-5, 3, -5]} intensity={0.8} color="#3b82f6" />
          <pointLight position={[0, 5, 0]} intensity={0.5} color="#a855f7" />

          <EnergyOrb />
          <WindTurbine position={[-2, -0.5, -1]} />
          <WindTurbine position={[2.5, -0.5, -2]} />
          <BlockchainNode position={[-3, 1.5, 0]} />
          <BlockchainNode position={[3, 2, -1]} />
          <BlockchainNode position={[0, 3.5, -2]} />
          <TokenRing />
          <GridFloor />

          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate
            autoRotateSpeed={0.5}
            maxPolarAngle={Math.PI / 2.2}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
