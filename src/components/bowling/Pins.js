import * as THREE from 'three';

// Vytvoření geometrie kuželky
const createPinGeometry = () => {
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

// Vytvoření jednotlivé kuželky s pruhy
const createPinWithStripes = (x, z, index) => {
  const pinGroup = new THREE.Group();
  
  // Materiál pro bílou část kuželky
  const whiteMaterial = new THREE.MeshPhongMaterial({ 
    color: 0xffffff,
    shininess: 100,
    specular: 0x222222
  });
  
  // Hlavní bílá kuželka
  const pinGeometry = createPinGeometry();
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

export const createPins = (scene) => {
  const pins = [];
  
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
  
  return pins;
};

export const animatePins = (pins) => {
  // Kontrola kolizí mezi kuželkami (dominový efekt)
  pins.forEach((pin1, i) => {
    if (!pin1.userData.standing && pin1.userData.velocity.length() > 0.1) {
      pins.forEach((pin2, j) => {
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
  
  // Animace padajících kuželek
  pins.forEach(pinGroup => {
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
};

export const resetPins = (pins) => {
  pins.forEach(pinGroup => {
    pinGroup.userData.standing = true;
    pinGroup.position.copy(pinGroup.userData.originalPosition);
    pinGroup.rotation.set(0, 0, 0);
    pinGroup.userData.velocity.set(0, 0, 0);
    pinGroup.userData.angularVelocity.set(0, 0, 0);
  });
};

export const countFallenPins = (pins) => {
  return pins.filter(pinGroup => !pinGroup.userData.standing).length;
};