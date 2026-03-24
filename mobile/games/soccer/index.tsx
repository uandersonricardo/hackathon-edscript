import { Canvas } from "@react-three/fiber/native";
import { useCallback, useRef, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Gesture, GestureDetector, GestureHandlerRootView } from "react-native-gesture-handler";

import { INITIAL_SPEED, LANES, OBSTACLE_INTERVAL_BASE, SWIPE_THRESHOLD } from "./constants";
import GameScene from "./GameScene";
import type { GameRef, GameStatus, Lane } from "./types";

function makeInitialState(): GameRef {
  return {
    status: "idle",
    lane: 1,
    targetLane: 1,
    playerX: LANES[1],
    playerY: 0,
    isJumping: false,
    jumpTimer: 0,
    speed: INITIAL_SPEED,
    score: 0,
    time: 0,
    nextObstacleIn: OBSTACLE_INTERVAL_BASE,
    obstacles: [],
    obstacleCounter: 0,
  };
}

export default function GameScreen() {
  const gameRef = useRef<GameRef>(makeInitialState());
  const [status, setStatus] = useState<GameStatus>("idle");
  const [score, setScore] = useState(0);
  const [finalScore, setFinalScore] = useState(0);

  const startGame = useCallback(() => {
    gameRef.current = makeInitialState();
    gameRef.current.status = "playing";
    setScore(0);
    setStatus("playing");
  }, []);

  const handleScore = useCallback((s: number) => {
    setScore(s);
  }, []);

  const handleGameOver = useCallback((s: number) => {
    setFinalScore(s);
    setStatus("gameover");
  }, []);

  const gesture = Gesture.Pan()
    .runOnJS(true)
    .onEnd((e) => {
      const g = gameRef.current;
      if (g.status !== "playing") return;

      const { translationX, translationY, velocityX, velocityY } = e;

      if (Math.abs(translationX) > Math.abs(translationY)) {
        if (translationX > SWIPE_THRESHOLD || velocityX > 400) {
          if (g.targetLane < 2) g.targetLane = (g.targetLane + 1) as Lane;
        } else if (translationX < -SWIPE_THRESHOLD || velocityX < -400) {
          if (g.targetLane > 0) g.targetLane = (g.targetLane - 1) as Lane;
        }
      } else {
        if (translationY < -SWIPE_THRESHOLD || velocityY < -400) {
          if (!g.isJumping) {
            g.isJumping = true;
            g.jumpTimer = 0;
          }
        }
      }
    });

  return (
    <GestureHandlerRootView style={styles.root}>
      <GestureDetector gesture={gesture}>
        <View style={styles.root}>
          {/* 3D Canvas */}
          <Canvas
            camera={{ position: [0, 3.5, 7], fov: 65 }}
            style={styles.canvas}
            onCreated={({ gl }) => {
              gl.setClearColor("#0a0a1e");
            }}
            pointerEvents="none"
          >
            <GameScene gameRef={gameRef} onScore={handleScore} onGameOver={handleGameOver} />
          </Canvas>

          {/* HUD */}
          {status === "playing" && (
            <View style={styles.hud} pointerEvents="none">
              <Text style={styles.score}>{score}</Text>
            </View>
          )}

          {/* Idle screen */}
          {status === "idle" && (
            <View style={styles.overlay}>
              <Text style={styles.title}>RUNNER</Text>
              <Text style={styles.subtitle}>Swipe to dodge obstacles</Text>
              <TouchableOpacity style={styles.btn} onPress={startGame}>
                <Text style={styles.btnText}>START</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Game over screen */}
          {status === "gameover" && (
            <View style={styles.overlay}>
              <Text style={styles.title}>GAME OVER</Text>
              <Text style={styles.scoreLabel}>Score</Text>
              <Text style={styles.scoreBig}>{finalScore}</Text>
              <TouchableOpacity style={styles.btn} onPress={startGame}>
                <Text style={styles.btnText}>PLAY AGAIN</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#0a0a1e",
  },
  canvas: {
    flex: 1,
  },
  hud: {
    position: "absolute",
    top: 52,
    width: "100%",
    alignItems: "center",
  },
  score: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#ffffff",
    textShadowColor: "#00eeff",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(10,10,30,0.82)",
  },
  title: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#00eeff",
    letterSpacing: 6,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: "#aaaacc",
    marginBottom: 40,
  },
  scoreLabel: {
    fontSize: 18,
    color: "#aaaacc",
    marginBottom: 6,
  },
  scoreBig: {
    fontSize: 64,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 36,
  },
  btn: {
    backgroundColor: "#00eeff",
    paddingHorizontal: 48,
    paddingVertical: 14,
    borderRadius: 8,
  },
  btnText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0a0a1e",
    letterSpacing: 3,
  },
});
