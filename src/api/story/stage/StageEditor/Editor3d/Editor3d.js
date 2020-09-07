import * as THREE from 'three';
import React, { Suspense, Component, useEffect, useRef, useState } from 'react';
import { Canvas, useLoader, useFrame } from 'react-three-fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { draco } from "drei";
import Plane from "./Plane";
import Text from "./Text";
import Controls from "./Controls";

function Box(props) {
  // This reference will give us direct access to the mesh
  const mesh = useRef()

  // Set up state for the hovered and active state
  const [hovered, setHover] = useState(false)
  const [active, setActive] = useState(false)

  // Rotate mesh every frame, this is outside of React without overhead
  useFrame(() => (mesh.current.rotation.x = mesh.current.rotation.y += 0.01))

  return (
    <mesh
      {...props}
      ref={mesh}
      scale={active ? [10, 10, 10] : [5, 5, 5]}
      onClick={(e) => setActive(!active)}
      onPointerOver={(e) => setHover(true)}
      onPointerOut={(e) => setHover(false)}>
      <boxBufferGeometry attach="geometry" args={[1, 1, 1]} />
      <meshStandardMaterial attach="material" color={hovered ? 'hotpink' : 'orange'} />
      <axesHelper />
      <arrowHelper />
  </mesh>
  )
}
function Jumbo() {
  const ref = useRef();
  useFrame(({ clock }) => (ref.current.rotation.x = ref.current.rotation.y = ref.current.rotation.z = Math.sin(clock.getElapsedTime()) * 0.3));
  return (
    <group ref={ref}>
      <Text hAlign="left" position={[-5, 20, -5]} children="BOOKS" />
      <Text hAlign="left" position={[-10, 11, -5]} children="ON" />
      <Text hAlign="left" position={[-5, 5, -5]} children="WALL" />
      <Text hAlign="left" position={[30, 17, -5]} children="3D" size={3} />
      <Text hAlign="left" position={[30, 7, -5]} children="EDITOR" />
    </group>
  )
}

function Bird({ speed, factor, url, ...props }) {

  const { nodes, materials, animations } = useLoader(GLTFLoader, '/'+url, draco());
  const group = useRef();
  const [mixer] = useState(() => new THREE.AnimationMixer());
  useEffect(() => void mixer.clipAction(animations[0], group.current).play(), [animations,mixer])
  useFrame((state, delta) => {
    group.current.rotation.y += Math.sin((delta * factor) / 2) * Math.cos((delta * factor) / 2) * 1.5
    mixer.update(delta * speed)
  })

  return (
    <group ref={group} dispose={null}>
      <scene name="Scene" {...props}>
        <mesh
          name="Object_0"
          morphTargetDictionary={nodes.Object_0.morphTargetDictionary}
          morphTargetInfluences={nodes.Object_0.morphTargetInfluences}
          rotation={[1.5707964611537577, 0, 0]}
          geometry={nodes.Object_0.geometry}
          material={materials.Material_0_COLOR_0}
        />
      </scene>
    </group>
  )
}
function Birds() {
  return new Array(80).fill().map((_, i) => {
    const x = (15 + Math.random() * 30) * (Math.round(Math.random()) ? -1 : 1)
    const y = -10 + Math.random() * 20
    const z = -5 + Math.random() * 10
    const bird = ['Stork', 'Parrot', 'Flamingo'][Math.round(Math.random() * 2)]
    let speed = bird === 'Stork' ? 0.5 : bird === 'Flamingo' ? 2 : 5
    let factor = bird === 'Stork' ? 0.5 + Math.random() : bird === 'Flamingo' ? 0.25 + Math.random() : 1 + Math.random() - 0.5
    return <Bird key={i} position={[x, y, z]} rotation={[0, x > 0 ? Math.PI : 0, 0]} speed={speed} factor={factor} url={`${bird}.glb`} />
  })
}

class Editor3d extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (

      <Canvas id="Editor3dCanvas"  style={{background: '#041830', zIndex: 1000 }} camera={{ position: [0, 10, 35] }}>
      <Controls />
        <ambientLight intensity={2} />
        <pointLight position={[40, 40, 40]} />
        <spotLight intensity={0.8} position={[300, 300, 400]} />
        <Box />
        <Suspense fallback={null}>
          <Jumbo />
          <Birds />
        </Suspense>
        <Plane />
        <gridHelper args={[40, 40, "blue", "hotpink"]} />
      </Canvas>
    )
  }
}
export default Editor3d;
