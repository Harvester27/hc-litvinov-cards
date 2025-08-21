'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Info } from 'lucide-react';
import dynamic from 'next/dynamic';

// Dynamicky importuj WrestlerCharacter a AIWrestler (kvůli SSR)
const WrestlerCharacter = dynamic(() => import('./WrestlerCharacter'), {
  ssr: false
});
const AIWrestlerComponent = dynamic(() => import('./AIWrestler'), {
  ssr: false
});

const WrestlingRing3D = () => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const frameRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [playerHealth, setPlayerHealth] = useState(100);
  const [playerStamina, setPlayerStamina] = useState(100);
  const [aiHealth, setAIHealth] = useState(100);
  const [aiStamina, setAIStamina] = useState(100);
  const playerRef = useRef(null);
  const aiRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);
    sceneRef.current = scene;

    // Camera setup - perfektní boční pohled ze strany se schody
    const camera = new THREE.PerspectiveCamera(
      45,  // Optimální zorný úhel pro boční pohled (jako TV kamera)
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    // Kamera z boku - přesně ze strany kde jsou schody (jako televizní přenos WWE)
    camera.position.set(0, 4.5, 17);  // x=0 (vycentrované), y=4.5 (mírně nad ringem), z=17 (ideální vzdálenost)
    camera.lookAt(0, 0, 0);  // Kouká přesně na střed ringu

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 20, 10);
    directionalLight.castShadow = true;
    directionalLight.shadow.camera.left = -20;
    directionalLight.shadow.camera.right = 20;
    directionalLight.shadow.camera.top = 20;
    directionalLight.shadow.camera.bottom = -20;
    scene.add(directionalLight);

    // Ring dimensions
    const ringSize = 10;
    const postHeight = 3.2; // Snížená výška sloupků
    const postRadius = 0.15;

    // Ring platform (base)
    const platformGeometry = new THREE.BoxGeometry(ringSize + 2, 1, ringSize + 2);
    const platformMaterial = new THREE.MeshPhongMaterial({ color: 0x1a1a1a });
    const platform = new THREE.Mesh(platformGeometry, platformMaterial);
    platform.position.y = -0.5;
    platform.receiveShadow = true;
    scene.add(platform);

    // Ring canvas (mat)
    const canvasGeometry = new THREE.BoxGeometry(ringSize, 0.3, ringSize);
    const canvasMaterial = new THREE.MeshPhongMaterial({ color: 0x333333 });
    const canvas = new THREE.Mesh(canvasGeometry, canvasMaterial);
    canvas.position.y = 0.15;
    canvas.receiveShadow = true;
    canvas.castShadow = true;
    scene.add(canvas);

    // Ring apron sides
    const apronHeight = 1;
    const apronMaterial = new THREE.MeshPhongMaterial({ color: 0x000000 });

    // Front apron
    const frontApronGeometry = new THREE.BoxGeometry(ringSize + 0.2, apronHeight, 0.1);
    const frontApron = new THREE.Mesh(frontApronGeometry, apronMaterial);
    frontApron.position.set(0, -0.5, ringSize / 2 + 0.1);
    scene.add(frontApron);

    // Back apron
    const backApron = new THREE.Mesh(frontApronGeometry, apronMaterial);
    backApron.position.set(0, -0.5, -ringSize / 2 - 0.1);
    scene.add(backApron);

    // Side aprons
    const sideApronGeometry = new THREE.BoxGeometry(0.1, apronHeight, ringSize + 0.2);
    const leftApron = new THREE.Mesh(sideApronGeometry, apronMaterial);
    leftApron.position.set(-ringSize / 2 - 0.1, -0.5, 0);
    scene.add(leftApron);

    const rightApron = new THREE.Mesh(sideApronGeometry, apronMaterial);
    rightApron.position.set(ringSize / 2 + 0.1, -0.5, 0);
    scene.add(rightApron);

    // WWE.COM text texture creation
    const createTextTexture = (text) => {
      const textCanvas = document.createElement('canvas');
      textCanvas.width = 512;
      textCanvas.height = 128;
      const context = textCanvas.getContext('2d');

      context.fillStyle = '#000000';
      context.fillRect(0, 0, textCanvas.width, textCanvas.height);

      context.fillStyle = '#ffffff';
      context.fillRect(0, 40, textCanvas.width, 48);

      context.fillStyle = '#ff0000';
      context.font = 'bold 60px Arial';
      context.textAlign = 'center';
      context.fillText(text, textCanvas.width / 2, 80);

      return new THREE.CanvasTexture(textCanvas);
    };

    const wweTexture = createTextTexture('WWE.COM');
    const texturedMaterial = new THREE.MeshPhongMaterial({ map: wweTexture });

    // Apply texture to front apron
    const textPlaneGeometry = new THREE.PlaneGeometry(ringSize, apronHeight);
    const textPlane = new THREE.Mesh(textPlaneGeometry, texturedMaterial);
    textPlane.position.set(0, -0.5, ringSize / 2 + 0.11);
    scene.add(textPlane);

    // Corner posts
    const postMaterial = new THREE.MeshPhongMaterial({ color: 0x808080 });
    const postGeometry = new THREE.CylinderGeometry(postRadius, postRadius, postHeight);

    const posts = [];
    const postPositions = [
      [-ringSize / 2, postHeight / 2, -ringSize / 2],
      [ringSize / 2, postHeight / 2, -ringSize / 2],
      [ringSize / 2, postHeight / 2, ringSize / 2],
      [-ringSize / 2, postHeight / 2, ringSize / 2]
    ];

    postPositions.forEach(pos => {
      const post = new THREE.Mesh(postGeometry, postMaterial);
      post.position.set(...pos);
      post.castShadow = true;
      scene.add(post);
      posts.push(post);
    });

    // Turnbuckles (rope connectors) - SNÍŽENÉ VÝŠKY PROVAZŮ
    const turnbuckleMaterial = new THREE.MeshPhongMaterial({ color: 0x1a1a1a });
    const turnbuckleGeometry = new THREE.SphereGeometry(0.2, 8, 8);

    // SNÍŽENÉ VÝŠKY PROVAZŮ - reálnější pro wrestling
    const ropeHeights = [1.0, 1.5, 2.0]; // Původně bylo [1.5, 2.2, 2.9]
    
    posts.forEach(post => {
      ropeHeights.forEach(height => {
        const turnbuckle = new THREE.Mesh(turnbuckleGeometry, turnbuckleMaterial);
        turnbuckle.position.set(post.position.x, height, post.position.z);
        scene.add(turnbuckle);
      });
    });

    // Ropes
    const ropeMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });
    const ropeRadius = 0.05;

    // Create ropes between posts
    ropeHeights.forEach(height => {
      // Front rope
      const frontRopeGeometry = new THREE.CylinderGeometry(ropeRadius, ropeRadius, ringSize);
      const frontRope = new THREE.Mesh(frontRopeGeometry, ropeMaterial);
      frontRope.position.set(0, height, ringSize / 2);
      frontRope.rotation.z = Math.PI / 2;
      scene.add(frontRope);

      // Back rope
      const backRope = new THREE.Mesh(frontRopeGeometry, ropeMaterial);
      backRope.position.set(0, height, -ringSize / 2);
      backRope.rotation.z = Math.PI / 2;
      scene.add(backRope);

      // Left rope
      const sideRopeGeometry = new THREE.CylinderGeometry(ropeRadius, ropeRadius, ringSize);
      const leftRope = new THREE.Mesh(sideRopeGeometry, ropeMaterial);
      leftRope.position.set(-ringSize / 2, height, 0);
      leftRope.rotation.x = Math.PI / 2;
      scene.add(leftRope);

      // Right rope
      const rightRope = new THREE.Mesh(sideRopeGeometry, ropeMaterial);
      rightRope.position.set(ringSize / 2, height, 0);
      rightRope.rotation.x = Math.PI / 2;
      scene.add(rightRope);
    });

    // Stairs
    const stairMaterial = new THREE.MeshPhongMaterial({ color: 0x606060 });
    const stairWidth = 2;
    const stairDepth = 0.8;
    const stairHeight = 0.25;
    const numStairs = 4;

    for (let i = 0; i < numStairs; i++) {
      const stairGeometry = new THREE.BoxGeometry(stairWidth, stairHeight, stairDepth);
      const stair = new THREE.Mesh(stairGeometry, stairMaterial);
      stair.position.set(0, -0.875 + (i * stairHeight), ringSize / 2 + 1 + (i * stairDepth));
      stair.receiveShadow = true;
      stair.castShadow = true;
      scene.add(stair);
    }

    // Statická kamera - boční pohled jako televizní přenos
    // Kamera je umístěna ze strany, kde jsou schody, a poskytuje perfektní pohled na celý ring
    
    // Window resize handler
    const handleResize = () => {
      if (!mountRef.current) return;
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    // Animation loop - statická kamera, pouze rendering
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };

    setIsLoading(false);
    animate();

    // Cleanup
    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, []);

  // Debug info update interval
  useEffect(() => {
    const debugInterval = setInterval(() => {
      if (playerRef.current && aiRef.current) {
        const playerPos = playerRef.current.group?.position;
        const aiPos = aiRef.current.group?.position;
        
        if (playerPos && aiPos) {
          const distance = Math.sqrt(
            Math.pow(playerPos.x - aiPos.x, 2) + 
            Math.pow(playerPos.z - aiPos.z, 2)
          );
          
          console.log(`=== STAV HRY ===`);
          console.log(`Hráč: x=${playerPos.x.toFixed(2)}, z=${playerPos.z.toFixed(2)}`);
          console.log(`  Leží: ${playerRef.current.isLyingDown}, Timer: ${playerRef.current.lyingTimer}`);
          console.log(`  Omráčen: ${playerRef.current.isStunned}, Timer: ${playerRef.current.stunnedTimer}`);
          console.log(`AI: x=${aiPos.x.toFixed(2)}, z=${aiPos.z.toFixed(2)}`);
          console.log(`  Stav: ${aiRef.current.aiState}`);
          console.log(`  Leží: ${aiRef.current.isLyingDown}, Timer: ${aiRef.current.lyingTimer}`);
          console.log(`  Omráčen: ${aiRef.current.isStunned}, Timer: ${aiRef.current.stunnedTimer}`);
          console.log(`  Přibližuje: ${aiRef.current.isApproachingForMove}`);
          console.log(`Vzdálenost: ${distance.toFixed(2)}`);
          console.log(`----------------`);
        }
      }
    }, 1000); // Každou sekundu

    return () => clearInterval(debugInterval);
  }, []);

  return (
    <div className="relative w-full h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-purple-900">
      {/* Info panel s ovládáním */}
      <div className="absolute top-4 left-4 z-10 space-y-2">
        {/* Ovládání */}
        <div className="bg-black/50 backdrop-blur-sm text-white p-3 rounded-lg">
          <div className="font-bold mb-2 flex items-center gap-2">
            <Info className="w-4 h-4" />
            <span>Ovládání</span>
          </div>
          <div className="text-xs space-y-1">
            <div>⌨️ <span className="font-bold">WASD</span> - Pohyb (8 směrů)</div>
            <div>🔺 <span className="font-bold">Mezerník</span> - Skok</div>
            <div>👊 <span className="font-bold">E</span> - Úder</div>
            <div>🛡️ <span className="font-bold">Q</span> - Blok</div>
            <div>💀 <span className="font-bold">F</span> - Chvat (auto-přiblížení)</div>
          </div>
          <div className="text-xs mt-2 text-gray-300">
            <div>Chokeslam zepředu, Suplex zezadu!</div>
            <div className="text-xs text-yellow-400">Chvaty berou staminu!</div>
          </div>
        </div>
        
        {/* Health bars */}
        <div className="bg-black/50 backdrop-blur-sm text-white p-3 rounded-lg space-y-3">
          {/* Player Health & Stamina */}
          <div>
            <div className="text-xs font-bold mb-1 text-red-400">🔴 Hráč</div>
            <div className="space-y-1">
              {/* Health */}
              <div className="flex items-center gap-2">
                <span className="text-xs w-12">HP</span>
                <div className="bg-gray-800 rounded-full h-2 w-24 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-green-400 h-full transition-all duration-300"
                    style={{ width: `${playerHealth}%` }}
                  />
                </div>
              </div>
              {/* Stamina */}
              <div className="flex items-center gap-2">
                <span className="text-xs w-12">STA</span>
                <div className="bg-gray-800 rounded-full h-2 w-24 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-yellow-500 to-yellow-400 h-full transition-all duration-300"
                    style={{ width: `${playerStamina}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* AI Health & Stamina */}
          <div>
            <div className="text-xs font-bold mb-1 text-blue-400">🔵 AI Soupeř</div>
            <div className="space-y-1">
              {/* Health */}
              <div className="flex items-center gap-2">
                <span className="text-xs w-12">HP</span>
                <div className="bg-gray-800 rounded-full h-2 w-24 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-blue-400 h-full transition-all duration-300"
                    style={{ width: `${aiHealth}%` }}
                  />
                </div>
              </div>
              {/* Stamina */}
              <div className="flex items-center gap-2">
                <span className="text-xs w-12">STA</span>
                <div className="bg-gray-800 rounded-full h-2 w-24 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-cyan-500 to-cyan-400 h-full transition-all duration-300"
                    style={{ width: `${aiStamina}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Loading indicator */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <div className="bg-black/50 backdrop-blur-sm text-white px-6 py-3 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
              <span>Načítání 3D ringu a wrestlerů...</span>
            </div>
          </div>
        </div>
      )}

      {/* 3D Scene container */}
      <div 
        ref={mountRef} 
        className="w-full h-full"
        style={{ touchAction: 'none' }}
      />
      
      {/* Wrestler Character Controller */}
      {sceneRef.current && (
        <>
          <WrestlerCharacter 
            ref={playerRef}
            scene={sceneRef.current} 
            aiWrestlerRef={aiRef}
            onUpdate={(data) => {
              setPlayerHealth(data.health);
              setPlayerStamina(data.stamina || 100);
            }}
          />
          <AIWrestlerComponent
            ref={aiRef}
            scene={sceneRef.current}
            playerRef={playerRef}
            difficulty="medium"
            onUpdate={(data) => {
              setAIHealth(data.health);
              setAIStamina(data.stamina || 100);
            }}
          />
        </>
      )}
    </div>
  );
};

export default WrestlingRing3D;