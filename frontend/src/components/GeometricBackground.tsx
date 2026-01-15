"use client";

import { useFrame } from "@react-three/fiber";
import { useRef, useEffect, useState } from "react";
import * as THREE from "three";

interface LowPolyShapeProps {
  position: [number, number, number];
  color: string;
  speed: number;
  rotationSpeed: number;
  type: 'cube' | 'octahedron' | 'icosahedron';
}

function LowPolyShape({ position, color, speed, rotationSpeed, type }: LowPolyShapeProps) {
  const mesh = useRef<THREE.Mesh>(null);
  const [initialRotation] = useState(() => ({
    x: Math.random() * Math.PI,
    y: Math.random() * Math.PI,
  }));
  
  // Set initial rotation in effect (not during render)
  useEffect(() => {
    if (mesh.current) {
      mesh.current.rotation.x = initialRotation.x;
      mesh.current.rotation.y = initialRotation.y;
    }
  }, [initialRotation]);

  useFrame((state) => {
    if (!mesh.current) return;
    
    // Float animation
    mesh.current.position.y += Math.sin(state.clock.elapsedTime * speed) * 0.002;
    
    // Rotate animation
    mesh.current.rotation.x += rotationSpeed;
    mesh.current.rotation.y += rotationSpeed * 0.5;

    // Mouse parallax (subtle)
    const { mouse } = state;
    mesh.current.position.x += (mouse.x * 2 - mesh.current.position.x) * 0.001;
    mesh.current.position.y += (-mouse.y * 2 - mesh.current.position.y) * 0.001;
  });

  return (
    <mesh ref={mesh} position={position}>
      {type === 'cube' ? (
        <boxGeometry args={[1.5, 1.5, 1.5]} />
      ) : type === 'octahedron' ? (
        <octahedronGeometry args={[1, 0]} />
      ) : (
        <icosahedronGeometry args={[1, 0]} />
      )}
      <meshStandardMaterial 
        color={color} 
        roughness={0.3} 
        metalness={0.8}
        wireframe={true}
        emissive={color}
        emissiveIntensity={0.2}
      />
    </mesh>
  );
}

export default function GeometricBackground() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1.5} color="#FF6B35" />
      <pointLight position={[-10, -10, -10]} intensity={1.5} color="#00D9A3" />
      
      {/* Scattered Low Poly Shapes */}
      <LowPolyShape position={[-5, 2, 0]} color="#00D9A3" speed={1} rotationSpeed={0.002} type="icosahedron" />
      <LowPolyShape position={[7, -3, -2]} color="#FF6B35" speed={0.8} rotationSpeed={0.003} type="octahedron" />
      <LowPolyShape position={[-6, -4, -5]} color="#FFC729" speed={1.2} rotationSpeed={0.001} type="cube" />
      
      <LowPolyShape position={[8, 4, -8]} color="#161B33" speed={0.5} rotationSpeed={0.002} type="icosahedron" />
      <LowPolyShape position={[0, -6, -3]} color="#2A3150" speed={0.9} rotationSpeed={0.004} type="octahedron" />
    </>
  );
}
