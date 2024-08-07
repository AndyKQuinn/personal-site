import * as THREE from "three"
import React, { Suspense, useRef, useState } from "react"
import Layout from "@theme/Layout"
import { Canvas, useFrame } from "@react-three/fiber"
import {
  EffectComposer,
  DepthOfField,
  Bloom,
  Noise,
  Vignette,
} from "@react-three/postprocessing"
import {
  Html,
  Icosahedron,
  useTexture,
  useCubeTexture,
  MeshDistortMaterial,
} from "@react-three/drei"

function MainSphere({ material }) {
  const main = useRef()
  useFrame(({ clock, mouse }) => {
    main.current.rotation.z = clock.getElapsedTime()
    main.current.rotation.y = THREE.MathUtils.lerp(
      main.current.rotation.y,
      mouse.x * Math.PI,
      0.1
    )
    main.current.rotation.x = THREE.MathUtils.lerp(
      main.current.rotation.x,
      mouse.y * Math.PI,
      0.1
    )
  })
  return (
    <Icosahedron
      args={[1, 4]}
      ref={main}
      material={material}
      position={[0, 0, 0]}
    />
  )
}

function Instances({ material }) {
  const [sphereRefs] = useState(() => [])
  const initialPositions = [
    [-4, 20, -12],
    [-10, 12, -4],
    [-11, -12, -23],
    [-16, -6, -10],
    [12, -2, -3],
    [13, 4, -12],
    [14, -2, -23],
    [8, 10, -20],
  ]
  useFrame(() => {
    sphereRefs.forEach((el) => {
      el.position.y += 0.02
      if (el.position.y > 19) el.position.y = -18
      el.rotation.x += 0.06
      el.rotation.y += 0.06
      el.rotation.z += 0.02
    })
  })
  return (
    <>
      <MainSphere material={material} />
      {initialPositions.map((pos, i) => (
        <Icosahedron
          args={[2, 9]}
          position={[pos[0], pos[1], pos[2]]}
          material={material}
          key={i}
          ref={(ref) => (sphereRefs[i] = ref)}
        />
      ))}
    </>
  )
}

function Scene() {
  const bumpMap = useTexture("/img/bump.jpg")
  const envMap = useCubeTexture(
    ["px.png", "nx.png", "py.png", "ny.png", "pz.png", "nz.png"],
    { path: "/img/cube/" }
  )
  const [material, set] = useState()

  return (
    <>
      <MeshDistortMaterial
        ref={set}
        envMap={envMap}
        bumpMap={bumpMap}
        color={"#d3d3d3"}
        roughness={0.1}
        metalness={1}
        bumpScale={0.005}
        clearcoat={1}
        clearcoatRoughness={1}
        radius={1}
        distort={0.4}
      />
      {material && <Instances material={material} />}
    </>
  )
}

export default function Blob() {
  return (
    <Layout>
      <div style={{ width: "100vw", height: "100vh" }}>
        <Canvas
          camera={{ position: [0, 0, 2] }}
          gl={{
            powerPreference: "high-performance",
            alpha: false,
            antialias: true,
            stencil: false,
            depth: false,
          }}
        >
          <color attach="background" args={["#D7D7D7"]} />
          <fog color="#D6D6D6" attach="fog" near={6} far={32} />
          <Suspense fallback={<Html center>Loading.</Html>}>
            <Scene />
          </Suspense>
          <EffectComposer multisampling={0} enableNormalPass={true}>
            <DepthOfField
              focusDistance={0}
              focalLength={0.02}
              bokehScale={2}
              height={480}
            />
            <Bloom
              luminanceThreshold={0}
              luminanceSmoothing={0.9}
              height={400}
              opacity={3}
            />
            <Noise opacity={0.025} />
            <Vignette eskil={false} offset={0.1} darkness={1.1} />
          </EffectComposer>
        </Canvas>
      </div>
    </Layout>
  )
}
