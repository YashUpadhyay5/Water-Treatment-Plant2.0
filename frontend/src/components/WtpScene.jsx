import { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

function Platform({ layoutType }) {
  const spacing = layoutType === 'industrial' ? 3.5 : 2.2;
  const size = 12;
  return (
    <group position={[0, -0.05, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[size * 2, size * 2]} />
        <meshStandardMaterial color="#334155" metalness={0.2} roughness={0.8} />
      </mesh>
      <lineSegments geometry={new THREE.EdgesGeometry(new THREE.PlaneGeometry(size * 2, size * 2))}>
        <lineBasicMaterial color="#475569" />
      </lineSegments>
    </group>
  );
}

function Tank({ position, radius, height, color }) {
  return (
    <group position={position}>
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[radius, radius * 1.02, height, 24]} />
        <meshStandardMaterial color={color} metalness={0.3} roughness={0.5} />
      </mesh>
      <mesh position={[0, height / 2 + 0.02, 0]} castShadow>
        <cylinderGeometry args={[radius * 0.98, radius, 0.04, 24]} />
        <meshStandardMaterial color="#64748b" metalness={0.5} roughness={0.4} />
      </mesh>
    </group>
  );
}

function Pipe({ start, end, radius }) {
  const path = useMemo(() => {
    const p = new THREE.Vector3(...start);
    const e = new THREE.Vector3(...end);
    const curve = new THREE.LineCurve3(p, e);
    return curve;
  }, [start, end]);
  return (
    <mesh>
      <tubeGeometry args={[path, 8, radius, 12, false]} />
      <meshStandardMaterial color="#0ea5e9" metalness={0.4} roughness={0.5} />
    </mesh>
  );
}

function WtpModel({ flowRate, numberOfTanks, pipeDiameter, layoutType }) {
  const layoutTypeVal = layoutType === 'industrial' ? 'industrial' : 'compact';
  const spacing = layoutTypeVal === 'industrial' ? 3.2 : 2.0;
  const tankRadius = 0.6 + Math.min(flowRate / 500, 0.6);
  const tankHeight = 1.2 + Math.min(flowRate / 300, 1.2);
  const pipeRad = Math.max(0.08, Math.min(pipeDiameter / 100, 0.25));

  const n = Math.min(20, Math.max(1, numberOfTanks));
  const rows = layoutTypeVal === 'industrial' ? Math.ceil(Math.sqrt(n)) : Math.ceil(n / 3);
  const cols = layoutTypeVal === 'industrial' ? Math.ceil(n / rows) : Math.min(3, n);

  const positions = useMemo(() => {
    const out = [];
    let idx = 0;
    const startX = -((cols - 1) * spacing) / 2;
    const startZ = -((rows - 1) * spacing) / 2;
    for (let r = 0; r < rows && idx < n; r++) {
      for (let c = 0; c < cols && idx < n; c++) {
        out.push([startX + c * spacing, tankHeight / 2, startZ + r * spacing]);
        idx++;
      }
    }
    return out;
  }, [n, rows, cols, spacing, tankHeight]);

  const pipes = useMemo(() => {
    const out = [];
    for (let i = 0; i < positions.length - 1; i++) {
      const a = positions[i];
      const b = positions[i + 1];
      out.push({
        start: [a[0], a[1], a[2]],
        end: [b[0], b[1], b[2]],
      });
    }
    return out;
  }, [positions]);

  const tankColor = layoutTypeVal === 'industrial' ? '#0f172a' : '#0369a1';

  return (
    <group>
      <Platform layoutType={layoutTypeVal} />
      {positions.map((pos, i) => (
        <Tank key={i} position={pos} radius={tankRadius} height={tankHeight} color={tankColor} />
      ))}
      {pipes.map((p, i) => (
        <Pipe key={i} start={p.start} end={p.end} radius={pipeRad} />
      ))}
    </group>
  );
}

export default function WtpScene({ flowRate, numberOfTanks, pipeDiameter, layoutType, canvasRef }) {
  return (
    <div className="canvas-container" ref={canvasRef}>
      <Canvas shadows camera={{ position: [8, 6, 8], fov: 50 }} gl={{ preserveDrawingBuffer: true }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 15, 10]} intensity={1.2} castShadow shadow-mapSize={[1024, 1024]} shadow-camera-far={50} shadow-camera-left={-15} shadow-camera-right={15} shadow-camera-top={15} shadow-camera-bottom={-15} />
        <directionalLight position={[-5, 8, -5]} intensity={0.4} />
        <WtpModel flowRate={flowRate} numberOfTanks={numberOfTanks} pipeDiameter={pipeDiameter} layoutType={layoutType} />
        <OrbitControls enablePan minDistance={4} maxDistance={25} />
      </Canvas>
    </div>
  );
}
