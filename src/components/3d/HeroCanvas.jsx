import React, { useRef, useState, useMemo, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import * as THREE from 'three'
import Avatar3DMale from './Avatar3DMale'

// Helper to generate a crisp, smooth antialiased circular texture for points
function createCircleTexture() {
  if (typeof document === 'undefined') return null
  const canvas = document.createElement('canvas')
  canvas.width = 64
  canvas.height = 64
  const ctx = canvas.getContext('2d')

  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 30)
  gradient.addColorStop(0, 'rgba(255, 255, 255, 1)')
  gradient.addColorStop(0.6, 'rgba(255, 255, 255, 0.85)')
  gradient.addColorStop(1, 'rgba(255, 255, 255, 0)')

  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, 64, 64)

  const texture = new THREE.CanvasTexture(canvas)
  return texture
}

// Clean White Circular Particle Field (Dense, Round & Clean ambient halo)
function ParticleField({ count = 280 }) {
  const circleTexture = useMemo(() => createCircleTexture(), [])

  const [positions] = useState(() => {
    const p = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const radius = 0.45 + 1.8 * Math.cbrt(Math.random())
      const theta = Math.random() * 2 * Math.PI
      const phi = Math.acos(2 * Math.random() - 1)
      p[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
      p[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      p[i * 3 + 2] = radius * Math.cos(phi)
    }
    return p
  })

  const ref = useRef()
  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.025
      ref.current.rotation.x += delta * 0.012
    }
  })

  return (
    <points ref={ref} frustumCulled={false} key={count}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.018}
        color="#ffffff"
        map={circleTexture}
        transparent={true}
        opacity={0.8}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

export const HeroCanvas = ({ containerRef, cameraConfig, avatarScale }) => {
  return (
    <Canvas
      eventSource={containerRef}
      camera={cameraConfig}
      dpr={[1, 1.5]}
      performance={{ min: 0.5 }}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
        precision: 'mediump',
        depth: true,
        stencil: false,
      }}
      className="w-full h-full"
    >
      {/* Efficient Studio Soft Lighting: 1 ambient light and 1 soft directional light */}
      <ambientLight intensity={0.9} />
      <directionalLight position={[2.5, 3.5, 2.5]} intensity={1.1} color="#ffffff" />

      <Suspense fallback={null}>
        <ParticleField />
        <Float speed={1.8} rotationIntensity={0.03} floatIntensity={0.04}>
          <Avatar3DMale scale={avatarScale} />
        </Float>
      </Suspense>
    </Canvas>
  )
}

export default HeroCanvas
