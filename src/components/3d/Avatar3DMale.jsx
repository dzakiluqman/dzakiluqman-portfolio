import React, { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float, Sphere, Cylinder, Box, Torus } from '@react-three/drei'
import * as THREE from 'three'

export const Avatar3DMale = ({ scale = 1.0 }) => {
  const avatarGroup = useRef()
  const headGroup = useRef()
  const visorRef = useRef()
  const chestCoreRef = useRef()
  const ringRef = useRef()
  const leftAntennaRef = useRef()
  const rightAntennaRef = useRef()

  const [hovered, setHovered] = useState(false)
  const [clicked, setClicked] = useState(false)

  // Track cursor position, idle breathing, and interactive hover reaction
  useFrame((state, delta) => {
    const { mouse, clock } = state
    const elapsedTime = clock.getElapsedTime()

    // Smooth head tracking mouse
    if (headGroup.current) {
      const targetRotY = mouse.x * 0.65
      const targetRotX = -mouse.y * 0.45
      headGroup.current.rotation.y = THREE.MathUtils.lerp(headGroup.current.rotation.y, targetRotY, 0.08)
      headGroup.current.rotation.x = THREE.MathUtils.lerp(headGroup.current.rotation.x, targetRotX, 0.08)
    }

    // Body sway & response
    if (avatarGroup.current) {
      const targetBodyY = mouse.x * 0.25 + (hovered ? 0.08 : 0)
      avatarGroup.current.rotation.y = THREE.MathUtils.lerp(avatarGroup.current.rotation.y, targetBodyY, 0.05)
      
      // Floating bounce
      const hoverBounce = hovered ? 0.12 : 0
      avatarGroup.current.position.y = Math.sin(elapsedTime * 2.2) * 0.08 + hoverBounce
    }

    // Visor glow pulse & hover intensity
    if (visorRef.current) {
      const baseIntensity = hovered ? 1.8 : 1.1
      visorRef.current.material.emissiveIntensity = baseIntensity + Math.sin(elapsedTime * 4.5) * 0.35
    }

    // Chest reactor pulse
    if (chestCoreRef.current) {
      const pulseSpeed = hovered ? 6 : 3
      chestCoreRef.current.material.emissiveIntensity = 1.2 + Math.sin(elapsedTime * pulseSpeed) * 0.5
    }

    // Orbiting base ring
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * (hovered ? 1.2 : 0.4)
    }
  })

  return (
    <group
      ref={avatarGroup}
      scale={scale}
      position={[0, -0.6, 0]}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={() => setClicked(!clicked)}
      cursor="pointer"
    >
      {/* 1. HEAD & CYBERNETIC ACCESSORIES */}
      <group ref={headGroup} position={[0, 1.45, 0]}>
        {/* Head Mesh - Male Cyber Jawline & Shape */}
        <Sphere args={[0.52, 32, 32]} scale={[1, 1.16, 0.96]} position={[0, 0, 0]}>
          <meshStandardMaterial
            color="#222b40"
            roughness={0.35}
            metalness={0.7}
          />
        </Sphere>

        {/* Cyber Hair / Angular Tech Spikes */}
        <group position={[0, 0.38, -0.05]}>
          <Box args={[0.72, 0.26, 0.82]} position={[0, 0.2, 0]} rotation={[0.06, 0, 0]}>
            <meshStandardMaterial color="#090d16" roughness={0.25} metalness={0.85} />
          </Box>
          <Box args={[0.52, 0.22, 0.62]} position={[0, 0.32, -0.05]} rotation={[-0.1, 0, 0]}>
            <meshStandardMaterial color="#0f172a" roughness={0.2} metalness={0.9} />
          </Box>
          <Box args={[0.32, 0.18, 0.42]} position={[0, 0.42, 0.05]} rotation={[0.15, 0, 0]}>
            <meshStandardMaterial color="#00f2fe" emissive="#00f2fe" emissiveIntensity={0.5} roughness={0.1} />
          </Box>
        </group>

        {/* Futuristic Cyber Visor with Neon Glow */}
        <group position={[0, 0.06, 0.43]}>
          <Box ref={visorRef} args={[0.76, 0.19, 0.16]}>
            <meshStandardMaterial
              color="#00f2fe"
              emissive="#00f2fe"
              emissiveIntensity={1.3}
              transparent
              opacity={0.88}
              roughness={0.08}
              metalness={0.92}
            />
          </Box>
          {/* Visor Upper Frame Accent */}
          <Box args={[0.82, 0.04, 0.18]} position={[0, 0.1, 0]}>
            <meshStandardMaterial color="#06080f" metalness={0.95} roughness={0.15} />
          </Box>
        </group>

        {/* Cyber Headset Ear Pads with Antennas */}
        <group position={[-0.55, 0.02, -0.02]} rotation={[0, 0, Math.PI / 2]}>
          <Cylinder args={[0.17, 0.17, 0.12, 24]}>
            <meshStandardMaterial color="#19243d" metalness={0.85} roughness={0.25} />
          </Cylinder>
          <Torus args={[0.17, 0.03, 16, 32]}>
            <meshStandardMaterial color="#a855f7" emissive="#a855f7" emissiveIntensity={0.9} />
          </Torus>
          {/* Mini Antenna */}
          <Cylinder ref={leftAntennaRef} args={[0.015, 0.015, 0.35, 12]} position={[0, 0.15, 0.12]} rotation={[0.2, 0, 0]}>
            <meshStandardMaterial color="#00f2fe" emissive="#00f2fe" emissiveIntensity={1} />
          </Cylinder>
        </group>

        <group position={[0.55, 0.02, -0.02]} rotation={[0, 0, Math.PI / 2]}>
          <Cylinder args={[0.17, 0.17, 0.12, 24]}>
            <meshStandardMaterial color="#19243d" metalness={0.85} roughness={0.25} />
          </Cylinder>
          <Torus args={[0.17, 0.03, 16, 32]}>
            <meshStandardMaterial color="#a855f7" emissive="#a855f7" emissiveIntensity={0.9} />
          </Torus>
          {/* Mini Antenna */}
          <Cylinder ref={rightAntennaRef} args={[0.015, 0.015, 0.35, 12]} position={[0, -0.15, 0.12]} rotation={[-0.2, 0, 0]}>
            <meshStandardMaterial color="#00f2fe" emissive="#00f2fe" emissiveIntensity={1} />
          </Cylinder>
        </group>

        {/* Headset Top Band */}
        <Torus args={[0.56, 0.04, 16, 32]} rotation={[Math.PI / 2, 0, 0]} position={[0, 0.28, 0]}>
          <meshStandardMaterial color="#06080f" metalness={0.9} roughness={0.2} />
        </Torus>
      </group>

      {/* 2. NECK & HIGH-COLLAR TECH HOODIE */}
      <Cylinder args={[0.22, 0.26, 0.35, 24]} position={[0, 0.95, -0.02]}>
        <meshStandardMaterial color="#111827" roughness={0.5} metalness={0.5} />
      </Cylinder>

      {/* Cybernetic High Collar */}
      <Torus args={[0.4, 0.09, 16, 32]} rotation={[Math.PI / 2.2, 0, 0]} position={[0, 0.9, 0.02]}>
        <meshStandardMaterial color="#0b111e" metalness={0.85} roughness={0.25} />
      </Torus>

      {/* 3. UPPER TORSO / TECHWEAR JACKET */}
      <group position={[0, 0.25, 0]}>
        {/* Main Chest Body */}
        <Box args={[1.28, 1.18, 0.72]} position={[0, 0.1, 0]}>
          <meshStandardMaterial
            color="#0b111e"
            roughness={0.35}
            metalness={0.75}
          />
        </Box>

        {/* Chest Energy Core / Arc Reactor */}
        <Sphere ref={chestCoreRef} args={[0.15, 24, 24]} position={[0, 0.26, 0.37]}>
          <meshStandardMaterial
            color="#00f2fe"
            emissive="#00f2fe"
            emissiveIntensity={1.4}
            roughness={0.1}
          />
        </Sphere>
        <Torus args={[0.19, 0.025, 16, 32]} position={[0, 0.26, 0.37]}>
          <meshStandardMaterial color="#a855f7" emissive="#a855f7" emissiveIntensity={0.8} />
        </Torus>

        {/* Vertical Cyber Light Trims */}
        <Box args={[0.03, 0.85, 0.03]} position={[-0.34, 0.1, 0.37]}>
          <meshStandardMaterial color="#00f2fe" emissive="#00f2fe" emissiveIntensity={1} />
        </Box>
        <Box args={[0.03, 0.85, 0.03]} position={[0.34, 0.1, 0.37]}>
          <meshStandardMaterial color="#00f2fe" emissive="#00f2fe" emissiveIntensity={1} />
        </Box>

        {/* Shoulder Armor Plates */}
        <Box args={[0.44, 0.3, 0.54]} position={[-0.8, 0.56, 0]} rotation={[0, 0, 0.16]}>
          <meshStandardMaterial color="#1e293b" roughness={0.25} metalness={0.85} />
        </Box>
        <Box args={[0.44, 0.3, 0.54]} position={[0.8, 0.56, 0]} rotation={[0, 0, -0.16]}>
          <meshStandardMaterial color="#1e293b" roughness={0.25} metalness={0.85} />
        </Box>
      </group>

      {/* 4. BASE PEDESTAL WITH HOLOGRAPHIC GLOW */}
      <Cylinder args={[0.95, 1.15, 0.2, 32]} position={[0, -0.45, 0]}>
        <meshStandardMaterial color="#06080f" metalness={0.92} roughness={0.18} />
      </Cylinder>
      
      {/* Orbiting Laser Ring */}
      <Torus ref={ringRef} args={[1.05, 0.035, 16, 48]} position={[0, -0.38, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="#00f2fe" emissive="#00f2fe" emissiveIntensity={1.2} />
      </Torus>
    </group>
  )
}

export default Avatar3DMale
