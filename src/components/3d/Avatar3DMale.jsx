import React, { useRef, useState, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { clone } from 'three/examples/jsm/utils/SkeletonUtils.js'

export const Avatar3DMale = ({ scale = 1.0, position = [0, -1.58, 0] }) => {
  const avatarGroup = useRef()
  const headBoneRef = useRef(null)
  const neckBoneRef = useRef(null)
  const leftShoulderRef = useRef(null)
  const rightShoulderRef = useRef(null)
  const leftArmRef = useRef(null)
  const rightArmRef = useRef(null)
  const leftForeArmRef = useRef(null)
  const rightForeArmRef = useRef(null)
  const leftHandRef = useRef(null)
  const rightHandRef = useRef(null)
  const eyeLRef = useRef(null)
  const eyeRRef = useRef(null)

  const initialHeadRot = useRef(new THREE.Euler())
  const initialNeckRot = useRef(new THREE.Euler())
  const initialLeftShoulderRot = useRef(new THREE.Euler())
  const initialRightShoulderRot = useRef(new THREE.Euler())
  const initialLeftArmRot = useRef(new THREE.Euler())
  const initialRightArmRot = useRef(new THREE.Euler())
  const initialLeftForeArmRot = useRef(new THREE.Euler())
  const initialRightForeArmRot = useRef(new THREE.Euler())
  const initialEyeLRot = useRef(new THREE.Euler())
  const initialEyeRRot = useRef(new THREE.Euler())

  const [hovered, setHovered] = useState(false)

  // Window pointer listener ensures smooth tracking even when Canvas is pointer-events-none
  const mousePointer = useRef({ x: 0, y: 0 })
  useEffect(() => {
    const onPointerMove = (e) => {
      mousePointer.current.x = (e.clientX / window.innerWidth) * 2 - 1
      mousePointer.current.y = -(e.clientY / window.innerHeight) * 2 + 1
    }
    window.addEventListener('pointermove', onPointerMove, { passive: true })
    return () => window.removeEventListener('pointermove', onPointerMove)
  }, [])

  // 1. Model Loader: Load model from /models/newmodel.glb
  const { scene } = useGLTF('/models/newmodel.glb')

  // Clone with SkeletonUtils to retain independent skeleton binding
  const clonedScene = useMemo(() => clone(scene), [scene])

  // 2. Discover bones, relax shoulders & arms, tune materials for soft studio lighting
  useEffect(() => {
    let head = null
    let neck = null
    let leftShoulder = null
    let rightShoulder = null
    let leftArm = null
    let rightArm = null
    let leftForeArm = null
    let rightForeArm = null
    let leftHand = null
    let rightHand = null
    let eyeL = null
    let eyeR = null

    // Node Discovery: traverse clonedScene
    clonedScene.traverse((node) => {
      const name = node.name.toLowerCase()
      if (!head && (node.name === 'Head' || name.includes('mixamorighead') || name === 'head')) {
        head = node
      }
      if (!neck && (node.name === 'Neck' || name.includes('mixamorigneck') || name === 'neck')) {
        neck = node
      }
      if (!leftShoulder && (node.name === 'LeftShoulder' || name.includes('mixamorigleftshoulder') || name === 'leftshoulder')) {
        leftShoulder = node
      }
      if (!rightShoulder && (node.name === 'RightShoulder' || name.includes('mixamorigrightshoulder') || name === 'rightshoulder')) {
        rightShoulder = node
      }
      if (!leftArm && (node.name === 'LeftArm' || name.includes('mixamorigleftarm') || name === 'leftarm')) {
        leftArm = node
      }
      if (!rightArm && (node.name === 'RightArm' || name.includes('mixamorigrightarm') || name === 'rightarm')) {
        rightArm = node
      }
      if (!leftForeArm && (node.name === 'LeftForeArm' || name.includes('mixamorigleftforearm') || name === 'leftforearm')) {
        leftForeArm = node
      }
      if (!rightForeArm && (node.name === 'RightForeArm' || name.includes('mixamorigrightforearm') || name === 'rightforearm')) {
        rightForeArm = node
      }
      if (!leftHand && (node.name === 'LeftHand' || name.includes('mixamoriglefthand') || name === 'lefthand')) {
        leftHand = node
      }
      if (!rightHand && (node.name === 'RightHand' || name.includes('mixamorigrighthand') || name === 'righthand')) {
        rightHand = node
      }
      if (!eyeL && (name.includes('eyel') || name.includes('lefteye') || name.includes('eye_l') || name.includes('eye.l'))) {
        eyeL = node
      }
      if (!eyeR && (name.includes('eyer') || name.includes('righteye') || name.includes('eye_r') || name.includes('eye.r'))) {
        eyeR = node
      }
    })

    if (head) {
      headBoneRef.current = head
      initialHeadRot.current.copy(head.rotation)
    }
    if (neck) {
      neckBoneRef.current = neck
      initialNeckRot.current.copy(neck.rotation)
    }

    // Relax and slope shoulders downward (eliminates stiff/overly upright posture)
    if (leftShoulder) {
      leftShoulderRef.current = leftShoulder
      initialLeftShoulderRot.current.copy(leftShoulder.rotation)
      leftShoulder.rotation.y = initialLeftShoulderRot.current.y - 0.12
    }
    if (rightShoulder) {
      rightShoulderRef.current = rightShoulder
      initialRightShoulderRot.current.copy(rightShoulder.rotation)
      rightShoulder.rotation.y = initialRightShoulderRot.current.y + 0.12
    }

    // Lower upper arms downward and inward toward sides
    if (leftArm) {
      leftArmRef.current = leftArm
      initialLeftArmRot.current.copy(leftArm.rotation)
      leftArm.rotation.x = initialLeftArmRot.current.x + 1.30
      leftArm.rotation.y = initialLeftArmRot.current.y - 0.10
      leftArm.rotation.z = initialLeftArmRot.current.z - 0.06
    }
    if (rightArm) {
      rightArmRef.current = rightArm
      initialRightArmRot.current.copy(rightArm.rotation)
      rightArm.rotation.x = initialRightArmRot.current.x + 1.30
      rightArm.rotation.y = initialRightArmRot.current.y + 0.10
      rightArm.rotation.z = initialRightArmRot.current.z + 0.06
    }

    // Natural relaxed elbow curve
    if (leftForeArm) {
      leftForeArmRef.current = leftForeArm
      initialLeftForeArmRot.current.copy(leftForeArm.rotation)
      leftForeArm.rotation.x = initialLeftForeArmRot.current.x - 0.14
      leftForeArm.rotation.z = initialLeftForeArmRot.current.z + 0.08
    }
    if (rightForeArm) {
      rightForeArmRef.current = rightForeArm
      initialRightForeArmRot.current.copy(rightForeArm.rotation)
      rightForeArm.rotation.x = initialRightForeArmRot.current.x - 0.14
      rightForeArm.rotation.z = initialRightForeArmRot.current.z - 0.08
    }

    if (leftHand) leftHandRef.current = leftHand
    if (rightHand) rightHandRef.current = rightHand
    if (eyeL) {
      eyeLRef.current = eyeL
      initialEyeLRot.current.copy(eyeL.rotation)
    }
    if (eyeR) {
      eyeRRef.current = eyeR
      initialEyeRRot.current.copy(eyeR.rotation)
    }

    // Material Balancing:
    // Retain textures, tone down specular reflections, soften fabric highlights for crisp collar details
    clonedScene.traverse((child) => {
      if (child.isMesh) {
        const name = child.name.toLowerCase()
        if (name.includes('shoes') || name.includes('footwear')) {
          child.visible = false
          return
        }

        child.visible = true
        if (child.material) {
          child.material.wireframe = false
          child.castShadow = true
          child.receiveShadow = true

          // Soften fabric material: high roughness, zero metalness to avoid blown-out white specular highlights
          if (name.includes('look') || name.includes('top') || name.includes('outfit')) {
            child.material.roughness = 0.88
            child.material.metalness = 0.02
          } else if (name.includes('body')) {
            // Soft realistic skin material
            child.material.roughness = 0.68
            child.material.metalness = 0.04
          }
        }
      }
    })
  }, [clonedScene])

  // 3. Smooth cursor tracking (Head, Neck, Eyes) and relaxed posture micro-movements
  useFrame((state) => {
    const { pointer, clock } = state
    const elapsedTime = clock.getElapsedTime()

    // Smooth cursor tracking from window mouse listener or state.pointer
    const px = mousePointer.current.x !== 0 ? mousePointer.current.x : pointer.x
    const py = mousePointer.current.y !== 0 ? mousePointer.current.y : pointer.y

    // 1. Head Tracking (smooth lerp with cursor)
    const targetHeadY = px * 0.38
    const targetHeadX = -py * 0.25

    if (headBoneRef.current) {
      headBoneRef.current.rotation.y = THREE.MathUtils.lerp(
        headBoneRef.current.rotation.y,
        initialHeadRot.current.y + targetHeadY,
        0.065
      )
      headBoneRef.current.rotation.x = THREE.MathUtils.lerp(
        headBoneRef.current.rotation.x,
        initialHeadRot.current.x + targetHeadX,
        0.065
      )
    }

    // 2. Neck Proportional Articulation (~22% natural articulation)
    if (neckBoneRef.current) {
      neckBoneRef.current.rotation.y = THREE.MathUtils.lerp(
        neckBoneRef.current.rotation.y,
        initialNeckRot.current.y + targetHeadY * 0.22,
        0.05
      )
      neckBoneRef.current.rotation.x = THREE.MathUtils.lerp(
        neckBoneRef.current.rotation.x,
        initialNeckRot.current.x + targetHeadX * 0.22,
        0.05
      )
    }

    // 3. Eye Node Tracking (if dedicated eye bones exist in model)
    if (eyeLRef.current && eyeRRef.current) {
      const maxEyeAngle = 0.32
      const eyeRotY = THREE.MathUtils.clamp(px * 0.35, -maxEyeAngle, maxEyeAngle)
      const eyeRotX = THREE.MathUtils.clamp(-py * 0.25, -maxEyeAngle, maxEyeAngle)

      eyeLRef.current.rotation.y = THREE.MathUtils.lerp(eyeLRef.current.rotation.y, initialEyeLRot.current.y + eyeRotY, 0.1)
      eyeLRef.current.rotation.x = THREE.MathUtils.lerp(eyeLRef.current.rotation.x, initialEyeLRot.current.x + eyeRotX, 0.1)
      eyeRRef.current.rotation.y = THREE.MathUtils.lerp(eyeRRef.current.rotation.y, initialEyeRRot.current.y + eyeRotY, 0.1)
      eyeRRef.current.rotation.x = THREE.MathUtils.lerp(eyeRRef.current.rotation.x, initialEyeRRot.current.x + eyeRotX, 0.1)
    }

    // 4. Relaxed Shoulder & Arm Posture with organic breathing micro-movements
    const breath = Math.sin(elapsedTime * 1.5) * 0.006

    if (leftShoulderRef.current) {
      leftShoulderRef.current.rotation.y = initialLeftShoulderRot.current.y - 0.12 + breath * 0.2
    }
    if (rightShoulderRef.current) {
      rightShoulderRef.current.rotation.y = initialRightShoulderRot.current.y + 0.12 - breath * 0.2
    }

    if (leftArmRef.current) {
      leftArmRef.current.rotation.x = initialLeftArmRot.current.x + 1.30 + breath
      leftArmRef.current.rotation.y = initialLeftArmRot.current.y - 0.10
      leftArmRef.current.rotation.z = initialLeftArmRot.current.z - 0.06
    }
    if (rightArmRef.current) {
      rightArmRef.current.rotation.x = initialRightArmRot.current.x + 1.30 + breath
      rightArmRef.current.rotation.y = initialRightArmRot.current.y + 0.10
      rightArmRef.current.rotation.z = initialRightArmRot.current.z + 0.06
    }

    if (leftForeArmRef.current) {
      leftForeArmRef.current.rotation.x = initialLeftForeArmRot.current.x - 0.14
      leftForeArmRef.current.rotation.z = initialLeftForeArmRot.current.z + 0.08
    }
    if (rightForeArmRef.current) {
      rightForeArmRef.current.rotation.x = initialRightForeArmRot.current.x - 0.14
      rightForeArmRef.current.rotation.z = initialRightForeArmRot.current.z - 0.08
    }

    // Subtle natural breathing float
    if (avatarGroup.current) {
      avatarGroup.current.position.y = position[1] + Math.sin(elapsedTime * 1.5) * 0.004
    }
  })

  return (
    <group
      ref={avatarGroup}
      scale={scale}
      position={position}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      cursor="pointer"
    >
      <primitive object={clonedScene} />
    </group>
  )
}

useGLTF.preload('/models/newmodel.glb')

export default Avatar3DMale
