import ReactDOM from 'react-dom'
import React, { Component , useRef, useState } from 'react'
import { Canvas, useFrame } from 'react-three-fiber'
import Plane from "./Plane";
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
      scale={active ? [1.5, 1.5, 1.5] : [1, 1, 1]}
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
class Editor3d extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (

      <Canvas id="Editor3dCanvas" width="1000" height="500" style={{background: '#041830'}} camera={{ position: [2, 2, 2] }}>
      <Controls />
        <ambientLight />
        <fog attach="fog" args={["#041830", 5, 10]} />
        <Box />
        <Plane />
        <gridHelper args={[10, 10, "blue", "hotpink"]} />
      </Canvas>
    )
  }
}
export default Editor3d;
