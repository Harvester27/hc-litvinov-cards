import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';

const Bowling3D = () => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const ballRef = useRef(null);
  const pinsRef = useRef([]);
  const frameRef = useRef(null);
  const arrowRef = useRef(null);
  const raycasterRef = useRef(new THREE.Raycaster());
  const mouseRef = useRef(new THREE.Vector2());
  
  const [score, setScore] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [throwsLeft, setThrowsLeft] = useState(2);
  const [frame, setFrame] = useState(1);
  const [isPowerAdjusting, setIsPowerAdjusting] = useState(false);
  const [power, setPower] = useState(0);
  const [isRolling, setIsRolling] = useState(false);
  const [lastThrowScore, setLastThrowScore] = useState(null);
  const [frameScores, setFrameScores] = useState([]);
  const [ballPosition, setBallPosition] = useState({ x: 0, z: 12 });
  const [aimDirection, setAimDirection] = useState({ x: 0, z: -1 });
  const [spin, setSpin] = useState(0);
  const [isAiming, setIsAiming] = useState(false);

  useEffect(() => {
    if (!mountRef.current) return;

    // Nastavení scény
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a2e);
    scene.fog = new THREE.Fog(0x1a1a2e, 10, 50);
    sceneRef.current = scene;

    // Kamera
    const camera = new THREE.PerspectiveCamera(
      60,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 8, 15);
    camera.lookAt(0, 0, -5);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Světla
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.camera.near = 0.1;
    directionalLight.shadow.camera.far = 50;
    directionalLight.shadow.camera.left = -20;
    directionalLight.shadow.camera.right = 20;
    directionalLight.shadow.camera.top = 20;
    directionalLight.shadow.camera.bottom = -20;
    scene.add(directionalLight);

    // Bowlingová dráha
    const laneGeometry = new THREE.BoxGeometry(3, 0.2, 30);
    const laneMaterial = new THREE.MeshPhongMaterial({ 
      color: 0xd4a574,
      shininess: 100
    });
    const lane = new THREE.Mesh(laneGeometry, laneMaterial);
    lane.position.y = -0.1;
    lane.receiveShadow = true;
    scene.add(lane);

    // Postranní žlábky
    const gutterGeometry = new THREE.BoxGeometry(0.5, 0.1, 30);
    const gutterMaterial = new THREE.MeshPhongMaterial({ color: 0x333333 });
    
    const leftGutter = new THREE.Mesh(gutterGeometry, gutterMaterial);
    leftGutter.position.set(-1.75, -0.05, 0);
    scene.add(leftGutter);
    
    const rightGutter = new THREE.Mesh(gutterGeometry, gutterMaterial);
    rightGutter.position.set(1.75, -0.05, 0);
    scene.add(rightGutter);

    // Značky na dráze
    const arrowGeometry = new THREE.ConeGeometry(0.2, 0.5, 3);
    const arrowMaterial = new THREE.MeshPhongMaterial({ color: 0x000000, opacity: 0.3, transparent: true });
    for (let i = 0; i < 3; i++) {
      const arrow = new THREE.Mesh(arrowGeometry, arrowMaterial);
      arrow.rotation.x = Math.PI / 2;
      arrow.rotation.y = Math.PI;
      arrow.position.set(0, 0.01, 5 - i * 2);
      scene.add(arrow);
    }

    // Zadní stěna
    const backWallGeometry = new THREE.BoxGeometry(5, 3, 0.5);
    const backWallMaterial = new THREE.MeshPhongMaterial({ color: 0x2c2c2c });
    const backWall = new THREE.Mesh(backWallGeometry, backWallMaterial);
    backWall.position.set(0, 1.5, -16);
    scene.add(backWall);

    // Koule s realistickým vzhledem
    const ballGeometry = new THREE.SphereGeometry(0.4, 32, 32);
    const ballMaterial = new THREE.MeshPhongMaterial({ 
      color: 0x8B0000,  // Tmavě červená bowlingová koule
      shininess: 150,
      specular: 0xffffff
    });
    const ball = new THREE.Mesh(ballGeometry, ballMaterial);
    
    // Přidání dírek do koule
    const holeGeometry = new THREE.CylinderGeometry(0.03, 0.03, 0.2, 8);
    const holeMaterial = new THREE.MeshPhongMaterial({ color: 0x000000 });
    
    for (let i = 0; i < 3; i++) {
      const hole = new THREE.Mesh(holeGeometry, holeMaterial);
      const angle = (i * 30 - 30) * Math.PI / 180;
      hole.position.set(Math.sin(angle) * 0.15, 0.35, Math.cos(angle) * 0.15);
      hole.rotation.x = Math.PI / 2;
      ball.add(hole);
    }
    
    ball.position.set(0, 0.4, 12);
    ball.castShadow = true;
    ball.userData = { 
      velocity: new THREE.Vector3(0, 0, 0), 
      angularVelocity: new THREE.Vector3(0, 0, 0),
      spin: 0
    };
    scene.add(ball);
    ballRef.current = ball;
    
    // Směrová šipka pro míření
    const arrowGroup = new THREE.Group();
    
    // Tělo šipky
    const arrowBodyGeometry = new THREE.CylinderGeometry(0.05, 0.05, 3, 8);
    const arrowMaterial2 = new THREE.MeshPhongMaterial({ 
      color: 0x00ff00, 
      opacity: 0.7, 
      transparent: true 
    });
    const arrowBody = new THREE.Mesh(arrowBodyGeometry, arrowMaterial2);
    arrowBody.rotation.x = Math.PI / 2;
    arrowBody.position.z = -1.5;
    arrowGroup.add(arrowBody);
    
    // Špička šipky
    const arrowHeadGeometry = new THREE.ConeGeometry(0.15, 0.5, 8);
    const arrowHead = new THREE.Mesh(arrowHeadGeometry, arrowMaterial2);
    arrowHead.rotation.x = Math.PI / 2;
    arrowHead.position.z = -3.25;
    arrowGroup.add(arrowHead);
    
    arrowGroup.position.copy(ball.position);
    arrowGroup.visible = false;
    scene.add(arrowGroup);
    arrowRef.current = arrowGroup;
    // Kuželky s realistickým vzhledem
    const createPins = () => {
      const pins = [];
      
      // Vytvoření geometrie kuželky
      const createPinGeometry = () => {
        const shape = new THREE.Shape();
        const points = [];
        
        // Profil kuželky (rotační křivka)
        points.push(new THREE.Vector2(0, 0));      // Vrchol
        points.push(new THREE.Vector2(0.08, 0.15)); // Krk
        points.push(new THREE.Vector2(0.12, 0.3));  // Rozšíření
        points.push(new THREE.Vector2(0.15, 0.5));  // Tělo
        points.push(new THREE.Vector2(0.18, 0.8));  // Břicho
        points.push(new THREE.Vector2(0.2, 1.0));   // Spodek
        points.push(new THREE.Vector2(0.2, 1.2));   // Základna
        
        const geometry = new THREE.LatheGeometry(points, 16);
        return geometry;
      };
      
      const pinGeometry = createPinGeometry();
      
      // Materiál pro bílou část kuželky
      const whiteMaterial = new THREE.MeshPhongMaterial({ 
        color: 0xffffff,
        shininess: 100,
        specular: 0x222222
      });
      
      // Vytvoření červených pruhů pomocí druhé vrstvy
      const createPinWithStripes = (x, z, index) => {
        const pinGroup = new THREE.Group();
        
        // Hlavní bílá kuželka
        const pin = new THREE.Mesh(pinGeometry, whiteMaterial);
        pinGroup.add(pin);
        
        // Červené pruhy - vytvoříme dva prstence
        const stripe1Geometry = new THREE.CylinderGeometry(0.151, 0.161, 0.08, 16);
        const stripe2Geometry = new THREE.CylinderGeometry(0.161, 0.171, 0.08, 16);
        const stripeMaterial = new THREE.MeshPhongMaterial({ 
          color: 0xff0000,
          shininess: 100
        });
        
        const stripe1 = new THREE.Mesh(stripe1Geometry, stripeMaterial);
        stripe1.position.y = 0.4;
        pinGroup.add(stripe1);
        
        const stripe2 = new THREE.Mesh(stripe2Geometry, stripeMaterial);
        stripe2.position.y = 0.55;
        pinGroup.add(stripe2);
        
        // Pozice celé skupiny
        pinGroup.position.set(x, 0.6, z);
        pinGroup.castShadow = true;
        pinGroup.userData = { 
          standing: true, 
          index: index,
          originalPosition: new THREE.Vector3(x, 0.6, z),
          velocity: new THREE.Vector3(0, 0, 0),
          angularVelocity: new THREE.Vector3(0, 0, 0)
        };
        
        return pinGroup;
      };
      
      const pinPositions = [
        // Zadní řada (4 kuželky)
        { x: -0.45, z: -12 },
        { x: -0.15, z: -12 },
        { x: 0.15, z: -12 },
        { x: 0.45, z: -12 },
        // Třetí řada (3 kuželky)
        { x: -0.3, z: -11.5 },
        { x: 0, z: -11.5 },
        { x: 0.3, z: -11.5 },
        // Druhá řada (2 kuželky)
        { x: -0.15, z: -11 },
        { x: 0.15, z: -11 },
        // První kuželka
        { x: 0, z: -10.5 }
      ];

      pinPositions.forEach((pos, index) => {
        const pinGroup = createPinWithStripes(pos.x, pos.z, index);
        scene.add(pinGroup);
        pins.push(pinGroup);
      });
      
      pinsRef.current = pins;
    };

    createPins();

    // Animační smyčka s vylepšenou fyzikou
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);
      
      // Pohyb koule s realistickou fyzikou
      if (ballRef.current && ballRef.current.userData.velocity.length() > 0.01) {
        // Pohyb koule
        ballRef.current.position.add(ballRef.current.userData.velocity.clone().multiplyScalar(0.016));
        
        // Rotace koule podle směru pohybu
        const rotationAxis = new THREE.Vector3(
          ballRef.current.userData.velocity.z,
          0,
          -ballRef.current.userData.velocity.x
        ).normalize();
        
        const rotationSpeed = ballRef.current.userData.velocity.length() * 0.1;
        ballRef.current.rotateOnWorldAxis(rotationAxis, rotationSpeed);
        
        // Aplikace spinu (boční rotace)
        if (ballRef.current.userData.spin !== 0) {
          // Spin ovlivňuje trajektorii
          const spinEffect = ballRef.current.userData.spin * 0.002;
          ballRef.current.userData.velocity.x += spinEffect;
          
          // Rotace kolem vertikální osy
          ballRef.current.rotateY(ballRef.current.userData.spin * 0.05);
        }
        
        // Tření a zpomalení
        ballRef.current.userData.velocity.multiplyScalar(0.993);
        ballRef.current.userData.spin *= 0.98;
        
        // Kontrola hranic dráhy (žlábky)
        if (Math.abs(ballRef.current.position.x) > 1.3) {
          // Koule spadla do žlábku - rychlé zpomalení
          ballRef.current.userData.velocity.multiplyScalar(0.9);
          ballRef.current.position.y = Math.max(0.2, ballRef.current.position.y - 0.01);
        }
        
        // Kontrola kolizí s kuželkami
        pinsRef.current.forEach(pinGroup => {
          if (pinGroup.userData.standing) {
            const pinPos = pinGroup.userData.originalPosition;
            const distance = ballRef.current.position.distanceTo(pinPos);
            
            if (distance < 0.55) {
              // Kolize!
              pinGroup.userData.standing = false;
              
              // Výpočet směru nárazu
              const hitDirection = new THREE.Vector3()
                .subVectors(pinPos, ballRef.current.position)
                .normalize();
              
              // Přenos hybnosti s realistickým faktorem
              const impactForce = ballRef.current.userData.velocity.length() * 0.4;
              pinGroup.userData.velocity = hitDirection.multiplyScalar(impactForce);
              pinGroup.userData.velocity.y = Math.random() * 0.2 + 0.1;
              
              // Náhodná rotace po nárazu
              pinGroup.userData.angularVelocity = new THREE.Vector3(
                (Math.random() - 0.5) * 0.3,
                (Math.random() - 0.5) * 0.2,
                (Math.random() - 0.5) * 0.3
              );
              
              // Zpomalení koule po nárazu
              ballRef.current.userData.velocity.multiplyScalar(0.8);
              
              // Lehké odražení koule
              const bounceDirection = new THREE.Vector3()
                .subVectors(ballRef.current.position, pinPos)
                .normalize();
              ballRef.current.userData.velocity.add(bounceDirection.multiplyScalar(0.5));
            }
          }
        });
        
        // Kontrola kolizí mezi kuželkami (dominový efekt)
        pinsRef.current.forEach((pin1, i) => {
          if (!pin1.userData.standing && pin1.userData.velocity.length() > 0.1) {
            pinsRef.current.forEach((pin2, j) => {
              if (i !== j && pin2.userData.standing) {
                const distance = pin1.position.distanceTo(pin2.position);
                if (distance < 0.4) {
                  pin2.userData.standing = false;
                  pin2.userData.velocity = pin1.userData.velocity.clone().multiplyScalar(0.5);
                  pin2.userData.velocity.y = 0.15;
                  pin2.userData.angularVelocity = new THREE.Vector3(
                    (Math.random() - 0.5) * 0.2,
                    (Math.random() - 0.5) * 0.1,
                    (Math.random() - 0.5) * 0.2
                  );
                }
              }
            });
          }
        });
        
        // Reset koule když vyjede z dráhy
        if (ballRef.current.position.z < -15 || 
            Math.abs(ballRef.current.position.x) > 2.5) {
          setTimeout(() => {
            ballRef.current.userData.velocity.set(0, 0, 0);
            ballRef.current.userData.spin = 0;
          }, 500);
        }
      }
      
      // Animace padajících kuželek
      pinsRef.current.forEach(pinGroup => {
        if (!pinGroup.userData.standing && pinGroup.userData.velocity.length() > 0.001) {
          pinGroup.position.add(pinGroup.userData.velocity.clone().multiplyScalar(0.016));
          pinGroup.rotation.x += pinGroup.userData.angularVelocity.x;
          pinGroup.rotation.y += pinGroup.userData.angularVelocity.y;
          pinGroup.rotation.z += pinGroup.userData.angularVelocity.z;
          
          // Gravitace
          pinGroup.userData.velocity.y -= 0.015;
          
          // Když kuželka dopadne na zem
          if (pinGroup.position.y < 0.2) {
            pinGroup.position.y = 0.2;
            pinGroup.userData.velocity.y *= -0.3; // Odraz
            pinGroup.userData.velocity.x *= 0.7;
            pinGroup.userData.velocity.z *= 0.7;
            pinGroup.userData.angularVelocity.multiplyScalar(0.7);
          }
          
          // Tření
          pinGroup.userData.velocity.multiplyScalar(0.96);
          pinGroup.userData.angularVelocity.multiplyScalar(0.94);
        }
      });
      
      // Aktualizace pozice šipky
      if (arrowRef.current && !isRolling) {
        arrowRef.current.position.copy(ballRef.current.position);
      }
      
      renderer.render(scene, camera);
    };

    animate();

    // Event handlery pro ovládání myší
    const handleMouseMove = (event) => {
      if (!mountRef.current || isRolling) return;
      
      const rect = mountRef.current.getBoundingClientRect();
      mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      
      // Raycasting pro určení směru míření
      raycasterRef.current.setFromCamera(mouseRef.current, camera);
      const intersectPoint = new THREE.Vector3();
      const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
      raycasterRef.current.ray.intersectPlane(plane, intersectPoint);
      
      if (intersectPoint && ballRef.current) {
        // Výpočet směru od koule k místu kliknutí
        const direction = new THREE.Vector3()
          .subVectors(intersectPoint, ballRef.current.position)
          .normalize();
        
        setAimDirection({ x: direction.x, z: direction.z });
        
        // Aktualizace směru šipky
        if (arrowRef.current) {
          const angle = Math.atan2(direction.x, -direction.z);
          arrowRef.current.rotation.y = angle;
        }
      }
      
      // Posouvání koule doleva/doprava před hodem
      if (!isPowerAdjusting && ballRef.current) {
        const newX = Math.max(-1.2, Math.min(1.2, intersectPoint.x));
        ballRef.current.position.x = newX;
        setBallPosition({ x: newX, z: ballRef.current.position.z });
      }
    };
    
    const handleMouseDown = (event) => {
      if (isRolling) return;
      
      // Levé tlačítko = negativní spin, Pravé = pozitivní spin
      if (event.button === 0) {
        setSpin(-0.5);
      } else if (event.button === 2) {
        setSpin(0.5);
      }
      
      setIsAiming(true);
      if (arrowRef.current) {
        arrowRef.current.visible = true;
      }
    };
    
    const handleMouseUp = (event) => {
      if (isRolling) return;
      setSpin(0);
    };
    
    const handleKeyDown = (event) => {
      if (isRolling) return;
      
      // Šipka dolů - nabíjení síly
      if (event.key === 'ArrowDown') {
        setIsPowerAdjusting(true);
        if (arrowRef.current) {
          arrowRef.current.visible = true;
        }
      }
      
      // A/D pro přidání spinu
      if (event.key === 'a' || event.key === 'A') {
        setSpin(prev => Math.max(-1, prev - 0.1));
      }
      if (event.key === 'd' || event.key === 'D') {
        setSpin(prev => Math.min(1, prev + 0.1));
      }
    };
    
    const handleKeyUp = (event) => {
      if (isRolling) return;
      
      // Puštění šipky dolů = hod
      if (event.key === 'ArrowDown' && isPowerAdjusting) {
        throwBall();
        setIsPowerAdjusting(false);
        if (arrowRef.current) {
          arrowRef.current.visible = false;
        }
      }
    };
    
    const handleContextMenu = (event) => {
      event.preventDefault(); // Zabránit kontextovému menu
    };
    
    // Připojení event listenerů
    if (mountRef.current) {
      mountRef.current.addEventListener('mousemove', handleMouseMove);
      mountRef.current.addEventListener('mousedown', handleMouseDown);
      mountRef.current.addEventListener('mouseup', handleMouseUp);
      mountRef.current.addEventListener('contextmenu', handleContextMenu);
    }
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    
    // Power interval pro nabíjení síly
    let powerInterval;
    if (isPowerAdjusting) {
      powerInterval = setInterval(() => {
        setPower(prev => {
          const newPower = prev + 2;
          return newPower > 100 ? 0 : newPower;
        });
      }, 20);
    }

    // Resize handler
    const handleResize = () => {
      if (!mountRef.current) return;
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
      window.removeEventListener('resize', handleResize);
      
      if (mountRef.current) {
        mountRef.current.removeEventListener('mousemove', handleMouseMove);
        mountRef.current.removeEventListener('mousedown', handleMouseDown);
        mountRef.current.removeEventListener('mouseup', handleMouseUp);
        mountRef.current.removeEventListener('contextmenu', handleContextMenu);
      }
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
      
      if (powerInterval) {
        clearInterval(powerInterval);
      }
      
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [isPowerAdjusting, isRolling]);

  const throwBall = () => {
    if (isRolling || !ballRef.current) return;
    
    setIsRolling(true);
    setIsAiming(false);
    
    // Nastavení rychlosti podle síly a směru
    const speed = (power / 100) * 30;
    
    ballRef.current.userData.velocity = new THREE.Vector3(
      aimDirection.x * speed,
      0,
      aimDirection.z * speed
    );
    
    // Přidání spinu
    ballRef.current.userData.spin = spin;
    
    // Počkáme až koule dojede
    setTimeout(() => {
      countFallenPins();
    }, 3500);
  };

  const countFallenPins = () => {
    const fallenPins = pinsRef.current.filter(pinGroup => !pinGroup.userData.standing).length;
    const currentThrowScore = fallenPins - score;
    setScore(fallenPins);
    setLastThrowScore(currentThrowScore);
    
    if (fallenPins === 10) {
      // Strike nebo spare
      setTimeout(() => {
        if (throwsLeft === 2) {
          // Strike!
          const frameScore = { frame: frame, score: 'X', total: totalScore + 30 };
          setFrameScores([...frameScores, frameScore]);
          setTotalScore(totalScore + 30);
        } else {
          // Spare!
          const frameScore = { frame: frame, score: '/', total: totalScore + 20 };
          setFrameScores([...frameScores, frameScore]);
          setTotalScore(totalScore + 20);
        }
        nextFrame();
      }, 1500);
    } else {
      setThrowsLeft(throwsLeft - 1);
      
      if (throwsLeft <= 1) {
        // Konec framu
        setTimeout(() => {
          const frameScore = { frame: frame, score: fallenPins, total: totalScore + fallenPins };
          setFrameScores([...frameScores, frameScore]);
          setTotalScore(totalScore + fallenPins);
          nextFrame();
        }, 1500);
      } else {
        // Ještě jeden hod
        setTimeout(() => {
          resetBall();
          setIsRolling(false);
        }, 1500);
      }
    }
  };

  const nextFrame = () => {
    if (frame >= 10) {
      // Konec hry
      alert(`Konec hry! Celkové skóre: ${totalScore}`);
      resetGame();
    } else {
      setFrame(frame + 1);
      setThrowsLeft(2);
      setScore(0);
      resetPins();
      resetBall();
      setIsRolling(false);
    }
  };

  const resetBall = () => {
    if (ballRef.current) {
      ballRef.current.position.set(0, 0.4, 12);
      ballRef.current.userData.velocity.set(0, 0, 0);
      ballRef.current.userData.angularVelocity.set(0, 0, 0);
      ballRef.current.userData.spin = 0;
      ballRef.current.rotation.set(0, 0, 0);
      setBallPosition({ x: 0, z: 12 });
      setPower(0);
      setSpin(0);
    }
  };

  const resetPins = () => {
    pinsRef.current.forEach(pinGroup => {
      pinGroup.userData.standing = true;
      pinGroup.position.copy(pinGroup.userData.originalPosition);
      pinGroup.rotation.set(0, 0, 0);
      pinGroup.userData.velocity.set(0, 0, 0);
      pinGroup.userData.angularVelocity.set(0, 0, 0);
    });
  };

  const resetGame = () => {
    setScore(0);
    setTotalScore(0);
    setThrowsLeft(2);
    setFrame(1);
    setFrameScores([]);
    setLastThrowScore(null);
    resetPins();
    resetBall();
    setIsRolling(false);
  };

  return (
    <div className="w-full h-screen bg-gray-900 relative">
      <div ref={mountRef} className="w-full h-full" />
      
      {/* UI Overlay */}
      <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/70 to-transparent">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-white text-center mb-4">🎳 3D Bowling</h1>
          
          <div className="flex justify-between items-center text-white">
            <div className="bg-black/50 px-4 py-2 rounded">
              <span className="text-sm opacity-70">Frame</span>
              <p className="text-2xl font-bold">{frame}/10</p>
            </div>
            
            <div className="bg-black/50 px-4 py-2 rounded">
              <span className="text-sm opacity-70">Hody</span>
              <p className="text-2xl font-bold">{throwsLeft}</p>
            </div>
            
            <div className="bg-black/50 px-4 py-2 rounded">
              <span className="text-sm opacity-70">Tento frame</span>
              <p className="text-2xl font-bold">{score}/10</p>
            </div>
            
            <div className="bg-black/50 px-4 py-2 rounded">
              <span className="text-sm opacity-70">Celkové skóre</span>
              <p className="text-3xl font-bold text-yellow-400">{totalScore}</p>
            </div>
          </div>
          
          {lastThrowScore !== null && (
            <div className="text-center mt-2">
              <p className="text-xl text-yellow-300">
                {lastThrowScore === 10 && throwsLeft === 1 ? "⚡ STRIKE!" : 
                 lastThrowScore === 10 && throwsLeft === 0 ? "✨ SPARE!" :
                 `Srazil jsi ${lastThrowScore} kuželek!`}
              </p>
            </div>
          )}
        </div>
      </div>
      
      {/* Ovládání */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
        <div className="max-w-md mx-auto space-y-4">
          {!isRolling && (
            <>
              <div className="bg-black/50 p-3 rounded text-white">
                <h3 className="font-bold mb-2">🎮 Ovládání:</h3>
                <ul className="text-sm space-y-1">
                  <li>🖱️ <strong>Pohyb myši</strong> - pozice koule a směr hodu</li>
                  <li>⬇️ <strong>Držet šipku dolů</strong> - nabíjení síly (pusť pro hod)</li>
                  <li>🖱️ <strong>Levé tlačítko</strong> - negativní spin (doleva)</li>
                  <li>🖱️ <strong>Pravé tlačítko</strong> - pozitivní spin (doprava)</li>
                  <li>⌨️ <strong>A/D</strong> - jemné nastavení spinu</li>
                </ul>
              </div>
              
              <div className="flex justify-between gap-2">
                <div className="bg-black/50 p-2 rounded text-white flex-1">
                  <div className="text-xs opacity-70">Síla</div>
                  <div className="h-2 bg-gray-700 rounded overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-green-500 to-red-500 transition-all"
                      style={{ width: `${power}%` }}
                    />
                  </div>
                  <div className="text-center font-bold">{power}%</div>
                </div>
                
                <div className="bg-black/50 p-2 rounded text-white flex-1">
                  <div className="text-xs opacity-70">Spin</div>
                  <div className="flex items-center justify-center">
                    <span className="text-xs">L</span>
                    <div className="h-2 w-20 bg-gray-700 rounded mx-2 relative">
                      <div 
                        className="absolute top-0 h-full w-1 bg-yellow-400"
                        style={{ left: `${50 + spin * 50}%` }}
                      />
                    </div>
                    <span className="text-xs">R</span>
                  </div>
                  <div className="text-center font-bold">
                    {spin > 0 ? '→' : spin < 0 ? '←' : '↑'}
                  </div>
                </div>
              </div>
              
              {isPowerAdjusting && (
                <div className="text-center text-yellow-300 animate-pulse">
                  <p className="text-xl">Drž šipku dolů! Síla: {power}%</p>
                </div>
              )}
            </>
          )}
          
          {isRolling && (
            <div className="text-center text-white">
              <p className="text-xl animate-pulse">🎳 Koule letí...</p>
            </div>
          )}
          
          <button
            onClick={resetGame}
            className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded transition-colors text-sm"
          >
            Nová hra
          </button>
        </div>
      </div>
      
      {/* Historie framů */}
      {frameScores.length > 0 && (
        <div className="absolute top-32 left-4 bg-black/50 p-3 rounded">
          <p className="text-white text-sm mb-2">Historie:</p>
          {frameScores.slice(-5).map((fs, i) => (
            <div key={i} className="text-white text-xs mb-1">
              Frame {fs.frame}: {fs.score} (Σ {fs.total})
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Bowling3D;