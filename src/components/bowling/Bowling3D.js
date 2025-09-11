import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { createBall, createAimArrow, animateBall, resetBall } from './Ball';
import { createPins, animatePins, resetPins, countFallenPins } from './Pins';
import { createLane, setupLighting, setupCamera, setupRenderer, setupScene } from './Lane';
import { GameHeader, Controls, Instructions, ScoreHistory } from './UI';

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
  const [aimDirection, setAimDirection] = useState({ x: 0, z: -1 });  // Správný směr ke kuželkám
  const [spin, setSpin] = useState(0);
  const [isAiming, setIsAiming] = useState(false);

  useEffect(() => {
    if (!mountRef.current) return;

    // Nastavení scény
    const scene = setupScene();
    sceneRef.current = scene;

    // Kamera
    const camera = setupCamera(mountRef.current.clientWidth / mountRef.current.clientHeight);
    cameraRef.current = camera;

    // Renderer
    const renderer = setupRenderer(mountRef.current.clientWidth, mountRef.current.clientHeight);
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Světla
    setupLighting(scene);

    // Vytvoření dráhy
    createLane(scene);

    // Vytvoření koule
    const ball = createBall(scene);
    ballRef.current = ball;
    
    // Vytvoření směrové šipky
    const arrow = createAimArrow(scene);
    arrow.position.copy(ball.position);
    arrowRef.current = arrow;

    // Vytvoření kuželek
    const pins = createPins(scene);
    pinsRef.current = pins;

    // Animační smyčka
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);
      
      // Animace koule
      if (ballRef.current) {
        const ballFinished = animateBall(ballRef.current, pinsRef.current, spin);
        
        if (ballFinished && ballRef.current.userData.velocity.length() > 0.01) {
          setTimeout(() => {
            ballRef.current.userData.velocity.set(0, 0, 0);
            ballRef.current.userData.spin = 0;
          }, 500);
        }
      }
      
      // Animace kuželek
      animatePins(pinsRef.current);
      
      // Aktualizace pozice šipky
      if (arrowRef.current && !isRolling && ballRef.current) {
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
        // Cílový bod musí být před koulí (směrem ke kuželkám)
        // Omezíme cílový bod tak, aby byl vždy směrem ke kuželkám
        const targetZ = Math.min(intersectPoint.z, ballRef.current.position.z - 2);
        const targetX = Math.max(-2, Math.min(2, intersectPoint.x));
        
        const targetPoint = new THREE.Vector3(targetX, 0, targetZ);
        
        // Výpočet směru od koule k cílovému bodu
        const direction = new THREE.Vector3()
          .subVectors(targetPoint, ballRef.current.position)
          .normalize();
        
        // Ujistíme se, že Z složka je záporná (směrem ke kuželkám)
        if (direction.z > -0.5) {
          direction.z = -0.9;
          direction.normalize();
        }
        
        setAimDirection({ x: direction.x, z: direction.z });
        
        // Aktualizace směru šipky
        if (arrowRef.current) {
          const angle = Math.atan2(direction.x, -direction.z);
          arrowRef.current.rotation.y = angle;
        }
      }
      
      // Posouvání koule doleva/doprava před hodem
      if (!isPowerAdjusting && ballRef.current && intersectPoint) {
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
    
    // Pokud je síla 0, nastavíme alespoň nějakou minimální
    const actualPower = power === 0 ? 50 : power;
    
    // Nastavení rychlosti podle síly
    const speed = Math.max(15, (actualPower / 100) * 35);  // Minimální rychlost 15
    
    // Zajistíme, že koule vždy poletí směrem ke kuželkám
    // Pokud není nastaven směr, použijeme přímý směr
    let finalDirection = {
      x: aimDirection.x || 0,
      z: aimDirection.z || -1
    };
    
    // Pokud je směr špatný (pozitivní Z), opravíme ho
    if (finalDirection.z >= 0) {
      console.log('Opravuji špatný směr!');
      finalDirection = { x: 0, z: -1 };
    }
    
    // Normalizace směru
    const length = Math.sqrt(finalDirection.x * finalDirection.x + finalDirection.z * finalDirection.z);
    const normalizedDirection = {
      x: finalDirection.x / length,
      z: finalDirection.z / length
    };
    
    console.log('===== HOD KOULE =====');
    console.log('Síla:', actualPower, '%');
    console.log('Rychlost:', speed);
    console.log('Směr X:', normalizedDirection.x.toFixed(2));
    console.log('Směr Z:', normalizedDirection.z.toFixed(2));
    console.log('Spin:', spin);
    console.log('Pozice koule:', ballRef.current.position.toArray());
    
    ballRef.current.userData.velocity = new THREE.Vector3(
      normalizedDirection.x * speed * 0.3,  // Menší boční pohyb
      0,
      normalizedDirection.z * speed  // Hlavní pohyb vpřed (záporný = ke kuželkám)
    );
    
    // Přidání spinu
    ballRef.current.userData.spin = spin;
    
    // Počkáme až koule dojede
    setTimeout(() => {
      handleThrowComplete();
    }, 3500);
  };

  const handleThrowComplete = () => {
    const fallenPins = countFallenPins(pinsRef.current);
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
          resetBall(ballRef.current);
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
      resetPins(pinsRef.current);
      resetBall(ballRef.current);
      setIsRolling(false);
    }
  };

  const resetGame = () => {
    setScore(0);
    setTotalScore(0);
    setThrowsLeft(2);
    setFrame(1);
    setFrameScores([]);
    setLastThrowScore(null);
    setPower(0);
    setSpin(0);
    setBallPosition({ x: 0, z: 12 });
    resetPins(pinsRef.current);
    resetBall(ballRef.current);
    setIsRolling(false);
  };

  const testThrow = () => {
    if (isRolling || !ballRef.current) return;
    
    // Nastavíme automaticky sílu na 70% pro test
    setPower(70);
    setSpin(0);
    setAimDirection({ x: 0, z: -1 }); // Přímo vpřed
    
    // Počkáme chvilku a hodíme
    setTimeout(() => {
      throwBall();
    }, 100);
  };

  return (
    <div className="w-full h-screen bg-gray-900 relative">
      <div ref={mountRef} className="w-full h-full" />
      
      <GameHeader 
        frame={frame}
        throwsLeft={throwsLeft}
        score={score}
        totalScore={totalScore}
        lastThrowScore={lastThrowScore}
      />
      
      <Instructions />
      
      <Controls 
        isRolling={isRolling}
        isPowerAdjusting={isPowerAdjusting}
        power={power}
        spin={spin}
        onResetGame={resetGame}
        onTestThrow={testThrow}
      />
      
      <ScoreHistory frameScores={frameScores} />
    </div>
  );
};

export default Bowling3D;