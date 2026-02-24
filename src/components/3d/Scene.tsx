import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import FloatingObjects from './FloatingObjects';
import ActiveTurbine from './ActiveTurbine';

interface SceneProps {
    temperature?: number;
    status: 'SAFE' | 'CRITICAL';
}

const Scene: React.FC<SceneProps> = ({ temperature, status }) => {
    return (
        <div className="fixed inset-0 z-0 bg-void-black">
            <Canvas
                camera={{ position: [0, 0, 15], fov: 45 }}
                gl={{ antialias: true, alpha: true }}
                dpr={[1, 2]}
            >
                <Suspense fallback={null}>
                    <ambientLight intensity={0.5} color={status === 'CRITICAL' ? '#ff4d4d' : '#00ff9d'} />
                    <pointLight position={[10, 10, 10]} intensity={1} color="#ffffff" />
                    <spotLight position={[-10, -10, -10]} angle={0.3} penumbra={1} intensity={1} color={status === 'CRITICAL' ? '#ff0000' : '#00ff9d'} />

                    <group position={[-5, 0, -5]}>
                        <FloatingObjects />
                    </group>

                    <group position={[0, 0, 0]}>
                        <ActiveTurbine temperature={temperature} status={status} />
                    </group>

                    <Environment preset="city" />
                </Suspense>

                <fog attach="fog" args={['#0a0a0a', 5, 25]} />
            </Canvas>
        </div>
    );
};

export default Scene;
