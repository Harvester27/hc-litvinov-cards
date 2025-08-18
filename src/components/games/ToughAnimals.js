import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { ArrowLeft } from 'lucide-react';

// Ring creation function
const createRing = (scene) => {
  const ringSize = 10;
  const postHeight = 4;
  const postRadius = 0.15;

  // Ring platform
  const platformGeometry = new THREE.BoxGeometry(ringSize + 2, 1, ringSize + 2);
  const platformMaterial = new THREE.MeshPhongMaterial({ color: 0x1a1a1a });
  const platform = new THREE.Mesh(platformGeometry, platformMaterial);
  platform.position.y = -0.5;
  platform.receiveShadow = true;
  scene.add(platform);

  // Ring mat
  const canvasGeometry = new THREE.BoxGeometry(ringSize, 0.3, ringSize);
  const canvasMaterial = new THREE.MeshPhongMaterial({ color: 0x333333 });
  const canvas = new THREE.Mesh(canvasGeometry, canvasMaterial);
  canvas.position.y = 0.15;
  canvas.receiveShadow = true;
  scene.add(canvas);

  // Corner posts
  const postMaterial = new THREE.MeshPhongMaterial({ color: 0x808080 });
  const postGeometry = new THREE.CylinderGeometry(postRadius, postRadius, postHeight);

  const postPositions = [
    [-ringSize/2, postHeight/2, -ringSize/2],
    [ ringSize/2, postHeight/2, -ringSize/2],
    [ ringSize/2, postHeight/2,  ringSize/2],
    [-ringSize/2, postHeight/2,  ringSize/2]
  ];

  postPositions.forEach(pos => {
    const post = new THREE.Mesh(postGeometry, postMaterial);
    post.position.set(...pos);
    post.castShadow = true;
    scene.add(post);
  });

  // Ropes
  const ropeMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });
  const ropeRadius = 0.05;
  const ropeHeights = [1.5, 2.2, 2.9];

  ropeHeights.forEach(height => {
    const ropeH = new THREE.CylinderGeometry(ropeRadius, ropeRadius, ringSize);
    const rope1 = new THREE.Mesh(ropeH, ropeMaterial);
    rope1.position.set(0, height, ringSize/2);
    rope1.rotation.z = Math.PI / 2;
    scene.add(rope1);

    const rope2 = new THREE.Mesh(ropeH, ropeMaterial);
    rope2.position.set(0, height, -ringSize/2);
    rope2.rotation.z = Math.PI / 2;
    scene.add(rope2);

    const rope3 = new THREE.Mesh(ropeH, ropeMaterial);
    rope3.position.set(-ringSize/2, height, 0);
    rope3.rotation.x = Math.PI / 2;
    scene.add(rope3);

    const rope4 = new THREE.Mesh(ropeH, ropeMaterial);
    rope4.position.set(ringSize/2, height, 0);
    rope4.rotation.x = Math.PI / 2;
    scene.add(rope4);
  });

  // Floor (tmavší – méně „bílé“ plochy)
  const floorGeometry = new THREE.BoxGeometry(50, 0.1, 50);
  const floorMaterial = new THREE.MeshPhongMaterial({ color: 0x222222 });
  const floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.position.y = -1.05;
  floor.receiveShadow = true;
  scene.add(floor);
};

const BoxingGame = () => {
  // Game states
  const [gameState, setGameState] = useState('menu');
  const [playerHealth, setPlayerHealth] = useState(100);
  const [aiHealth, setAiHealth] = useState(100);
  const [playerStamina, setPlayerStamina] = useState(100);
  const [aiStamina, setAiStamina] = useState(100);
  const [winner, setWinner] = useState(null);
  const [hitFeedback, setHitFeedback] = useState('');

  // Three.js refs
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const frameRef = useRef(null);
  const gameRef = useRef({
    player: null,
    ai: null,
    keys: {},
    gameRunning: false,
    clock: new THREE.Clock(),
    playerState: { punching: false, blocking: false, cooldown: 0 },
    aiState: { punching: false, blocking: false, cooldown: 0 }
  });

  // Lock scroll while playing (pro jistotu)
  useEffect(() => {
    if (gameState === 'playing') {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      document.body.style.backgroundColor = '#000'; // pozadí stránky černé, žádná bílá za canvasem
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [gameState]);

  // Main Menu
  const MainMenu = () => (
    <div className="min-h-screen bg-gradient-to-br from-red-600 via-red-700 to-red-900 flex items-center justify-center">
      <div className="text-center">
        <div className="text-8xl mb-6 animate-bounce">🥊</div>
        <h1 className="text-6xl font-black text-white mb-4">BOXING CHAMPIONSHIP</h1>
        <p className="text-xl text-white/80 mb-8">Fight to Win!</p>
        <button
          onClick={() => startGame()}
          className="bg-white text-red-800 px-12 py-6 rounded-2xl font-bold text-2xl hover:scale-105 transition-transform shadow-2xl"
        >
          START FIGHT
        </button>
      </div>
    </div>
  );

  // Start game
  const startGame = () => {
    setGameState('playing');
    setPlayerHealth(100);
    setAiHealth(100);
    setPlayerStamina(100);
    setAiStamina(100);
    setWinner(null);
    gameRef.current.gameRunning = true;
  };

  // End game
  const endGame = (playerWon) => {
    gameRef.current.gameRunning = false;
    setWinner(playerWon ? 'player' : 'ai');
    setGameState('gameOver');
  };

  // Check for game over
  useEffect(() => {
    if (gameState === 'playing' && (playerHealth <= 0 || aiHealth <= 0)) {
      endGame(playerHealth > 0);
    }
  }, [playerHealth, aiHealth, gameState]);

  // Three.js Setup
  useEffect(() => {
    if (gameState !== 'playing' || !mountRef.current) return;

    // Scene
    const scene = new THREE.Scene();
    // Nepoužívej velmi světlé pozadí, dáme lehce tmavší „sky“
    scene.background = new THREE.Color(0x223449);
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 8, 12);
    camera.lookAt(0, 2, 0);

    // Renderer – stabilnější nastavení
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,                  // plátno není průhledné → žádné prosvítání bílé
      preserveDrawingBuffer: true,   // drží poslední frame, snižuje flicker
      powerPreference: 'high-performance'
    });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x0b0e12, 1);        // tmavé clearColor
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Plátno absolutně přes celý kontejner (žádné layouty pod tím)
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.inset = '0';
    renderer.domElement.style.display = 'block';

    // Pojistka proti context-lost
    const onLost = (ev) => ev.preventDefault();
    renderer.domElement.addEventListener('webglcontextlost', onLost, false);

    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lights – trochu méně intenzivní, ať nic „nezáří“ bíle
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.55);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.45);
    directionalLight.position.set(5, 10, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.set(1024, 1024);
    scene.add(directionalLight);

    // Create simple boxer
    const createBoxer = (color, x, z) => {
      const boxer = new THREE.Group();

      const bodyGeometry = new THREE.BoxGeometry(1, 1.5, 0.5);
      const bodyMaterial = new THREE.MeshPhongMaterial({ color });
      const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
      body.position.y = 2;
      body.castShadow = true;
      boxer.add(body);

      const headGeometry = new THREE.BoxGeometry(0.6, 0.6, 0.6);
      const headMaterial = new THREE.MeshPhongMaterial({ color: 0xFFDBB4 });
      const head = new THREE.Mesh(headGeometry, headMaterial);
      head.position.y = 3.2;
      head.castShadow = true;
      boxer.add(head);

      const armGeometry = new THREE.BoxGeometry(0.3, 1.2, 0.3);
      const armMaterial = new THREE.MeshPhongMaterial({ color });

      const leftArm = new THREE.Mesh(armGeometry, armMaterial);
      leftArm.position.set(-0.7, 2, 0);
      leftArm.castShadow = true;
      boxer.add(leftArm);
      boxer.leftArm = leftArm;

      const rightArm = new THREE.Mesh(armGeometry, armMaterial);
      rightArm.position.set(0.7, 2, 0);
      rightArm.castShadow = true;
      boxer.add(rightArm);
      boxer.rightArm = rightArm;

      const gloveGeometry = new THREE.SphereGeometry(0.3);
      const gloveMaterial = new THREE.MeshPhongMaterial({
        color: x < 0 ? 0xFF3B3B : 0x3B5BFF
      });

      const leftGlove = new THREE.Mesh(gloveGeometry, gloveMaterial);
      leftGlove.position.set(-0.7, 1.2, 0);
      leftGlove.castShadow = true;
      boxer.add(leftGlove);
      boxer.leftGlove = leftGlove;

      const rightGlove = new THREE.Mesh(gloveGeometry, gloveMaterial);
      rightGlove.position.set(0.7, 1.2, 0);
      rightGlove.castShadow = true;
      boxer.add(rightGlove);
      boxer.rightGlove = rightGlove;

      const legGeometry = new THREE.BoxGeometry(0.4, 1.5, 0.4);
      const legMaterial = new THREE.MeshPhongMaterial({ color: 0x111a44 });

      const leftLeg = new THREE.Mesh(legGeometry, legMaterial);
      leftLeg.position.set(-0.3, 0.75, 0);
      leftLeg.castShadow = true;
      boxer.add(leftLeg);

      const rightLeg = new THREE.Mesh(legGeometry, legMaterial);
      rightLeg.position.set(0.3, 0.75, 0);
      rightLeg.castShadow = true;
      boxer.add(rightLeg);

      boxer.position.set(x, 0, z);
      scene.add(boxer);
      return boxer;
    };

    // Initialize scene
    createRing(scene);
    gameRef.current.player = createBoxer(0xFF6B6B, -3, 0);
    gameRef.current.ai     = createBoxer(0x6B6BFF,  3, 0);

    // Simple punch animation
    const animatePunch = (boxer, isLeft) => {
      const arm = isLeft ? boxer.leftArm : boxer.rightArm;
      const glove = isLeft ? boxer.leftGlove : boxer.rightGlove;
      if (!arm || !glove) return;

      const originalZ = arm.position.z;
      const originalGloveZ = glove.position.z;

      arm.position.z += 1.5;
      glove.position.z += 1.5;

      setTimeout(() => {
        if (arm && glove) {
          arm.position.z = originalZ;
          glove.position.z = originalGloveZ;
        }
      }, 200);
    };

    // Simple attack system
    const performAttack = (attacker, defender, isAI) => {
      const state = isAI ? gameRef.current.aiState : gameRef.current.playerState;
      const defenderState = isAI ? gameRef.current.playerState : gameRef.current.aiState;
      if (state.cooldown > 0) return;

      const distance = attacker.position.distanceTo(defender.position);

      if (distance < 4) {
        animatePunch(attacker, Math.random() > 0.5);

        let damage = 10;
        let staminaCost = 10;

        if (defenderState.blocking) {
          damage = 2;
          setHitFeedback('Blocked!');
        } else {
          setHitFeedback('Hit!');
        }

        if (isAI) {
          setPlayerHealth(prev => Math.max(0, prev - damage));
          setAiStamina(prev => Math.max(0, prev - staminaCost));
        } else {
          setAiHealth(prev => Math.max(0, prev - damage));
          setPlayerStamina(prev => Math.max(0, prev - staminaCost));
        }

        state.cooldown = 0.5;
        setTimeout(() => setHitFeedback(''), 300); // kratší doba – méně reflow
      }
    };

    // Animation loop
    const animate = () => {
      if (!gameRef.current.gameRunning) return;
      frameRef.current = requestAnimationFrame(animate);

      const deltaTime = Math.min(gameRef.current.clock.getDelta(), 0.08);
      const time = gameRef.current.clock.getElapsedTime();

      const player = gameRef.current.player;
      const ai = gameRef.current.ai;
      const keys = gameRef.current.keys;
      if (!player || !ai) return;

      // Update cooldowns
      gameRef.current.playerState.cooldown = Math.max(0, gameRef.current.playerState.cooldown - deltaTime);
      gameRef.current.aiState.cooldown = Math.max(0, gameRef.current.aiState.cooldown - deltaTime);

      // Regenerate stamina
      setPlayerStamina(prev => Math.min(100, prev + deltaTime * 10));
      setAiStamina(prev => Math.min(100, prev + deltaTime * 10));

      // Player movement
      const moveSpeed = 5;
      if (keys['w']) player.position.z -= moveSpeed * deltaTime;
      if (keys['s']) player.position.z += moveSpeed * deltaTime;
      if (keys['a']) player.position.x -= moveSpeed * deltaTime;
      if (keys['d']) player.position.x += moveSpeed * deltaTime;

      // Keep in bounds
      player.position.x = Math.max(-4, Math.min(4, player.position.x));
      player.position.z = Math.max(-4, Math.min(4, player.position.z));

      // Player actions
      gameRef.current.playerState.blocking = !!(keys['shift']);

      if (keys[' '] || keys['spacebar']) {
        performAttack(player, ai, false);
      }

      // Guard position
      const setGuard = (who, on) => {
        who.leftArm.position.y = on ? 2.5 : 2;
        who.rightArm.position.y = on ? 2.5 : 2;
        who.leftGlove.position.y = on ? 2.5 : 1.2;
        who.rightGlove.position.y = on ? 2.5 : 1.2;
      };
      setGuard(player, gameRef.current.playerState.blocking);

      // Simple AI
      const aiDirection = new THREE.Vector3().subVectors(player.position, ai.position);
      const distance = aiDirection.length();
      aiDirection.normalize();

      if (distance > 3) {
        ai.position.x += aiDirection.x * moveSpeed * 0.8 * deltaTime;
        ai.position.z += aiDirection.z * moveSpeed * 0.8 * deltaTime;
      } else if (distance < 2) {
        ai.position.x -= aiDirection.x * moveSpeed * 0.5 * deltaTime;
        ai.position.z -= aiDirection.z * moveSpeed * 0.5 * deltaTime;
      }

      if (distance < 4 && Math.random() < 0.02) {
        performAttack(ai, player, true);
      }

      gameRef.current.aiState.blocking = distance < 3 && Math.random() < 0.3;
      setGuard(ai, gameRef.current.aiState.blocking);

      // Keep AI in bounds
      ai.position.x = Math.max(-4, Math.min(4, ai.position.x));
      ai.position.z = Math.max(-4, Math.min(4, ai.position.z));

      // Face each other
      player.lookAt(ai.position.x, player.position.y, ai.position.z);
      ai.lookAt(player.position.x, ai.position.y, player.position.z);

      // Simple idle animation
      const idleAnim = Math.sin(time * 2) * 0.05;
      player.position.y = idleAnim;
      ai.position.y = -idleAnim;

      // Camera follow
      camera.position.x = (player.position.x + ai.position.x) / 2;
      camera.position.z = Math.max(player.position.z, ai.position.z) + 8;
      camera.lookAt((player.position.x + ai.position.x) / 2, 2, (player.position.z + ai.position.z) / 2);

      renderer.render(scene, camera);
    };

    animate();

    // Controls (s preventDefault pro klíčové klávesy)
    const controlKeys = new Set([
      'w','a','s','d','shift','arrowup','arrowdown','arrowleft','arrowright',' ','spacebar'
    ]);

    const handleKeyDown = (e) => {
      const k = e.key.toLowerCase();
      if (controlKeys.has(k) || e.code === 'Space') e.preventDefault();
      gameRef.current.keys[k] = true;
    };

    const handleKeyUp = (e) => {
      const k = e.key.toLowerCase();
      if (controlKeys.has(k) || e.code === 'Space') e.preventDefault();
      gameRef.current.keys[k] = false;
    };

    window.addEventListener('keydown', handleKeyDown, { passive: false });
    window.addEventListener('keyup', handleKeyUp, { passive: false });

    // Resize
    const handleResize = () => {
      if (!mountRef.current) return;
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('webglcontextlost', onLost);

      if (frameRef.current) cancelAnimationFrame(frameRef.current);

      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }

      // korektní uvolnění
      try { renderer.forceContextLoss && renderer.forceContextLoss(); } catch {}
      renderer.dispose();
    };
  }, [gameState]);

  // Game Screen
  const GameScreen = () => (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {/* WebGL mount */}
      <div ref={mountRef} className="absolute inset-0" />

      {/* HUD – bez backdrop-blur a bez bílého pozadí */}
      <div
        className="absolute top-6 left-0 right-0 px-6 flex justify-between pointer-events-none"
        style={{ contain: 'paint' }}
      >
        <div className="bg-black/60 p-4 rounded-xl shadow-lg min-w-[250px]">
          <div className="text-lg font-bold mb-2 text-white">🥊 Player</div>
          <div className="mb-2">
            <div className="text-xs text-white/70">HEALTH</div>
            <div className="bg-white/10 rounded-full h-5">
              <div
                className="bg-green-500 h-5 rounded-full transition-all"
                style={{ width: `${playerHealth}%` }}
              />
            </div>
          </div>
          <div>
            <div className="text-xs text-white/70">STAMINA</div>
            <div className="bg-white/10 rounded-full h-3">
              <div
                className="bg-yellow-500 h-3 rounded-full transition-all"
                style={{ width: `${playerStamina}%` }}
              />
            </div>
          </div>
        </div>

        {hitFeedback && (
          <div className="absolute top-20 left-1/2 -translate-x-1/2">
            <div className="text-4xl font-black text-white drop-shadow-lg">
              {hitFeedback}
            </div>
          </div>
        )}

        <div className="bg-black/60 p-4 rounded-xl shadow-lg min-w-[250px]">
          <div className="text-lg font-bold mb-2 text-white">AI 🤖</div>
          <div className="mb-2">
            <div className="text-xs text-white/70">HEALTH</div>
            <div className="bg-white/10 rounded-full h-5">
              <div
                className="bg-red-500 h-5 rounded-full transition-all"
                style={{ width: `${aiHealth}%` }}
              />
            </div>
          </div>
          <div>
            <div className="text-xs text-white/70">STAMINA</div>
            <div className="bg-white/10 rounded-full h-3">
              <div
                className="bg-yellow-500 h-3 rounded-full transition-all"
                style={{ width: `${aiStamina}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Back button (má pointer events) */}
      <button
        onClick={() => setGameState('menu')}
        className="absolute top-6 left-6 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
      >
        <ArrowLeft size={20} />
        <span className="font-bold">Back</span>
      </button>

      {/* Controls */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/60 px-8 py-4 rounded-xl shadow-lg pointer-events-none text-white">
        <div className="font-bold text-center">
          WASD = Move | Space = Punch | Shift = Block
        </div>
      </div>
    </div>
  );

  // Game Over Screen
  const GameOverScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-red-600 via-red-700 to-red-900 flex items-center justify-center">
      <div className="bg-white/10 p-12 rounded-3xl text-center">
        <div className="text-8xl mb-6">{winner === 'player' ? '🏆' : '💀'}</div>
        <h2 className="text-5xl font-black text-white mb-8">
          {winner === 'player' ? 'VICTORY!' : 'DEFEAT!'}
        </h2>

        <div className="flex gap-4 justify-center">
          <button
            onClick={startGame}
            className="bg-white text-red-800 px-8 py-4 rounded-xl font-bold text-xl hover:scale-105 transition-transform"
          >
            Play Again
          </button>
          <button
            onClick={() => setGameState('menu')}
            className="bg-red-500 text-white px-8 py-4 rounded-xl font-bold text-xl hover:bg-red-600 transition-colors"
          >
            Main Menu
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen">
      {gameState === 'menu' && <MainMenu />}
      {gameState === 'playing' && <GameScreen />}
      {gameState === 'gameOver' && <GameOverScreen />}
    </div>
  );
};

export default BoxingGame;
