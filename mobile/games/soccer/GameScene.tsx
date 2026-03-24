import { useFrame } from "@react-three/fiber/native";
import { type RefObject, useRef } from "react";
import type * as THREE from "three";

import {
  COLLISION_X,
  COLLISION_Y,
  COLLISION_Z,
  GROUND_TILE_COUNT,
  GROUND_TILE_SIZE,
  INITIAL_SPEED,
  LANES,
  LANE_CHANGE_SPEED,
  JUMP_DURATION,
  JUMP_HEIGHT,
  MAX_SPEED,
  OBSTACLE_CLEAR_Z,
  OBSTACLE_INTERVAL_BASE,
  OBSTACLE_INTERVAL_MIN,
  OBSTACLE_SPAWN_Z,
  POOL_SIZE,
  SPEED_RAMP,
} from "./constants";
import type { GameRef, Lane } from "./types";
import { lerp } from "./utils";

function GameController({
  gameRef,
  onScore,
  onGameOver,
}: {
  gameRef: RefObject<GameRef>;
  onScore: (s: number) => void;
  onGameOver: (s: number) => void;
}) {
  const playerRef = useRef<THREE.Mesh>(null);
  const groundRefs = useRef<(THREE.Mesh | null)[]>(Array(GROUND_TILE_COUNT).fill(null));
  const groundZs = useRef(Array.from({ length: GROUND_TILE_COUNT }, (_, i) => -i * GROUND_TILE_SIZE));
  const obstacleRefs = useRef<(THREE.Mesh | null)[]>(Array(POOL_SIZE).fill(null));
  const lastScore = useRef(-1);

  useFrame((_, delta) => {
    const g = gameRef.current;
    if (g.status !== "playing") return;

    // Time & speed
    g.time += delta;
    g.speed = Math.min(INITIAL_SPEED + g.time * SPEED_RAMP, MAX_SPEED);
    g.score = Math.floor(g.time * 10);

    if (g.score !== lastScore.current) {
      lastScore.current = g.score;
      onScore(g.score);
    }

    // Lane change
    const targetX = LANES[g.targetLane];
    g.playerX = lerp(g.playerX, targetX, LANE_CHANGE_SPEED * delta);

    // Jump
    if (g.isJumping) {
      g.jumpTimer += delta;
      const t = g.jumpTimer / JUMP_DURATION;
      if (t >= 1) {
        g.isJumping = false;
        g.jumpTimer = 0;
        g.playerY = 0;
      } else {
        g.playerY = 4 * JUMP_HEIGHT * t * (1 - t);
      }
    }

    // Update player mesh
    if (playerRef.current) {
      playerRef.current.position.x = g.playerX;
      playerRef.current.position.y = g.playerY + 0.6;
    }

    // Spawn obstacles
    g.nextObstacleIn -= delta;
    if (g.nextObstacleIn <= 0) {
      const lane = Math.floor(Math.random() * 3) as Lane;
      g.obstacles.push({ id: g.obstacleCounter++, lane, z: OBSTACLE_SPAWN_Z, poolIndex: -1 });
      const interval = Math.max(OBSTACLE_INTERVAL_MIN, OBSTACLE_INTERVAL_BASE - g.time * 0.04);
      g.nextObstacleIn = interval;
    }

    // Move obstacles
    for (const obs of g.obstacles) {
      obs.z += g.speed * delta;
    }
    g.obstacles = g.obstacles.filter((o) => o.z < OBSTACLE_CLEAR_Z);

    // Assign pool indices and update meshes
    for (let i = 0; i < POOL_SIZE; i++) {
      const obs = g.obstacles[i];
      const mesh = obstacleRefs.current[i];
      if (!mesh) continue;
      if (obs) {
        obs.poolIndex = i;
        mesh.position.set(LANES[obs.lane], 0.6, obs.z);
        mesh.visible = true;
      } else {
        mesh.visible = false;
      }
    }

    // Collision detection
    for (const obs of g.obstacles) {
      if (
        Math.abs(LANES[obs.lane] - g.playerX) < COLLISION_X &&
        Math.abs(obs.z) < COLLISION_Z &&
        g.playerY < COLLISION_Y
      ) {
        g.status = "gameover";
        onGameOver(g.score);
        return;
      }
    }

    // Scroll ground tiles
    for (let i = 0; i < GROUND_TILE_COUNT; i++) {
      groundZs.current[i] += g.speed * delta;
      if (groundZs.current[i] > GROUND_TILE_SIZE * 0.6) {
        groundZs.current[i] -= GROUND_TILE_SIZE * GROUND_TILE_COUNT;
      }
      const mesh = groundRefs.current[i];
      if (mesh) mesh.position.z = groundZs.current[i];
    }
  });

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[3, 8, 5]} intensity={1.2} />

      {/* Ground tiles */}
      {Array.from({ length: GROUND_TILE_COUNT }, (_, i) => (
        <mesh
          key={`ground-${i}`}
          ref={(el: any) => {
            groundRefs.current[i] = el;
          }}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, 0, groundZs.current[i]]}
        >
          <planeGeometry args={[6, GROUND_TILE_SIZE]} />
          <meshLambertMaterial color={i % 2 === 0 ? "#1a1a3e" : "#16163a"} />
        </mesh>
      ))}

      {/* Lane dividers */}
      <mesh position={[-0.75, 0.01, -20]}>
        <boxGeometry args={[0.04, 0.02, 80]} />
        <meshLambertMaterial color="#444488" />
      </mesh>
      <mesh position={[0.75, 0.01, -20]}>
        <boxGeometry args={[0.04, 0.02, 80]} />
        <meshLambertMaterial color="#444488" />
      </mesh>

      {/* Player */}
      <mesh ref={playerRef} position={[LANES[1], 0.6, 0]}>
        <boxGeometry args={[0.75, 1.2, 0.75]} />
        <meshLambertMaterial color="#00eeff" />
      </mesh>

      {/* Obstacle pool */}
      {Array.from({ length: POOL_SIZE }, (_, i) => (
        <mesh
          key={`obs-${i}`}
          ref={(el: any) => {
            obstacleRefs.current[i] = el;
          }}
          position={[0, 0.6, -200]}
          visible={false}
        >
          <boxGeometry args={[0.75, 1.2, 0.75]} />
          <meshLambertMaterial color="#ff2244" />
        </mesh>
      ))}
    </>
  );
}

export default function GameScene({
  gameRef,
  onScore,
  onGameOver,
}: {
  gameRef: RefObject<GameRef>;
  onScore: (s: number) => void;
  onGameOver: (s: number) => void;
}) {
  return <GameController gameRef={gameRef} onScore={onScore} onGameOver={onGameOver} />;
}
