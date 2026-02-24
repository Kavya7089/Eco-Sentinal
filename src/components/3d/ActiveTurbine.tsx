import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { CameraShake } from '@react-three/drei';
import * as THREE from 'three';

interface ActiveTurbineProps {
    temperature?: number;
    status: 'SAFE' | 'CRITICAL';
}

const ActiveTurbine: React.FC<ActiveTurbineProps> = ({ temperature = 600, status }) => {
    const meshRef = useRef<THREE.Mesh>(null!);
    const glowRef = useRef<THREE.Mesh>(null!);

    // Normalize temperature: 600 -> 0 (slow), 950 -> 1 (fast)
    const speedFactor = Math.max(0, (temperature - 600) / 350);

    useFrame((state) => {
        // Base speed + variable based on temp
        const rotationSpeed = 0.005 + (speedFactor * 0.05);

        if (meshRef.current) {
            meshRef.current.rotation.y += rotationSpeed;
            meshRef.current.rotation.x += rotationSpeed * 0.5;

            // Pulse scale on critical
            if (status === 'CRITICAL') {
                const scale = 1 + Math.sin(state.clock.elapsedTime * 10) * 0.1;
                meshRef.current.scale.setScalar(scale);
            } else {
                meshRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
            }
        }

        if (glowRef.current) {
            // Counter-rotate glow
            glowRef.current.rotation.y -= rotationSpeed * 0.8;
            glowRef.current.rotation.z += rotationSpeed * 0.2;
        }
    });

    const color = status === 'CRITICAL' ? '#ff4d4d' : '#00ff9d';

    return (
        <group>
            {/* Core Turbine Logic visual */}
            <mesh ref={meshRef}>
                <icosahedronGeometry args={[2, 1]} />
                <meshStandardMaterial
                    color={color}
                    wireframe
                    emissive={color}
                    emissiveIntensity={status === 'CRITICAL' ? 2 : 0.5}
                    transparent
                    opacity={0.8}
                />
            </mesh>

            {/* Outer Halo */}
            <mesh ref={glowRef}>
                <torusGeometry args={[3, 0.02, 16, 100]} />
                <meshBasicMaterial color={color} transparent opacity={0.3} />
            </mesh>

            {/* Screen Shake Effect */}
            <CameraShake
                maxYaw={status === 'CRITICAL' ? 0.05 : 0}
                maxPitch={status === 'CRITICAL' ? 0.05 : 0}
                maxRoll={status === 'CRITICAL' ? 0.05 : 0}
                yawFrequency={status === 'CRITICAL' ? 0.5 : 0}
                pitchFrequency={status === 'CRITICAL' ? 0.5 : 0}
                rollFrequency={status === 'CRITICAL' ? 0.5 : 0}
                intensity={status === 'CRITICAL' ? 1 : 0}
                decay={false}
                decayRate={0.65}
            />
        </group>
    );
};

export default ActiveTurbine;
