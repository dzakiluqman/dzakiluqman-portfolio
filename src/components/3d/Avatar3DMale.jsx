import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float, Sphere, Cylinder, Box, Torus, Points, PointMaterial } from '@react-three/drei'
import * as THREE from 'three'

export const Avatar3DMale = ({ scale = 1.0 }) => {
  const avatarGroup = useRef()
  const headGroup = useRef()
  const visorRef = useRef()
  const chestCoreRef = useRef()

  // Track cursor position and idle breathing
  useFrame((state, delta) => {
    const { mouse, clock } = state
    const elapsedTime = clock.getElapsedTime()

    // Smooth head tracking mouse
    if (headGroup.current) {
      const targetRotY = mouse.x * 0.45
      const targetRotX = -mouse.y * 0.35
      headGroup.current.rotation.y = THREE.MathUtils.lerp(headGroup.current.rotation.y, targetRotY, 0.08)
      headGroup.current.rotation.x = THREE.MathUtils.lerp(headGroup.current.rotation.x, targetRotX, 0.08)
    }

    // Subtle torso sway & breathing
    if (avatarGroup.current) {
      const targetBodyY = mouse.x * 0.15
      avatarGroup.current.rotation.y = THREE.MathUtils.lerp(avatarGroup.current.rotation.y, targetBodyY, 0.05)
      avatarGroup.current.position.y = Math.sin(elapsedTime * 2) * 0.06
    }

    // Visor glow pulse
    if (visorRef.current) {
      visorRef.current.material.emissiveIntensity = 0.8 + Math.sin(elapsedTime * 4) * 0.3
    }

    // Chest reactor pulse
    if (chestCoreRef.current) {
      chestCoreRef.current.material.emissiveIntensity = 1 + Math.sin(elapsedTime * 3) * 0.4
    }
  })

  return (
    <group ref={avatarGroup} scale={scale} position={[0, -0.6, 0]}>
      {/* 1. HEAD & CYBERNETIC ACCESSORIES */}
      <group ref={headGroup} position={[0, 1.45, 0]}>
        {/* Head Mesh - Male Jawline & Shape */}
        <Sphere args={[0.52, 32, 32]} scale={[1, 1.15, 0.95]} position={[0, 0, 0]}>
          <meshStandardMaterial
            color="#2a324b"
            roughness={0.4}
            metalness={0.6}
          />
        </Sphere>

        {/* Cyber Hair / Styled Spikes */}
        <group position={[0, 0.35, -0.05]}>
          <Box args={[0.7, 0.25, 0.8]} position={[0, 0.2, 0]} rotation={[0.05, 0, 0]}>
            <meshStandardMaterial color="#0b111e" roughness={0.3} metalness={0.8} />
          </Box>
          <Box args={[0.5, 0.2, 0.6]} position={[0, 0.32, -0.05]} rotation={[-0.1, 0, 0]}>
            <meshStandardMaterial color="#111a2e" roughness={0.2} metalness={0.9} />
          </Box>
        </group>

        {/* Futuristic Cyber Visor / Glasses */}
        <group position={[0, 0.05, 0.42]}>
          <Box ref={visorRef} args={[0.74, 0.18, 0.16]}>
            <meshStandardMaterial
              color="#00f2fe"
              emissive="#00f2fe"
              emissiveIntensity={1.2}
              transparent
              opacity={0.85}
              roughness={0.1}
              metalness={0.9}
            />
          </Box>
          {/* Visor Frame Accent */}
          <Box args={[0.8, 0.04, 0.18]} position={[0, 0.09, 0]}>
            <meshStandardMaterial color="#06080f" metalness={0.9} roughness={0.2} />
          </Box>
        </group>

        {/* Cyber Headset Ear Pads */}
        <group position={[-0.54, 0.02, -0.02]} rotation={[0, 0, Math.PI / 2]}>
          <Cylinder args={[0.16, 0.16, 0.12, 24]}>
            <meshStandardMaterial color="#19243d" metalness={0.8} roughness={0.3} />
          </Cylinder>
          <Torus args={[0.16, 0.03, 16, 32]}>
            <meshStandardMaterial color="#a855f7" emissive="#a855f7" emissiveIntensity={0.8} />
          </Torus>
        </group>

        <group position={[0.54, 0.02, -0.02]} rotation={[0, 0, Math.PI / 2]}>
          <Cylinder args={[0.16, 0.16, 0.12, 24]}>
            <meshStandardMaterial color="#19243d" metalness={0.8} roughness={0.3} />
          </Cylinder>
          <Torus args={[0.16, 0.03, 16, 32]}>
            <meshStandardMaterial color="#a855f7" emissive="#a855f7" emissiveIntensity={0.8} />
          </Torus>
        </group>

        {/* Headset Band */}
        <Torus args={[0.55, 0.04, 16, 32]} rotation={[Math.PI / 2, 0, 0]} position={[0, 0.28, 0]}>
          <meshStandardMaterial color="#06080f" metalness={0.9} roughness={0.2} />
        </Torus>
      </group>

      {/* 2. NECK & HIGH COLLAR HOODIE */}
      <Cylinder args={[0.22, 0.26, 0.35, 24]} position={[0, 0.95, -0.02]}>
        <meshStandardMaterial color="#131d35" roughness={0.5} metalness={0.4} />
      </Cylinder>

      {/* Futuristic Collar */}
      <Torus args={[0.38, 0.09, 16, 32]} rotation={[Math.PI / 2.2, 0, 0]} position={[0, 0.9, 0.02]}>
        <meshStandardMaterial color="#0b111e" metalness={0.8} roughness={0.3} />
      </Torus>

      {/* 3. UPPER TORSO / TECHWEAR JACKET */}
      <group position={[0, 0.25, 0]}>
        {/* Main Chest Body */}
        <Box args={[1.25, 1.15, 0.7]} position={[0, 0.1, 0]}>
          <meshStandardMaterial
            color="#0b111e"
            roughness={0.4}
            metalness={0.7}
          />
        </Box>

        {/* Chest Cyber Core / Energy Reactor */}
        <Sphere ref={chestCoreRef} args={[0.14, 24, 24]} position={[0, 0.25, 0.36]}>
          <meshStandardMaterial
            color="#00f2fe"
            emissive="#00f2fe"
            emissiveIntensity={1.5}
            roughness={0.1}
          />
        </Sphere>
        <Torus args={[0.18, 0.025, 16, 32]} position={[0, 0.25, 0.36]}>
          <meshStandardMaterial color="#a855f7" emissive="#a855f7" emissiveIntensity={0.6} />
        </Torus>

        {/* Cyber Neon Trim Lines */}
        <Box args={[0.03, 0.8, 0.03]} position={[-0.32, 0.1, 0.36]}>
          <meshStandardMaterial color="#00f2fe" emissive="#00f2fe" emissiveIntensity={0.8} />
        </Box>
        <Box args={[0.03, 0.8, 0.03]} position={[0.32, 0.1, 0.36]}>
          <meshStandardMaterial color="#00f2fe" emissive="#00f2fe" emissiveIntensity={0.8} />
        </Box>

        {/* Shoulder Armor Pads */}
        <Box args={[0.42, 0.28, 0.52]} position={[-0.78, 0.55, 0]} rotation={[0, 0, 0.15]}>
          <meshStandardMaterial color="#19243d" roughness={0.3} metalness={0.8} />
        </Box>
        <Box args={[0.42, 0.28, 0.52]} position={[0.78, 0.55, 0]} rotation={[0, 0, -0.15]}>
          <meshStandardMaterial color="#19243d" roughness={0.3} metalness={0.8} />
        </Box>
      </group>

      {/* 4. BASE PEDESTAL WITH HOLOGRAPHIC GLOW */}
      <Cylinder args={[0.9, 1.1, 0.18, 32]} position={[0, -0.45, 0]}>
        <meshStandardMaterial color="#06080f" metalness={0.9} roughness={0.2} />
      </Cylinder>
      <Torus args={[0.98, 0.03, 16, 48]} position={[0, -0.38, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="#00f2fe" emissive="#00f2fe" emissiveIntensity={1} />
      </Torus>
    </group>
  )
}

export default Avatar3DMale
