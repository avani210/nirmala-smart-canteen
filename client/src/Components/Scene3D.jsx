import { Canvas } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, Environment } from '@react-three/drei';

function Scene3D() {
  return (
    <Canvas camera={{ position: [0, 0, 4.5], fov: 45 }} dpr={[1, 2]}>
      <ambientLight intensity={0.3} />
      <pointLight position={[5, 5, 5]} intensity={2} color="#ffffff" />
      <pointLight position={[-5, -3, -5]} intensity={1.5} color="#5588ff" />

      <Sphere args={[1.3, 128, 128]}>
        <MeshDistortMaterial
          color="#0a0a15"
          attach="material"
          distort={0.35}
          speed={1}
          roughness={0.15}
          metalness={0.9}
          envMapIntensity={1}
        />
      </Sphere>

      <Environment preset="city" />
    </Canvas>
  );
}

export default Scene3D;