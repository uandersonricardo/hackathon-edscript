import { useAnimations, useGLTF } from "@react-three/drei/native";
import { type JSX, useRef } from "react";
import type * as THREE from "three";
import type { GLTF } from "three-stdlib";

type GLTFResult = GLTF & {
  nodes: {
    mesh_0: THREE.Mesh;
  };
  materials: {};
};

export function Edson(props: JSX.IntrinsicElements["group"]) {
  const group = useRef<THREE.Group>(undefined);
  const { nodes, materials } = useGLTF(require("../../assets/models/edson/edson-compressed.glb")) as GLTFResult;

  console.log(materials[""]);
  console.log(nodes.mesh_0.material.textures);
  console.log("GLTF loaded:");
  //const { actions } = useAnimations(animations, group);

  return (
    <group ref={group} {...props} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.mesh_0.geometry}
        material={materials[""]}
        position={[-0.001, -0.001, -0.003]}
        scale={0.95}
      />
    </group>
  );
}

useGLTF.preload(require("../../assets/models/edson/edson-compressed.glb"));
