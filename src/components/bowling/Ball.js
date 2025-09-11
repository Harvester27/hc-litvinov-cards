import * as THREE from 'three';

export const createBall = (scene) => {
  // Koule s realistickým vzhledem - ZVĚTŠÍME JI
  const ballGeometry = new THREE.SphereGeometry(0.5, 32, 32); // Zvětšeno z 0.4 na 0.5
  const ballMaterial = new THREE.MeshPhongMaterial({ 
    color: 0xff0000,  // Jasnější červená pro lepší viditelnost
    shininess: 150,
    specular: 0xffffff,
    emissive: 0x220000,  // Přidáme emissive pro lepší viditelnost
    emissiveIntensity: 0.2
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
  
  ball.position.set(0, 0.5, 12);  // Zvýšíme pozici Y z 0.4 na 0.5
  ball.castShadow = true;
  ball.visible = true;  // Explicitně nastavíme viditelnost
  ball.userData = { 
    velocity: new THREE.Vector3(0, 0, 0), 
    angularVelocity: new THREE.Vector3(0, 0, 0),
    spin: 0
  };
  
  scene.add(ball);
  console.log('Koule vytvořena na pozici:', ball.position);  // Debug log
  return ball;
};

export const createAimArrow = (scene) => {
  // Směrová šipka pro míření
  const arrowGroup = new THREE.Group();
  
  // Tělo šipky
  const arrowBodyGeometry = new THREE.CylinderGeometry(0.05, 0.05, 3, 8);
  const arrowMaterial = new THREE.MeshPhongMaterial({ 
    color: 0x00ff00, 
    opacity: 0.7, 
    transparent: true 
  });
  const arrowBody = new THREE.Mesh(arrowBodyGeometry, arrowMaterial);
  arrowBody.rotation.x = Math.PI / 2;
  arrowBody.position.z = -1.5;
  arrowGroup.add(arrowBody);
  
  // Špička šipky
  const arrowHeadGeometry = new THREE.ConeGeometry(0.15, 0.5, 8);
  const arrowHead = new THREE.Mesh(arrowHeadGeometry, arrowMaterial);
  arrowHead.rotation.x = Math.PI / 2;
  arrowHead.position.z = -3.25;
  arrowGroup.add(arrowHead);
  
  arrowGroup.visible = false;
  scene.add(arrowGroup);
  return arrowGroup;
};

export const animateBall = (ball, pins, spin) => {
  if (!ball || ball.userData.velocity.length() <= 0.01) return false;
  
  // Pohyb koule
  ball.position.add(ball.userData.velocity.clone().multiplyScalar(0.016));
  
  // Rotace koule podle směru pohybu
  const rotationAxis = new THREE.Vector3(
    ball.userData.velocity.z,
    0,
    -ball.userData.velocity.x
  ).normalize();
  
  const rotationSpeed = ball.userData.velocity.length() * 0.1;
  ball.rotateOnWorldAxis(rotationAxis, rotationSpeed);
  
  // Aplikace spinu (boční rotace)
  if (ball.userData.spin !== 0) {
    // Spin ovlivňuje trajektorii
    const spinEffect = ball.userData.spin * 0.002;
    ball.userData.velocity.x += spinEffect;
    
    // Rotace kolem vertikální osy
    ball.rotateY(ball.userData.spin * 0.05);
  }
  
  // Tření a zpomalení
  ball.userData.velocity.multiplyScalar(0.993);
  ball.userData.spin *= 0.98;
  
  // Kontrola hranic dráhy (žlábky)
  if (Math.abs(ball.position.x) > 1.3) {
    // Koule spadla do žlábku - rychlé zpomalení
    ball.userData.velocity.multiplyScalar(0.9);
    ball.position.y = Math.max(0.3, ball.position.y - 0.01);  // Změněno z 0.2 na 0.3
  }
  
  // Kontrola kolizí s kuželkami
  pins.forEach(pinGroup => {
    if (pinGroup.userData.standing) {
      const pinPos = pinGroup.userData.originalPosition;
      const distance = ball.position.distanceTo(pinPos);
      
      if (distance < 0.55) {
        // Kolize!
        pinGroup.userData.standing = false;
        
        // Výpočet směru nárazu
        const hitDirection = new THREE.Vector3()
          .subVectors(pinPos, ball.position)
          .normalize();
        
        // Přenos hybnosti s realistickým faktorem
        const impactForce = ball.userData.velocity.length() * 0.4;
        pinGroup.userData.velocity = hitDirection.multiplyScalar(impactForce);
        pinGroup.userData.velocity.y = Math.random() * 0.2 + 0.1;
        
        // Náhodná rotace po nárazu
        pinGroup.userData.angularVelocity = new THREE.Vector3(
          (Math.random() - 0.5) * 0.3,
          (Math.random() - 0.5) * 0.2,
          (Math.random() - 0.5) * 0.3
        );
        
        // Zpomalení koule po nárazu
        ball.userData.velocity.multiplyScalar(0.8);
        
        // Lehké odražení koule
        const bounceDirection = new THREE.Vector3()
          .subVectors(ball.position, pinPos)
          .normalize();
        ball.userData.velocity.add(bounceDirection.multiplyScalar(0.5));
      }
    }
  });
  
  // Reset koule když vyjede z dráhy
  if (ball.position.z < -15 || Math.abs(ball.position.x) > 2.5) {
    return true; // Signál že koule dojela
  }
  
  return false;
};

export const resetBall = (ball) => {
  if (!ball) return;
  
  ball.position.set(0, 0.5, 12);  // Stejná výška jako při vytvoření
  ball.userData.velocity.set(0, 0, 0);
  ball.userData.angularVelocity.set(0, 0, 0);
  ball.userData.spin = 0;
  ball.rotation.set(0, 0, 0);
  ball.visible = true;  // Ujistíme se, že je viditelná
  console.log('Koule resetována na pozici:', ball.position);  // Debug log
};