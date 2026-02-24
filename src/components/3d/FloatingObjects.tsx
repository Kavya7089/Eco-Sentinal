import React, { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Vector3 } from 'three';
import * as THREE from 'three';

const FloatingItem = ({ position, rotation, scale, type, color, speed }: any) => {
    const meshRef = useRef<THREE.Mesh>(null);
    const { mouse, viewport } = useThree();

    // Random drift offset
    const driftRef = useRef({
        x: Math.random() * 0.02 - 0.01,
        y: Math.random() * 0.02 - 0.01,
        rotX: Math.random() * 0.01 - 0.005,
        rotY: Math.random() * 0.01 - 0.005
    });

    useFrame((_state) => {
        if (!meshRef.current) return;

        // Constant slow drift
        meshRef.current.rotation.x += driftRef.current.rotX * speed;
        meshRef.current.rotation.y += driftRef.current.rotY * speed;

        // Mouse interaction (Magnetic Effect - Repulsion)
        const mousePos = new Vector3((mouse.x * viewport.width) / 2, (mouse.y * viewport.height) / 2, 0);
        const objectPos = meshRef.current.position.clone();
        const distance = mousePos.distanceTo(objectPos);

        // Repel within radius
        const repelRadius = 4;
        if (distance < repelRadius) {
            const repelDir = objectPos.sub(mousePos).normalize();
            const force = (repelRadius - distance) * 0.05;
            meshRef.current.position.add(repelDir.multiplyScalar(force));
        }

        // Return to original position (slowly)
        const originalPos = new Vector3(...position);
        meshRef.current.position.lerp(originalPos, 0.02);
    });

    const material = useMemo(() => (
        <meshStandardMaterial
            color={color}
            wireframe={true}
            transparent
            opacity={0.4}
            emissive={color}
            emissiveIntensity={0.2}
        />
    ), [color]);

    return (
        <mesh
            ref={meshRef}
            position={position}
            rotation={rotation}
            scale={scale}
        >
            {type === 'box' && <boxGeometry args={[1, 1, 1]} />}
            {type === 'torus' && <torusGeometry args={[0.8, 0.2, 16, 32]} />}
            {type === 'octa' && <octahedronGeometry args={[1, 0]} />}
            {type === 'cylinder' && <cylinderGeometry args={[0.5, 0.5, 2, 8]} />}
            {material}
        </mesh>
    );
};

const FloatingObjects: React.FC = () => {
    // Generate random objects
    const objects = useMemo(() => {
        const items = [];
        const types = ['box', 'torus', 'octa', 'cylinder'];
        const colors = ['#00ff9d', '#ff4d4d', '#ffffff', '#00cccc']; // Cyber Green, Alert Red, White, Cyan

        for (let i = 0; i < 20; i++) {
            items.push({
                position: [
                    (Math.random() - 0.5) * 25,
                    (Math.random() - 0.5) * 20,
                    (Math.random() - 0.5) * 10
                ],
                rotation: [Math.random() * Math.PI, Math.random() * Math.PI, 0],
                scale: Math.random() * 0.8 + 0.4,
                type: types[Math.floor(Math.random() * types.length)],
                color: colors[Math.floor(Math.random() * colors.length)],
                speed: Math.random() * 0.5 + 0.5
            });
        }
        return items;
    }, []);

    return (
        <group>
            {objects.map((obj, i) => (
                <FloatingItem key={i} {...obj} />
            ))}
        </group>
    );
};

export default FloatingObjects;
