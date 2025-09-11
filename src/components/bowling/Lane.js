import * as THREE from 'three';

export const createLane = (scene) => {
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
  const arrowMaterial = new THREE.MeshPhongMaterial({ 
    color: 0x000000, 
    opacity: 0.3, 
    transparent: true 
  });
  
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
};

export const setupLighting = (scene) => {
  // Světla - zvýšíme intenzitu
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);  // Zvýšeno z 0.4
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);  // Zvýšeno z 0.8
  directionalLight.position.set(5, 10, 5);
  directionalLight.castShadow = true;
  directionalLight.shadow.camera.near = 0.1;
  directionalLight.shadow.camera.far = 50;
  directionalLight.shadow.camera.left = -20;
  directionalLight.shadow.camera.right = 20;
  directionalLight.shadow.camera.top = 20;
  directionalLight.shadow.camera.bottom = -20;
  scene.add(directionalLight);

  // Dodatečné bodové světlo pro lepší atmosféru
  const spotLight = new THREE.SpotLight(0xffffff, 0.8);  // Zvýšeno z 0.5
  spotLight.position.set(0, 10, 10);
  spotLight.angle = Math.PI / 6;
  spotLight.penumbra = 0.3;
  spotLight.castShadow = true;
  scene.add(spotLight);
  
  // Přidáme další světlo přímo na kouli
  const pointLight = new THREE.PointLight(0xffffff, 0.5);
  pointLight.position.set(0, 5, 12);  // Pozice nad koulí
  scene.add(pointLight);
};

export const setupCamera = (aspectRatio) => {
  const camera = new THREE.PerspectiveCamera(
    60,
    aspectRatio,
    0.1,
    100
  );
  camera.position.set(0, 10, 18);  // Zvýšíme kameru a posuneme blíž
  camera.lookAt(0, 0, 0);  // Díváme se více na střed scény
  return camera;
};

export const setupRenderer = (width, height) => {
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(width, height);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  return renderer;
};

export const setupScene = () => {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x1a1a2e);
  scene.fog = new THREE.Fog(0x1a1a2e, 10, 50);
  return scene;
};