import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';

function Bubble({ position, scale }) {
  const ref = useRef();
  useFrame((_, delta) => {
    ref.current.position.y += delta * 0.2;
    if (ref.current.position.y > 8) ref.current.position.y = -4;
  });
  return (
    <Float speed={1.5} floatIntensity={0.5}>
      <mesh ref={ref} position={position} scale={scale}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshStandardMaterial color="#67e8f9" transparent opacity={0.4} roughness={0.2} metalness={0.1} />
      </mesh>
    </Float>
  );
}

function Particles() {
  const count = 80;
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 30;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return pos;
  }, []);
  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.08} color="#a5f3fc" transparent opacity={0.6} sizeAttenuation />
    </points>
  );
}

export default function WaterScene() {
  return (
    <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-primary-900/30 to-slate-900">
      <Canvas camera={{ position: [0, 0, 12], fov: 50 }} dpr={[1, 2]}>
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <directionalLight position={[-5, -5, 5]} intensity={0.5} />
        {[...Array(6)].map((_, i) => (
          <Bubble
            key={i}
            position={[(Math.random() - 0.5) * 14, (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 4]}
            scale={0.5 + Math.random() * 0.8}
          />
        ))}
        <Particles />
      </Canvas>
    </div>
  );
}
