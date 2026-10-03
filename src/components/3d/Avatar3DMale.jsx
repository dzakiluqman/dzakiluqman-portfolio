import React, { useRef, useState, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float, Sphere, Cylinder, Torus, Ring } from '@react-three/drei'
import * as THREE from 'three'

/**
 * Procedurally sculpts an anatomical human cranium and facial topology mesh.
 * Deforms an IcosahedronGeometry into realistic human cranial curves,
 * cheekbone contours, eye socket cavities, nose bridge, jawline, and chin.
 */
function createHumanHeadGeometry() {
  const geo = new THREE.IcosahedronGeometry(1.2, 3)
  const pos = geo.attributes.position
  const v = new THREE.Vector3()

  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i)

    // 1. Cranium height and occipital (rear skull) fullness
    if (v.y > 0) {
      v.y *= 1.1
      if (v.z < 0) {
        v.z *= 1.15 // occipital rounding
      }
    }

    // 2. Jaw and chin taper downwards
    if (v.y < 0.1) {
      const jawFactor = THREE.MathUtils.lerp(1.0, 0.48, Math.min(1.0, (-v.y + 0.1) / 1.15))
      v.x *= jawFactor

      // Defined chin protrusion
      if (v.z > 0 && v.y < -0.3) {
        const chinWeight = Math.max(0, 1.0 - Math.abs(v.x) * 2.2) * Math.max(0, -v.y - 0.25)
        v.z += chinWeight * 0.42
      }
    }

    // 3. Facial feature sculpted topology (front facing, +Z)
    if (v.z > 0.08) {
      const absX = Math.abs(v.x)

      // Eye socket (orbital cavities) indentation
      if (v.y > 0.06 && v.y < 0.32 && absX > 0.20 && absX < 0.52) {
        v.z -= 0.16
      }

      // Brow ridge protrusion
      if (v.y >= 0.26 && v.y < 0.42 && absX < 0.55) {
        v.z += 0.12
      }

      // Nose bridge and apex
      if (v.y > -0.18 && v.y < 0.26 && absX < 0.18) {
        const noseWeight = (1.0 - absX / 0.18) * (1.0 - Math.abs(v.y - 0.04) / 0.22)
        v.z += Math.max(0, noseWeight) * 0.32
      }

      // Cheekbones (zygomatic arch)
      if (v.y > -0.12 && v.y < 0.16 && absX > 0.38 && absX < 0.68) {
        v.z += 0.14
        v.x *= 1.08
      }

      // Mouth & lip contour
      if (v.y > -0.45 && v.y < -0.22 && absX < 0.30) {
        v.z += 0.08
      }
    }

    pos.setXYZ(i, v.x, v.y, v.z)
  }

  geo.computeVertexNormals()
  return geo
}

export const Avatar3DMale = ({ scale = 1.0 }) => {
  const avatarGroup = useRef()
  const headGroup = useRef()
  const scanRingRef = useRef()
  const wireMatRef = useRef()
  const leftEyeRef = useRef()
  const rightEyeRef = useRef()

  const [hovered, setHovered] = useState(false)
  const [clicked, setClicked] = useState(false)

  // Memoize sculpted geometry and landmark nodes
  const headGeometry = useMemo(() => createHumanHeadGeometry(), [])

  // Key facial landmark coordinates for glowing neural data nodes
  const facialNodes = useMemo(() => [
    { pos: [0, 0.32, 1.15], color: '#00f2fe' }, // Brow Center / Neural Core
    { pos: [0, 0.02, 1.34], color: '#38bdf8' }, // Nose Apex
    { pos: [0, -0.62, 0.98], color: '#00f2fe' }, // Chin Landmark
    { pos: [-0.48, 0.02, 0.95], color: '#a855f7' }, // Left Cheekbone
    { pos: [0.48, 0.02, 0.95], color: '#a855f7' }, // Right Cheekbone
    { pos: [-0.78, 0.18, 0.22], color: '#00f2fe' }, // Left Temple
    { pos: [0.78, 0.18, 0.22], color: '#00f2fe' }, // Right Temple
    { pos: [-0.42, -0.42, 0.52], color: '#38bdf8' }, // Left Jaw Angle
    { pos: [0.42, -0.42, 0.52], color: '#38bdf8' }, // Right Jaw Angle
    { pos: [0, 0.85, 0.45], color: '#a855f7' }, // Forehead Apex
  ], [])

  // Smooth cursor tracking, breathing oscillation, and holographic animation
  useFrame((state, delta) => {
    const { mouse, clock } = state
    const elapsedTime = clock.getElapsedTime()

    // Smooth head tracking mouse
    if (headGroup.current) {
      const targetRotY = mouse.x * 0.65
      const targetRotX = -mouse.y * 0.45
      headGroup.current.rotation.y = THREE.MathUtils.lerp(headGroup.current.rotation.y, targetRotY, 0.08)
      headGroup.current.rotation.x = THREE.MathUtils.lerp(headGroup.current.rotation.x, targetRotX, 0.08)

      // Idle subtle breathing and floating
      headGroup.current.position.y = Math.sin(elapsedTime * 2.0) * 0.06
    }

    // Whole avatar group slight response
    if (avatarGroup.current) {
      const targetGroupY = mouse.x * 0.2 + (hovered ? 0.05 : 0)
      avatarGroup.current.rotation.y = THREE.MathUtils.lerp(avatarGroup.current.rotation.y, targetGroupY, 0.05)
    }

    // Biometric holographic scan ring sweep
    if (scanRingRef.current) {
      const scanSpeed = hovered ? 3.0 : 1.6
      scanRingRef.current.position.y = Math.sin(elapsedTime * scanSpeed) * 1.05
      scanRingRef.current.rotation.z += delta * (hovered ? 1.5 : 0.6)
    }

    // Neon wireframe glow pulse
    if (wireMatRef.current) {
      const baseIntensity = hovered ? 1.6 : 0.95
      wireMatRef.current.emissiveIntensity = baseIntensity + Math.sin(elapsedTime * 3.5) * 0.3
    }

    // Ocular cyber iris pulse
    if (leftEyeRef.current && rightEyeRef.current) {
      const eyeIntensity = hovered ? 2.2 : 1.3
      leftEyeRef.current.material.emissiveIntensity = eyeIntensity + Math.sin(elapsedTime * 4.0) * 0.4
      rightEyeRef.current.material.emissiveIntensity = eyeIntensity + Math.sin(elapsedTime * 4.0) * 0.4
    }
  })

  return (
    <group
      ref={avatarGroup}
      scale={scale}
      position={[0, 0, 0]}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={() => setClicked(!clicked)}
      cursor="pointer"
    >
      {/* HUMAN HEAD TOPOLOGY MESH */}
      <group ref={headGroup} position={[0, 0.2, 0]}>
        
        {/* 1. Outer Neon Human Wireframe Topology */}
        <mesh geometry={headGeometry}>
          <meshStandardMaterial
            ref={wireMatRef}
            wireframe={true}
            color="#00f2fe"
            emissive="#00f2fe"
            emissiveIntensity={0.95}
            roughness={0.2}
            metalness={0.8}
          />
        </mesh>

        {/* 2. Inner Semi-transparent Holographic Solid Core */}
        <mesh geometry={headGeometry} scale={[0.985, 0.985, 0.985]}>
          <meshStandardMaterial
            color="#050914"
            emissive="#031525"
            emissiveIntensity={0.5}
            transparent={true}
            opacity={0.84}
            roughness={0.25}
            metalness={0.92}
            flatShading={true}
          />
        </mesh>

        {/* 3. Cybernetic Ocular Lenses (Eyes) */}
        {/* Left Eye */}
        <group position={[-0.34, 0.16, 0.88]}>
          <Torus ref={leftEyeRef} args={[0.09, 0.018, 16, 32]}>
            <meshStandardMaterial
              color="#00f2fe"
              emissive="#00f2fe"
              emissiveIntensity={1.4}
              roughness={0.1}
            />
          </Torus>
          <Sphere args={[0.045, 16, 16]} position={[0, 0, 0.02]}>
            <meshStandardMaterial
              color="#a855f7"
              emissive="#a855f7"
              emissiveIntensity={1.8}
            />
          </Sphere>
        </group>

        {/* Right Eye */}
        <group position={[0.34, 0.16, 0.88]}>
          <Torus ref={rightEyeRef} args={[0.09, 0.018, 16, 32]}>
            <meshStandardMaterial
              color="#00f2fe"
              emissive="#00f2fe"
              emissiveIntensity={1.4}
              roughness={0.1}
            />
          </Torus>
          <Sphere args={[0.045, 16, 16]} position={[0, 0, 0.02]}>
            <meshStandardMaterial
              color="#a855f7"
              emissive="#a855f7"
              emissiveIntensity={1.8}
            />
          </Sphere>
        </group>

        {/* 4. Facial Neural Landmark Nodes (Glow Points) */}
        {facialNodes.map((node, idx) => (
          <Sphere key={idx} args={[0.024, 12, 12]} position={node.pos}>
            <meshStandardMaterial
              color={node.color}
              emissive={node.color}
              emissiveIntensity={hovered ? 2.5 : 1.6}
            />
          </Sphere>
        ))}

        {/* 5. Temporal Neural Interface / Headset Accents */}
        <group position={[-1.15, 0.1, -0.05]} rotation={[0, 0, Math.PI / 2]}>
          <Cylinder args={[0.18, 0.18, 0.08, 24]}>
            <meshStandardMaterial color="#0c1424" metalness={0.9} roughness={0.2} />
          </Cylinder>
          <Torus args={[0.18, 0.025, 16, 24]}>
            <meshStandardMaterial color="#00f2fe" emissive="#00f2fe" emissiveIntensity={1.2} />
          </Torus>
        </group>

        <group position={[1.15, 0.1, -0.05]} rotation={[0, 0, Math.PI / 2]}>
          <Cylinder args={[0.18, 0.18, 0.08, 24]}>
            <meshStandardMaterial color="#0c1424" metalness={0.9} roughness={0.2} />
          </Cylinder>
          <Torus args={[0.18, 0.025, 16, 24]}>
            <meshStandardMaterial color="#00f2fe" emissive="#00f2fe" emissiveIntensity={1.2} />
          </Torus>
        </group>

        {/* 6. Biometric Holographic Scan Ring (Sweeps vertically) */}
        <group ref={scanRingRef} position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <Torus args={[1.28, 0.016, 16, 48]}>
            <meshStandardMaterial
              color="#00f2fe"
              emissive="#00f2fe"
              emissiveIntensity={hovered ? 2.2 : 1.4}
              transparent
              opacity={0.85}
            />
          </Torus>
          <Ring args={[0.9, 1.25, 32]}>
            <meshBasicMaterial
              color="#00f2fe"
              transparent
              opacity={0.12}
              side={THREE.DoubleSide}
            />
          </Ring>
        </group>

        {/* 7. Stylized Cybernetic Neck Column */}
        <group position={[0, -1.3, -0.05]}>
          {/* Wireframe Neck Cylinder */}
          <Cylinder args={[0.38, 0.44, 0.55, 16]} position={[0, 0.15, 0]}>
            <meshStandardMaterial
              wireframe={true}
              color="#00f2fe"
              emissive="#00f2fe"
              emissiveIntensity={0.7}
              roughness={0.3}
            />
          </Cylinder>
          {/* Inner Neck Core */}
          <Cylinder args={[0.35, 0.41, 0.55, 16]} position={[0, 0.15, 0]}>
            <meshStandardMaterial color="#070c18" metalness={0.85} roughness={0.3} />
          </Cylinder>
          {/* Collar Rings */}
          <Torus args={[0.48, 0.035, 16, 32]} rotation={[Math.PI / 2, 0, 0]} position={[0, 0.28, 0]}>
            <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={0.8} />
          </Torus>
          <Torus args={[0.55, 0.04, 16, 32]} rotation={[Math.PI / 2, 0, 0]} position={[0, -0.05, 0]}>
            <meshStandardMaterial color="#a855f7" emissive="#a855f7" emissiveIntensity={0.9} />
          </Torus>
        </group>
      </group>

      {/* 8. Tech Platform / Holographic Base Halo */}
      <group position={[0, -1.65, 0]}>
        <Torus args={[1.35, 0.025, 16, 48]} rotation={[Math.PI / 2, 0, 0]}>
          <meshStandardMaterial
            color="#00f2fe"
            emissive="#00f2fe"
            emissiveIntensity={hovered ? 1.8 : 1.0}
          />
        </Torus>
        <Torus args={[1.55, 0.015, 16, 48]} rotation={[Math.PI / 2, 0, 0]}>
          <meshStandardMaterial
            color="#a855f7"
            emissive="#a855f7"
            emissiveIntensity={0.7}
          />
        </Torus>
      </group>
    </group>
  )
}

export default Avatar3DMale
