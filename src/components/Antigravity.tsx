"use client";

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';

interface AntigravityProps {
    count?: number;
    magnetRadius?: number;
    ringRadius?: number;
    waveSpeed?: number;
    waveAmplitude?: number;
    particleSize?: number;
    lerpSpeed?: number;
    color?: string;
    autoAnimate?: boolean;
    particleVariance?: number;
    rotationSpeed?: number;
    depthFactor?: number;
    pulseSpeed?: number;
    particleShape?: 'capsule' | 'sphere' | 'box' | 'tetrahedron';
    fieldStrength?: number;
}

const AntigravityInner: React.FC<AntigravityProps> = ({
    count = 2000,
    magnetRadius = 15,
    ringRadius = 10,
    waveSpeed = 0.3,
    waveAmplitude = 0.8,
    particleSize = 0.6,
    lerpSpeed = 0.1,
    color = '#4285F4',
    autoAnimate = true,
    particleVariance = 1,
    rotationSpeed = 0,
    depthFactor = 1,
    pulseSpeed = 2,
    particleShape = 'tetrahedron',
    fieldStrength = 10
}) => {
    const meshRef = useRef<THREE.InstancedMesh>(null);
    const { viewport } = useThree();
    const dummy = useMemo(() => new THREE.Object3D(), []);

    const lastMousePos = useRef({ x: 0, y: 0 });
    const lastMouseMoveTime = useRef(0);
    const virtualMouse = useRef({ x: 0, y: 0 });
    const targetMouse = useRef({ x: 0, y: 0 });

    const particles = useMemo(() => {
        const temp = [];
        const width = viewport.width || 100;
        const height = viewport.height || 100;

        for (let i = 0; i < count; i++) {
            const t = Math.random() * 100;
            const factor = 20 + Math.random() * 100;
            const speed = 0.005 + Math.random() / 400;
            const xFactor = -50 + Math.random() * 100;
            const yFactor = -50 + Math.random() * 100;
            const zFactor = -50 + Math.random() * 100;

            const x = (Math.random() - 0.5) * width * 1.5;
            const y = (Math.random() - 0.5) * height * 1.5;
            const z = (Math.random() - 0.5) * 30;

            const randomRadiusOffset = (Math.random() - 0.5) * 2;

            temp.push({
                t,
                factor,
                speed,
                xFactor,
                yFactor,
                zFactor,
                mx: x,
                my: y,
                mz: z,
                cx: x,
                cy: y,
                cz: z,
                vx: 0,
                vy: 0,
                vz: 0,
                randomRadiusOffset,
                baseScale: 0.3 + Math.random() * 0.7
            });
        }
        return temp;
    }, [count, viewport.width, viewport.height]);

    useFrame(state => {
        const mesh = meshRef.current;
        if (!mesh) return;

        const { viewport: v, pointer: m } = state;
        const frameTime = state.clock.getElapsedTime();

        const mouseDist = Math.sqrt(Math.pow(m.x - lastMousePos.current.x, 2) + Math.pow(m.y - lastMousePos.current.y, 2));

        if (mouseDist > 0.001) {
            lastMouseMoveTime.current = Date.now();
            lastMousePos.current = { x: m.x, y: m.y };
        }

        let destX = (m.x * v.width) / 2;
        let destY = (m.y * v.height) / 2;

        if (autoAnimate && Date.now() - lastMouseMoveTime.current > 1500) {
            destX = Math.sin(frameTime * 0.3) * (v.width / 3);
            destY = Math.cos(frameTime * 0.4) * (v.height / 3);
        }

        const smoothFactor = 0.12;
        targetMouse.current.x += (destX - targetMouse.current.x) * smoothFactor;
        targetMouse.current.y += (destY - targetMouse.current.y) * smoothFactor;

        virtualMouse.current.x += (targetMouse.current.x - virtualMouse.current.x) * 0.15;
        virtualMouse.current.y += (targetMouse.current.y - virtualMouse.current.y) * 0.15;

        const targetX = virtualMouse.current.x;
        const targetY = virtualMouse.current.y;

        const globalRotation = frameTime * rotationSpeed;

        particles.forEach((particle, i) => {
            let { t, speed, mx, my, mz, cz, randomRadiusOffset, baseScale } = particle;

            t = particle.t += speed / 2;

            const projectionFactor = 1 - cz / 50;
            const projectedTargetX = targetX * projectionFactor;
            const projectedTargetY = targetY * projectionFactor;

            const dx = mx - projectedTargetX;
            const dy = my - projectedTargetY;
            const dist = Math.sqrt(dx * dx + dy * dy);

            let targetPos = { x: mx, y: my, z: mz * depthFactor };

            if (dist < magnetRadius) {
                const angle = Math.atan2(dy, dx) + globalRotation;
                const wave = Math.sin(t * waveSpeed + angle) * (0.5 * waveAmplitude);
                const deviation = randomRadiusOffset * (5 / (fieldStrength + 0.1));
                const currentRingRadius = ringRadius + wave + deviation;

                targetPos.x = projectedTargetX + currentRingRadius * Math.cos(angle);
                targetPos.y = projectedTargetY + currentRingRadius * Math.sin(angle);
                targetPos.z = mz * depthFactor + Math.sin(t) * (0.5 * waveAmplitude * depthFactor);
            }

            particle.cx += (targetPos.x - particle.cx) * lerpSpeed;
            particle.cy += (targetPos.y - particle.cy) * lerpSpeed;
            particle.cz += (targetPos.z - particle.cz) * lerpSpeed;

            dummy.position.set(particle.cx, particle.cy, particle.cz);

            dummy.lookAt(projectedTargetX, projectedTargetY, particle.cz);

            // Random rotation for debris/shard look
            dummy.rotation.x = frameTime * (i % 2 === 0 ? 1 : -1);
            dummy.rotation.y = frameTime * 0.5 * (i % 3 === 0 ? 1 : -1);
            dummy.rotation.z = frameTime * 0.2;

            const currentDistToMouse = Math.sqrt(
                Math.pow(particle.cx - projectedTargetX, 2) + Math.pow(particle.cy - projectedTargetY, 2)
            );

            const distFromRing = Math.abs(currentDistToMouse - ringRadius);

            let scaleFactor = 1 - distFromRing / 15;
            scaleFactor = Math.max(0.1, Math.min(1, scaleFactor));

            const pulse = (Math.sin(t * pulseSpeed + i) * 0.2 + 1);
            const finalScale = scaleFactor * baseScale * pulse * particleSize;

            dummy.scale.set(finalScale, finalScale, finalScale);
            dummy.updateMatrix();

            mesh.setMatrixAt(i, dummy.matrix);
        });

        mesh.instanceMatrix.needsUpdate = true;
    });

    return (
        <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
            {particleShape === 'capsule' && <capsuleGeometry args={[0.05, 0.4, 4, 8]} />}
            {particleShape === 'sphere' && <sphereGeometry args={[0.1, 8, 8]} />}
            {particleShape === 'box' && <boxGeometry args={[0.15, 0.15, 0.15]} />}
            {particleShape === 'tetrahedron' && <tetrahedronGeometry args={[0.2, 0]} />}
            <meshBasicMaterial color={color} transparent opacity={0.85} side={THREE.DoubleSide} />
        </instancedMesh>
    );
};

const Antigravity: React.FC<AntigravityProps> = props => {
    return (
        <Canvas camera={{ position: [0, 0, 50], fov: 35 }}>
            <AntigravityInner {...props} />
        </Canvas>
    );
};

export default Antigravity;
